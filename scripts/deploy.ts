import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const privateKey = process.env.AGENT_PRIVATE_KEY;
  if (!privateKey) throw new Error('AGENT_PRIVATE_KEY not set');

  const provider = new ethers.JsonRpcProvider('https://rpc.mantle.xyz', {
    chainId: 5000,
    name: 'mantle'
  });

  const wallet = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log(`Deploying from: ${wallet.address}`);
  console.log(`Balance: ${ethers.formatEther(balance)} MNT`);

  // Compile with solc
  console.log('\nCompiling AuditRegistry.sol...');
  execSync(
    'npx solcjs --optimize --bin --abi contracts/AuditRegistry.sol --output-dir artifacts/',
    { stdio: 'inherit' }
  );

  // Read compiled artifacts
  const artifactBase = 'artifacts/contracts_AuditRegistry_sol_AuditRegistry';
  const bytecode = readFileSync(`${artifactBase}.bin`, 'utf-8');
  const abi = JSON.parse(readFileSync(`${artifactBase}.abi`, 'utf-8'));

  // Deploy
  console.log('\nDeploying to Mantle mainnet...');
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();

  console.log(`Tx hash: ${contract.deploymentTransaction()?.hash}`);
  console.log('Waiting for confirmation...');

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`\n✅ AuditRegistry deployed!`);
  console.log(`Address: ${address}`);
  console.log(`Mantlescan: https://mantlescan.xyz/address/${address}`);
  console.log(`\nAdd this to your .env:`);
  console.log(`AUDIT_REGISTRY_ADDRESS=${address}`);
}

main().catch((err) => {
  console.error('Deploy failed:', err.message);
  process.exit(1);
});
