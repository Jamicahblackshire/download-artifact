/**
 * AI Agent Orchestrator
 * Coordinates Claude, ChatGPT, and Codex across multiple services
 */

import { Sandbox } from 'e2b';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import credentialManager from './credential-manager';
import { AgentConfig, ServiceCredentials } from '../e2b.config';

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

class AgentOrchestrator {
  private claudeClient: Anthropic;
  private openaiClient: OpenAI;
  private sandbox: Sandbox | null = null;
  private agentConfig: AgentConfig;
  private serviceCredentials: ServiceCredentials = {};
  private executionHistory: ExecutionResult[] = [];

  constructor(agentConfig: AgentConfig) {
    this.agentConfig = agentConfig;

    // Initialize Claude client
    this.claudeClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Initialize OpenAI client
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.loadServiceCredentials();
  }

  /**
   * Load credentials for all services
   */
  private loadServiceCredentials(): void {
    this.serviceCredentials = {
      railway: {
        apiToken: credentialManager.getCredential('railway', 'apiToken') || '',
        projectId: credentialManager.getCredential('railway', 'projectId') || '',
      },
      cloudflare: {
        apiToken: credentialManager.getCredential('cloudflare', 'apiToken') || '',
        zoneId: credentialManager.getCredential('cloudflare', 'zoneId') || '',
        accountId: credentialManager.getCredential('cloudflare', 'accountId') || '',
      },
      n8n: {
        apiKey: credentialManager.getCredential('n8n', 'apiKey') || '',
        baseUrl: credentialManager.getCredential('n8n', 'baseUrl') || '',
      },
      espocrm: {
        apiKey: credentialManager.getCredential('espocrm', 'apiKey') || '',
        baseUrl: credentialManager.getCredential('espocrm', 'baseUrl') || '',
      },
      website: {
        repoToken: credentialManager.getCredential('website', 'repoToken') || '',
        deployHook: credentialManager.getCredential('website', 'deployHook') || '',
      },
    };
  }

  /**
   * Initialize E2B sandbox environment
   */
  async initializeSandbox(): Promise<void> {
    try {
      this.sandbox = await Sandbox.create({
        template: 'ubuntu-22.04',
        timeoutMs: this.agentConfig.timeout,
        onStdout: (data) => console.log('[SANDBOX STDOUT]', data),
        onStderr: (data) => console.error('[SANDBOX STDERR]', data),
      });

      // Install required tools
      await this.sandbox.commands.run('apt-get update && apt-get install -y curl jq git');

      console.log('✓ Sandbox initialized successfully');
    } catch (error) {
      console.error('Failed to initialize sandbox:', error);
      throw error;
    }
  }

  /**
   * Execute a task using Claude (Anthropic)
   */
  async executeWithClaude(task: Task): Promise<ExecutionResult> {
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

      const result: ExecutionResult = {
        taskId: task.id,
        success: true,
        output,
        executedAt: new Date(),
      };

      this.executionHistory.push(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const result: ExecutionResult = {
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
  async executeWithGPT(task: Task): Promise<ExecutionResult> {
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

      const result: ExecutionResult = {
        taskId: task.id,
        success: true,
        output,
        executedAt: new Date(),
      };

      this.executionHistory.push(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const result: ExecutionResult = {
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
  private async executeCommandsInSandbox(commands: string[]): Promise<void> {
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
  private buildSystemPrompt(task: Task): string {
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
  private buildTaskMessage(task: Task): string {
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
  getExecutionHistory(): ExecutionResult[] {
    return this.executionHistory;
  }

  /**
   * Cleanup sandbox
   */
  async cleanup(): Promise<void> {
    if (this.sandbox) {
      await this.sandbox.kill();
      console.log('✓ Sandbox cleaned up');
    }
  }
}

export default AgentOrchestrator;