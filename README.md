# MantleAudit — AI-Powered Smart Contract Auditor

An autonomous AI agent that audits Solidity smart contracts on Mantle network, posts every finding on-chain, and sells audit services to other agents via ACP.

> **Live on Mantle Mainnet** · [AuditRegistry Contract](https://mantlescan.xyz/address/0x07206421FaFFe4ABfA3Ca1F12ea2eAaB487a2f10#code) · [GitHub](https://github.com/knisaci/mantle-audit-agent)

---

## What It Does

MantleAudit takes a Solidity smart contract as input, runs a three-pass AI analysis using Claude, and returns a structured security report. Every audit is posted on-chain to the AuditRegistry contract on Mantle mainnet — creating a permanent, verifiable record of AI agent activity.

**Three-pass audit engine:**
1. Vulnerability scan — reentrancy, access control, integer overflow, unchecked calls
2. Gas optimisation — storage inefficiencies, loop costs, Mantle-specific savings
3. Best practices — events, NatSpec, error handling, upgrade risks

**Mantle-specific analysis** — the auditor understands MNT vs ETH differences, OP Stack message passing, Mantle DA considerations, and Mantle DeFi ecosystem integrations (Merchant Moe, Agni Finance).

---

## Deployed Contract

| Item | Detail |
|---|---|
| Contract | AuditRegistry |
| Address | `0x07206421FaFFe4ABfA3Ca1F12ea2eAaB487a2f10` |
| Network | Mantle Mainnet (Chain ID: 5000) |
| Verified | [Mantlescan](https://mantlescan.xyz/address/0x07206421FaFFe4ABfA3Ca1F12ea2eAaB487a2f10#code) |
| Agent Wallet | `0x3E5318AAb9Ed1902AB056cce42ACE2C95bb9D659` |

---

## Setup

**Requirements:** Node.js 18+, npm

```bash
git clone https://github.com/knisaci/mantle-audit-agent
cd mantle-audit-agent
npm install
```

Create `.env`:
---

## Usage

**Test Mantle connection:**
```bash
npm run audit -- check
```

**Audit a contract (local report only):**
```bash
npm run audit -- audit contracts/VulnerableExample.sol VulnerableExample
```

**Audit and post result on-chain:**
```bash
npm run audit -- audit contracts/VulnerableExample.sol VulnerableExample --on-chain
```

---

## Sample Output

```json
{
  "contractName": "VulnerableExample",
  "riskScore": 95,
  "findings": [
    {
      "severity": "critical",
      "category": "reentrancy",
      "title": "Classic Reentrancy Vulnerability in withdraw Function",
      "line": 13,
      "confidence": 100
    }
  ],
  "onChainTxHash": "0x80793dd72d1a74d7d285f08fda11b324bdd47f93bf767c400d2176527730f862"
}
```

---

## Tech Stack

| Component | Technology |
|---|---|
| AI Engine | Claude API (claude-sonnet-4-5) |
| Language | TypeScript / Node.js |
| Blockchain | Mantle Mainnet (Chain ID 5000) |
| Smart Contract | Solidity 0.8.35, verified on Mantlescan |
| Chain interaction | ethers.js v6 |
| Agent economy | ACP v2 (openclaw) |

---

## Hackathon

Built for the **Mantle Turing Test Hackathon 2026** — Agentic Economy track (RealClaw Real-Life Expansion path).

Smart contract auditing is a real-world, high-value use case that benefits directly from AI agent autonomy. MantleAudit demonstrates that AI agents can perform expert-level security analysis, post verifiable results on-chain, and sell that capability to other agents — without human intervention.
