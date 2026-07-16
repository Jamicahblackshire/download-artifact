export declare type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export interface SafetyDecision {
    allowed: boolean;
    risk: RiskLevel;
    reason: string;
    requiresApproval: boolean;
}
export declare function inspectCommand(command: string): SafetyDecision;
//# sourceMappingURL=risk-policy.d.ts.map