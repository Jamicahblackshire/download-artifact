/**
 * AI Agent Orchestrator
 * Coordinates Claude, ChatGPT, and Codex across multiple services
 */
import { AgentConfig } from '../e2b.config';
export interface Task {
    id: string;
    description: string;
    service: 'railway' | 'cloudflare' | 'n8n' | 'espocrm' | 'website';
    actions: string[];
    priority: 'low' | 'medium' | 'high';
}
export interface ExecutionResult {
    taskId: string;
    success: boolean;
    output: string;
    error?: string;
    executedAt: Date;
}
declare class AgentOrchestrator {
    private claudeClient;
    private openaiClient;
    private sandbox;
    private agentConfig;
    private serviceCredentials;
    private executionHistory;
    constructor(agentConfig: AgentConfig);
    /**
     * Load credentials for all services
     */
    private loadServiceCredentials;
    /**
     * Initialize E2B sandbox environment
     */
    initializeSandbox(): Promise<void>;
    /**
     * Execute a task using Claude (Anthropic)
     */
    executeWithClaude(task: Task): Promise<ExecutionResult>;
    /**
     * Execute a task using ChatGPT (OpenAI)
     */
    executeWithGPT(task: Task): Promise<ExecutionResult>;
    /**
     * Execute commands in the E2B sandbox
     */
    private executeCommandsInSandbox;
    /**
     * Build system prompt for task execution
     */
    private buildSystemPrompt;
    /**
     * Build task message
     */
    private buildTaskMessage;
    /**
     * Get execution history
     */
    getExecutionHistory(): ExecutionResult[];
    /**
     * Cleanup sandbox
     */
    cleanup(): Promise<void>;
}
export default AgentOrchestrator;
//# sourceMappingURL=agent-orchestrator.d.ts.map