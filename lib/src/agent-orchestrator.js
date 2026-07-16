"use strict";
/**
 * AI Agent Orchestrator
 * Coordinates Claude, ChatGPT, and Codex across multiple services
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const e2b_1 = require("e2b");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const openai_1 = __importDefault(require("openai"));
const credential_manager_1 = __importDefault(require("./credential-manager"));
class AgentOrchestrator {
    constructor(agentConfig) {
        this.sandbox = null;
        this.serviceCredentials = {};
        this.executionHistory = [];
        this.agentConfig = agentConfig;
        // Initialize Claude client
        this.claudeClient = new sdk_1.default({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        // Initialize OpenAI client
        this.openaiClient = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.loadServiceCredentials();
    }
    /**
     * Load credentials for all services
     */
    loadServiceCredentials() {
        this.serviceCredentials = {
            railway: {
                apiToken: credential_manager_1.default.getCredential('railway', 'apiToken') || '',
                projectId: credential_manager_1.default.getCredential('railway', 'projectId') || '',
            },
            cloudflare: {
                apiToken: credential_manager_1.default.getCredential('cloudflare', 'apiToken') || '',
                zoneId: credential_manager_1.default.getCredential('cloudflare', 'zoneId') || '',
                accountId: credential_manager_1.default.getCredential('cloudflare', 'accountId') || '',
            },
            n8n: {
                apiKey: credential_manager_1.default.getCredential('n8n', 'apiKey') || '',
                baseUrl: credential_manager_1.default.getCredential('n8n', 'baseUrl') || '',
            },
            espocrm: {
                apiKey: credential_manager_1.default.getCredential('espocrm', 'apiKey') || '',
                baseUrl: credential_manager_1.default.getCredential('espocrm', 'baseUrl') || '',
            },
            website: {
                repoToken: credential_manager_1.default.getCredential('website', 'repoToken') || '',
                deployHook: credential_manager_1.default.getCredential('website', 'deployHook') || '',
            },
        };
    }
    /**
     * Initialize E2B sandbox environment
     */
    async initializeSandbox() {
        try {
            this.sandbox = await e2b_1.Sandbox.create({
                template: 'ubuntu-22.04',
                timeoutMs: this.agentConfig.timeout,
                onStdout: (data) => console.log('[SANDBOX STDOUT]', data),
                onStderr: (data) => console.error('[SANDBOX STDERR]', data),
            });
            // Install required tools
            await this.sandbox.commands.run('apt-get update && apt-get install -y curl jq git');
            console.log('✓ Sandbox initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize sandbox:', error);
            throw error;
        }
    }
    /**
     * Execute a task using Claude (Anthropic)
     */
    async executeWithClaude(task) {
        try {
            const systemPrompt = this.buildSystemPrompt(task);
            const userMessage = this.buildTaskMessage(task);
            const response = await this.claudeClient.messages.create({
                model: 'claude-3-opus-20240229',
                max_tokens: 4096,
                system: systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
            });
            const output = response.content
                .filter((block) => block.type === 'text')
                .map((block) => (block.type === 'text' ? block.text : ''))
                .join('');
            // Execute the generated commands in sandbox
            if (this.sandbox && task.actions.length > 0) {
                await this.executeCommandsInSandbox(task.actions);
            }
            const result = {
                taskId: task.id,
                success: true,
                output,
                executedAt: new Date(),
            };
            this.executionHistory.push(result);
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const result = {
                taskId: task.id,
                success: false,
                output: '',
                error: errorMessage,
                executedAt: new Date(),
            };
            this.executionHistory.push(result);
            return result;
        }
    }
    /**
     * Execute a task using ChatGPT (OpenAI)
     */
    async executeWithGPT(task) {
        try {
            const systemPrompt = this.buildSystemPrompt(task);
            const userMessage = this.buildTaskMessage(task);
            const response = await this.openaiClient.chat.completions.create({
                model: 'gpt-4',
                max_tokens: 4096,
                system: systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
            });
            const output = response.choices[0].message.content || '';
            // Execute the generated commands in sandbox
            if (this.sandbox && task.actions.length > 0) {
                await this.executeCommandsInSandbox(task.actions);
            }
            const result = {
                taskId: task.id,
                success: true,
                output,
                executedAt: new Date(),
            };
            this.executionHistory.push(result);
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const result = {
                taskId: task.id,
                success: false,
                output: '',
                error: errorMessage,
                executedAt: new Date(),
            };
            this.executionHistory.push(result);
            return result;
        }
    }
    /**
     * Execute commands in the E2B sandbox
     */
    async executeCommandsInSandbox(commands) {
        if (!this.sandbox) {
            throw new Error('Sandbox not initialized');
        }
        for (const command of commands) {
            console.log(`[EXECUTING] ${command}`);
            const result = await this.sandbox.commands.run(command);
            console.log(`[OUTPUT] ${result.stdout}`);
            if (result.stderr) {
                console.error(`[ERROR] ${result.stderr}`);
            }
        }
    }
    /**
     * Build system prompt for task execution
     */
    buildSystemPrompt(task) {
        return `You are an autonomous AI agent with full access to execute tasks across multiple services.

Your capabilities:
- Terminal command execution
- Filesystem access
- Network operations
- Service API interactions

Available services:
- Railway (deployment)
- Cloudflare (DNS/CDN)
- n8n (workflows)
- EspoCRM (customer management)
- Website (repository/deployment)

You must:
1. Understand the task completely
2. Generate appropriate commands/API calls
3. Execute them safely and verify results
4. Report outcomes clearly

For API calls, use the provided credentials and base URLs.
Always validate commands before execution.
`;
    }
    /**
     * Build task message
     */
    buildTaskMessage(task) {
        const credentials = JSON.stringify(this.serviceCredentials, null, 2);
        return `Task ID: ${task.id}
Service: ${task.service}
Priority: ${task.priority}

Description:
${task.description}

Actions to perform:
${task.actions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

Available credentials are configured for secure access.
Execute these actions and report the results.`;
    }
    /**
     * Get execution history
     */
    getExecutionHistory() {
        return this.executionHistory;
    }
    /**
     * Cleanup sandbox
     */
    async cleanup() {
        if (this.sandbox) {
            await this.sandbox.kill();
            console.log('✓ Sandbox cleaned up');
        }
    }
}
exports.default = AgentOrchestrator;
//# sourceMappingURL=agent-orchestrator.js.map