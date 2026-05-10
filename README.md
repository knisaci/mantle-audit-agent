MantleAudit — AI-Powered Smart Contract Auditor
An autonomous AI agent that audits Solidity smart contracts on Mantle network, posts every finding on-chain, and sells audit services to other agents via ACP.
Live on Mantle Mainnet · AuditRegistry Contract · GitHub
What It Does
MantleAudit takes a Solidity smart contract as input, runs a three-pass AI analysis using Claude, and returns a structured security report. Every audit is posted on-chain to the AuditRegistry contract on Mantle mainnet — creating a permanent, verifiable record of AI agent activity.
Three-pass audit engine:

Vulnerability scan — reentrancy, access control, integer overflow, unchecked calls
Gas optimisation — storage inefficiencies, loop costs, Mantle-specific savings
Best practices — events, NatSpec, error handling, upgrade risks

Mantle-specific analysis — the auditor understands MNT vs ETH differences, OP Stack message passing, Mantle DA considerations, and Mantle DeFi ecosystem integrations (Merchant Moe, Agni Finance).
Deployed Contract

Contract: AuditRegistry
Address: 0x07206421FaFFe4ABfA3Ca1F12ea2eAaB487a2f10
Network: Mantle Mainnet (Chain ID: 5000)
Verified: https://mantlescan.xyz/address/0x07206421FaFFe4ABfA3Ca1F12ea2eAaB487a2f10#code
Agent Wallet: 0x3E5318AAb9Ed1902AB056cce42ACE2C95bb9D659

Setup
Requirements: Node.js 18+, npm
git clone https://github.com/knisaci/mantle-audit-agent
cd mantle-audit-agent
npm install
Create .env with your keys — see the .env section in the repo.
Usage
Test Mantle connection:
npm run audit -- check
Audit a contract (local report only):
npm run audit -- audit contracts/VulnerableExample.sol VulnerableExample
Audit and post result on-chain:
npm run audit -- audit contracts/VulnerableExample.sol VulnerableExample --on-chain
Tech Stack

AI Engine: Claude API (claude-sonnet-4-5)
Language: TypeScript / Node.js
Blockchain: Mantle Mainnet (Chain ID 5000)
Smart Contract: Solidity 0.8.35, verified on Mantlescan
Chain interaction: ethers.js v6
Agent economy: ACP v2 (openclaw)

Hackathon
Built for the Mantle Turing Test Hackathon 2026 — Agentic Economy track (RealClaw Real-Life Expansion path).