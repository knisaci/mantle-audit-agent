export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type Category =
  | 'reentrancy'
  | 'access-control'
  | 'integer-overflow'
  | 'unchecked-calls'
  | 'gas-optimization'
  | 'mantle-specific'
  | 'best-practices'
  | 'logic-error';

export interface Finding {
  id: string;
  severity: Severity;
  category: Category;
  title: string;
  description: string;
  recommendation: string;
  line?: number;
  confidence: number; // 0-100
}

export interface AuditReport {
  auditId: string;
  contractName: string;
  contractHash: string;
  timestamp: string;
  agentWallet: string;
  agentErc8004Id: number;
  findings: Finding[];
  summary: string;
  riskScore: number; // 0-100
  onChainTxHash?: string;
}

export interface AuditRequest {
  soliditySource: string;
  contractName: string;
}
