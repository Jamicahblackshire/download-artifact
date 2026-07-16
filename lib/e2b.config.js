"use strict";
/**
 * E2B Configuration for AI Agent Execution
 * Enables Claude, ChatGPT, and Codex to operate autonomously
 * with full terminal and service access
 */
Object.defineProperty(exports, "__esModule", { value: true });
const e2b_1 = require("e2b");
exports.defaultAgentConfig = {
    name: 'autonomous-agent',
    model: 'claude-3-opus',
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    permissions: {
        terminal: true,
        filesystem: true,
        network: true,
        services: ['railway', 'cloudflare', 'n8n', 'espocrm', 'website'],
    },
    environment: {
        NODE_ENV: 'production',
        PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    },
    timeout: 3600000,
};
exports.initializeE2B = async () => {
    return await e2b_1.Sandbox.create({
        template: 'ubuntu-22.04',
        timeoutMs: exports.defaultAgentConfig.timeout,
        onStdout: (data) => console.log('[STDOUT]', data),
        onStderr: (data) => console.error('[STDERR]', data),
    });
};
//# sourceMappingURL=e2b.config.js.map