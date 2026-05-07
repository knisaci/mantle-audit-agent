import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import type { AuditReport, AuditRequest, Finding } from './types.js';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt.js';
import { submitAuditOnChain } from './chain.js';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function computeHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

function computeRiskScore(findings: Finding[]): number {
  const weights = { critical: 25, high: 10, medium: 4, low: 1, info: 0 };
  const raw = findings.reduce((sum, f) => sum + weights[f.severity], 0);
  return Math.min(100, raw);
}

function generateAuditId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function runAudit(
  request: AuditRequest,
  postOnChain: boolean = false
): Promise<AuditReport> {
  const { soliditySource, contractName } = request;

  console.log(`\nStarting audit: ${contractName}`);
  console.log('Calling Claude API...');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(contractName, soliditySource),
      },
    ],
  });

  const rawText = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let parsed: { findings: Finding[]; summary: string; riskScore: number };

  try {
    const clean = rawText.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(clean);
  } catch {
    throw new Error(`Claude returned invalid JSON: ${rawText.slice(0, 200)}`);
  }

  const contractHash = computeHash(soliditySource);
  const reportHash = computeHash(JSON.stringify(parsed));
  const riskScore = parsed.riskScore ?? computeRiskScore(parsed.findings);

  const report: AuditReport = {
    auditId: generateAuditId(),
    contractName,
    contractHash,
    timestamp: new Date().toISOString(),
    agentWallet: process.env.AGENT_WALLET || '',
    agentErc8004Id: Number(process.env.AGENT_ERC8004_ID || 46241),
    findings: parsed.findings,
    summary: parsed.summary,
    riskScore,
  };

  console.log(`\nAudit complete.`);
  console.log(`Risk score: ${riskScore}/100`);
  console.log(`Findings: ${report.findings.length}`);
  report.findings.forEach((f) =>
    console.log(`  [${f.severity.toUpperCase()}] ${f.title}`)
  );

  if (postOnChain) {
    const txHash = await submitAuditOnChain(contractHash, reportHash, riskScore);
    report.onChainTxHash = txHash;
  }

  return report;
}
