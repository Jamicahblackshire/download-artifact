export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SafetyDecision {
  allowed: boolean;
  risk: RiskLevel;
  reason: string;
  requiresApproval: boolean;
}

const CRITICAL_PATTERNS = [
  /rm\s+-rf\s+\//i,
  /mkfs/i,
  /dd\s+if=/i,
  /shutdown/i,
  /reboot/i,
  /curl\s+.*\|\s*(sh|bash)/i,
  /wget\s+.*\|\s*(sh|bash)/i,
  /chmod\s+-R\s+777\s+\//i,
  /delete\s+repository/i,
  /drop\s+database/i,
  /destroy/i,
];

const HIGH_RISK_PATTERNS = [
  /git\s+push/i,
  /npm\s+publish/i,
  /railway\s+deploy/i,
  /railway/i,
  /cloudflare/i,
  /dns_records/i,
  /n8n.*execute/i,
  /stripe/i,
  /square/i,
  /payment/i,
  /\bDELETE\b/i,
];

const MEDIUM_RISK_PATTERNS = [
  /npm\s+install/i,
  /npm\s+run\s+build/i,
  /git\s+checkout/i,
  /git\s+commit/i,
  /curl/i,
  /wget/i,
  /node/i,
  /python/i,
];

export function inspectCommand(command: string): SafetyDecision {
  if (CRITICAL_PATTERNS.some((pattern) => pattern.test(command))) {
    return {
      allowed: false,
      risk: 'critical',
      reason: 'Critical command requires explicit owner approval every time.',
      requiresApproval: true,
    };
  }

  if (HIGH_RISK_PATTERNS.some((pattern) => pattern.test(command))) {
    return {
      allowed: false,
      risk: 'high',
      reason: 'High-risk command requires owner approval before execution.',
      requiresApproval: true,
    };
  }

  if (MEDIUM_RISK_PATTERNS.some((pattern) => pattern.test(command))) {
    return {
      allowed: true,
      risk: 'medium',
      reason: 'Medium-risk command allowed with logging.',
      requiresApproval: false,
    };
  }

  return {
    allowed: true,
    risk: 'low',
    reason: 'Low-risk command allowed.',
    requiresApproval: false,
  };
}
