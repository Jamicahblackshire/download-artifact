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
  timeout: number; // ms
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

export const defaultAgentConfig: AgentConfig = {
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
  timeout: 3600000, // 1 hour
};

export const initializeE2B = async (): Promise<Sandbox> => {
  return await Sandbox.create({
    template: 'ubuntu-22.04',
    timeoutMs: defaultAgentConfig.timeout,
    onStdout: (data) => console.log('[STDOUT]', data),
    onStderr: (data) => console.error('[STDERR]', data),
  });
};