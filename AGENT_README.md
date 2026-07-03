# AI Agent Orchestration Framework

Autonomous AI agent orchestration system that enables Claude, ChatGPT, and Codex to operate with full access to your terminal, applications, and services.

## Features

✅ **Multi-Model Support**: Claude (Anthropic) + ChatGPT (OpenAI) + Codex  
✅ **Secure Credential Management**: Encrypted storage for all API keys  
✅ **E2B Sandbox Integration**: Isolated, secure execution environments  
✅ **Multi-Service Automation**: Railway, Cloudflare, n8n, EspoCRM, Website  
✅ **Task Orchestration**: Autonomous task execution with full permissions  
✅ **Execution History**: Track all agent actions and outputs  

## Supported Services

- **Railway** - Application deployment and management
- **Cloudflare** - DNS, CDN, and security management
- **n8n** - Workflow automation and orchestration
- **EspoCRM** - Customer relationship management
- **Website** - Repository and deployment management

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Credentials

```bash
npm run setup-credentials
```

This interactive script will securely store your API keys:
- Railway API Token & Project ID
- Cloudflare API Token, Zone ID, Account ID
- n8n API Key & Base URL
- EspoCRM API Key & Base URL
- Website Repository Token & Deploy Hook

Credentials are encrypted and stored in `.credentials.encrypted`.

### 3. Configure Environment

Copy `.env.example` to `.env` and set your API keys:

```bash
cp .env.example .env
```

```bash
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
ENCRYPTION_KEY=your_encryption_key
```

### 4. Build

```bash
npm run build
```

### 5. Execute Tasks

```bash
npm run execute-tasks
```

## Architecture

### 1. **Credential Manager** (`src/credential-manager.ts`)

Securely manages all API keys:
- AES-256-CBC encryption
- Per-service credential isolation
- Encrypted file storage
- Environment variable export

```typescript
import credentialManager from './credential-manager';

// Set a credential
credentialManager.setCredential('railway', 'apiToken', 'token_here');

// Get a credential
const token = credentialManager.getCredential('railway', 'apiToken');

// Export as environment variables
const env = credentialManager.toEnvironmentVariables();
```

### 2. **Agent Orchestrator** (`src/agent-orchestrator.ts`)

Orchestrates Claude and ChatGPT:
- Task assignment to appropriate models
- Sandbox environment management
- Command execution in E2B
- Execution history tracking

```typescript
import AgentOrchestrator from './agent-orchestrator';

const orchestrator = new AgentOrchestrator(defaultAgentConfig);
await orchestrator.initializeSandbox();

const result = await orchestrator.executeWithClaude(task);
const result = await orchestrator.executeWithGPT(task);
```

### 3. **E2B Configuration** (`e2b.config.ts`)

Defines execution environment:
- Agent configuration
- Permission scopes
- Service credentials
- Timeout settings

### 4. **Task Executor** (`src/task-executor.ts`)

Example tasks that demonstrate:
- Railway deployment
- Cloudflare DNS updates
- n8n workflow triggers
- EspoCRM data sync
- Website deployment

## Task Format

```typescript
interface Task {
  id: string;                                    // Unique task identifier
  description: string;                           // Human-readable description
  service: 'railway' | 'cloudflare' | 'n8n' | 'espocrm' | 'website';
  actions: string[];                             // Commands to execute
  priority: 'low' | 'medium' | 'high';          // Execution priority
}
```

## Example Task

```typescript
const task: Task = {
  id: 'deploy-railway-001',
  description: 'Deploy latest changes to Railway and verify',
  service: 'railway',
  actions: [
    'git clone $RAILWAY_REPO /tmp/repo',
    'cd /tmp/repo && npm install',
    'npm run build',
    'railway deploy',
  ],
  priority: 'high',
};

const result = await orchestrator.executeWithClaude(task);
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Never commit** `.env` or `.credentials.encrypted` to version control
2. **Use strong encryption keys** - store `ENCRYPTION_KEY` securely
3. **Rotate API keys** regularly
4. **Limit permissions** - only grant necessary scopes per service
5. **Audit logs** - review execution history regularly
6. **Sandbox isolation** - tasks run in isolated E2B environments

## Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Optional but recommended
E2B_API_KEY=your_e2b_key
ENCRYPTION_KEY=your_encryption_key
LOG_LEVEL=debug
```

## Commands

### Setup new credentials

```bash
npm run setup-credentials
```

### Build TypeScript

```bash
npm run build
```

### Execute tasks

```bash
npm run execute-tasks
```

### Development mode

```bash
npm run dev
```

### Lint code

```bash
npm run lint
```

### Format code

```bash
npm run format
```

## API Reference

### AgentOrchestrator

#### `initializeSandbox(): Promise<void>`
Initialize the E2B sandbox environment.

#### `executeWithClaude(task: Task): Promise<ExecutionResult>`
Execute a task using Claude (Anthropic).

#### `executeWithGPT(task: Task): Promise<ExecutionResult>`
Execute a task using ChatGPT (OpenAI).

#### `getExecutionHistory(): ExecutionResult[]`
Retrieve the execution history.

#### `cleanup(): Promise<void>`
Clean up sandbox and resources.

### CredentialManager

#### `setCredential(service: string, key: string, value: string): void`
Store an encrypted credential.

#### `getCredential(service: string, key: string): string | null`
Retrieve a credential.

#### `getServiceCredentials(service: string): Record<string, string>`
Get all credentials for a service.

#### `toEnvironmentVariables(): Record<string, string>`
Export all credentials as environment variables.

## Troubleshooting

### Credentials not loading
```bash
# Verify encryption key
echo $ENCRYPTION_KEY

# Check credentials file exists
ls -la .credentials.encrypted

# Re-setup credentials
npm run setup-credentials
```

### Sandbox initialization fails
```bash
# Check E2B API key
echo $E2B_API_KEY

# Verify internet connection
curl -I https://api.e2b.dev
```

### API rate limits
Implement request queuing and exponential backoff in task executor.

## Next Steps

1. **Configure your services** - Run `npm run setup-credentials`
2. **Set environment variables** - Create `.env` file
3. **Build the project** - Run `npm run build`
4. **Execute tasks** - Run `npm run execute-tasks`
5. **Monitor execution** - Check logs and execution history

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the AGENT_README.md
3. Check logs and execution history
4. Open a GitHub issue

## License

MIT
