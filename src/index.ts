import { readFileSync } from 'fs';
import { runAudit } from './auditor.js';
import { checkConnection } from './chain.js';
import type { AuditRequest } from './types.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'check': {
      await checkConnection();
      break;
    }

    case 'audit': {
      const filePath = args[1];
      const contractName = args[2] || 'UnknownContract';
      const postOnChain = args.includes('--on-chain');

      if (!filePath) {
        console.error('Usage: npm run audit -- audit <path/to/Contract.sol> <ContractName> [--on-chain]');
        process.exit(1);
      }

      const soliditySource = readFileSync(filePath, 'utf-8');
      const request: AuditRequest = { soliditySource, contractName };
      const report = await runAudit(request, postOnChain);

      console.log('\n--- FULL REPORT ---');
      console.log(JSON.stringify(report, null, 2));
      break;
    }

    default: {
      console.log('Mantle Audit Agent');
      console.log('');
      console.log('Commands:');
      console.log('  check                          — test Mantle connection + wallet balance');
      console.log('  audit <file> <name> [--on-chain] — audit a Solidity contract');
      console.log('');
      console.log('Examples:');
      console.log('  npm run audit -- check');
      console.log('  npm run audit -- audit contracts/AuditRegistry.sol AuditRegistry');
      console.log('  npm run audit -- audit contracts/AuditRegistry.sol AuditRegistry --on-chain');
    }
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
