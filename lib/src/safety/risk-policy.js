"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CRITICAL_PATTERNS = [
    /rm\s+-rf\s+\//i,
    /mkfs/i,
    /dd\s+if=/i,
    /shutdown/i,
    /reboot/i,
    /curl\s+.*\|\s*(sh|bash)/i,
    /wget\s+.*\|\s*(sh|bash)/i,
    /chmod\s+-R\s+777\s+\//i,
];
const HIGH_RISK_PATTERNS = [
    /railway\s+deploy/i,
    /git\s+push/i,
    /npm\s+publish/i,
    /\bDELETE\b/i,
    /cloudflare/i,
    /dns_records/i,
    /n8n.*execute/i,
];
function inspectCommand(command) {
    if (CRITICAL_PATTERNS.some((pattern) => pattern.test(command))) {
        return {
            allowed: false,
            risk: 'critical',
            reason: 'Critical command requires explicit owner approval.',
            requiresApproval: true,
        };
    }
    if (HIGH_RISK_PATTERNS.some((pattern) => pattern.test(command))) {
        return {
            allowed: false,
            risk: 'high',
            reason: 'High-risk command requires explicit owner approval.',
            requiresApproval: true,
        };
    }
    return {
        allowed: true,
        risk: 'low',
        reason: 'Command allowed.',
        requiresApproval: false,
    };
}
exports.inspectCommand = inspectCommand;
//# sourceMappingURL=risk-policy.js.map