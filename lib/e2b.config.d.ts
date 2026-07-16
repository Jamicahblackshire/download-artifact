/**
 * E2B Configuration for AI Agent Execution
 * Enables Claude, ChatGPT, and Codex to operate autonomously
 * with full terminal and service access
 */
import { Sandbox } from 'e2b';
export interface AgentConfig {
    name: string;
    model: 'claude-3-opus' | 'gpt-4' | 'codex';
    apiKey: string;
    permissions: {
        terminal: boolean;
        filesystem: boolean;
        network: boolean;
        services: string[];
    };
    environment: Record<string, string>;
    timeout: number;
}
export interface ServiceCredentials {
    railway?: {
        apiToken: string;
        projectId: string;
    };
    cloudflare?: {
        apiToken: string;
        zoneId: string;
        accountId: string;
    };
    n8n?: {
        apiKey: string;
        baseUrl: string;
    };
    espocrm?: {
        apiKey: string;
        baseUrl: string;
    };
    website?: {
        repoToken: string;
        deployHook: string;
    };
}
export declare const defaultAgentConfig: AgentConfig;
export declare const initializeE2B: () => Promise<Sandbox>;
//# sourceMappingURL=e2b.config.d.ts.map