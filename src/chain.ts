import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const AUDIT_REGISTRY_ABI = [
  'function submitAudit(string contractHash, string reportHash, uint256 riskScore, uint256 agentTokenId) returns (uint256)',
  'function getAudit(uint256 auditId) view returns (string contractHash, string reportHash, uint256 riskScore, uint256 agentTokenId, uint256 timestamp)',
  'event AuditSubmitted(uint256 indexed auditId, string contractHash, uint256 riskScore, uint256 agentTokenId, uint256 timestamp)'
];

export function getProvider(): ethers.JsonRpcProvider {
  const rpc = process.env.MANTLE_RPC || 'https://rpc.mantle.xyz';
  return new ethers.JsonRpcProvider(rpc, {
    chainId: 5000,
    name: 'mantle'
  });
}

export function getSigner(): ethers.Wallet {
  const privateKey = process.env.AGENT_PRIVATE_KEY;
  if (!privateKey) throw new Error('AGENT_PRIVATE_KEY not set in .env');
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
}

export function getRegistry(): ethers.Contract {
  const address = process.env.AUDIT_REGISTRY_ADDRESS;
  if (!address) throw new Error('AUDIT_REGISTRY_ADDRESS not set in .env — deploy contract first');
  const signer = getSigner();
  return new ethers.Contract(address, AUDIT_REGISTRY_ABI, signer);
}

export async function submitAuditOnChain(
  contractHash: string,
  reportHash: string,
  riskScore: number
): Promise<string> {
  const registry = getRegistry();
  const agentTokenId = process.env.AGENT_ERC8004_ID || '46241';

  console.log('Submitting audit to Mantle mainnet...');
  const tx = await registry.submitAudit(
    contractHash,
    reportHash,
    riskScore,
    agentTokenId
  );

  console.log(`Tx sent: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Confirmed in block ${receipt.blockNumber}`);
  console.log(`View on Mantlescan: https://mantlescan.xyz/tx/${tx.hash}`);

  return tx.hash;
}

export async function checkConnection(): Promise<void> {
  const provider = getProvider();
  const block = await provider.getBlockNumber();
  const balance = await provider.getBalance(
    process.env.AGENT_WALLET || ''
  );
  console.log(`Connected to Mantle mainnet`);
  console.log(`Latest block: ${block}`);
  console.log(`Agent wallet balance: ${ethers.formatEther(balance)} MNT`);
}
