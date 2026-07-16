"use strict";
/**
 * Task Executor
 * Example: Execute autonomous tasks across services
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agent_orchestrator_1 = __importDefault(require("./agent-orchestrator"));
const e2b_config_1 = require("../e2b.config");
// Example tasks
const EXAMPLE_TASKS = [
    {
        id: 'task-001',
        description: 'Deploy latest changes to Railway and verify deployment',
        service: 'railway',
        actions: [
            'git clone $RAILWAY_REPO /tmp/repo',
            'cd /tmp/repo && npm install',
            'npm run build',
            'railway link --project $RAILWAY_PROJECT_ID',
            'railway deploy',
        ],
        priority: 'high',
    },
    {
        id: 'task-002',
        description: 'Update DNS records on Cloudflare',
        service: 'cloudflare',
        actions: [
            'curl -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" -H "Authorization: Bearer $CLOUDFLARE_TOKEN"',
        ],
        priority: 'medium',
    },
    {
        id: 'task-003',
        description: 'Trigger n8n workflow for data sync',
        service: 'n8n',
        actions: [
            'curl -X POST "$N8N_BASE_URL/api/v1/workflows/1/execute" -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" -d {}',
        ],
        priority: 'medium',
    },
    {
        id: 'task-004',
        description: 'Sync CRM data from EspoCRM',
        service: 'espocrm',
        actions: [
            'curl -X GET "$ESPOCRM_BASE_URL/api/v1/Contact" -u "admin:$ESPOCRM_API_KEY" -H "Accept: application/json"',
        ],
        priority: 'low',
    },
    {
        id: 'task-005',
        description: 'Build and deploy website',
        service: 'website',
        actions: [
            'git clone https://github.com/$GITHUB_REPO /tmp/website',
            'cd /tmp/website && npm install',
            'npm run build',
            'curl -X POST $DEPLOY_WEBHOOK',
        ],
        priority: 'high',
    },
];
const executeTasks = async () => {
    console.log('🚀 Starting AI Agent Task Executor\n');
    const orchestrator = new agent_orchestrator_1.default(e2b_config_1.defaultAgentConfig);
    try {
        // Initialize sandbox
        await orchestrator.initializeSandbox();
        // Execute tasks with different AI models
        console.log('\n📋 Executing tasks...\n');
        // High priority task with Claude
        const highPriorityTask = EXAMPLE_TASKS.find((t) => t.priority === 'high');
        if (highPriorityTask) {
            console.log(`\n🤖 [Claude] Executing: ${highPriorityTask.description}`);
            const result = await orchestrator.executeWithClaude(highPriorityTask);
            console.log(`Result: ${result.success ? '✅ Success' : '❌ Failed'}`);
            if (result.error)
                console.error(`Error: ${result.error}`);
        }
        // Medium priority task with GPT
        const mediumPriorityTask = EXAMPLE_TASKS.find((t) => t.priority === 'medium' && t.service === 'cloudflare');
        if (mediumPriorityTask) {
            console.log(`\n🤖 [GPT-4] Executing: ${mediumPriorityTask.description}`);
            const result = await orchestrator.executeWithGPT(mediumPriorityTask);
            console.log(`Result: ${result.success ? '✅ Success' : '❌ Failed'}`);
            if (result.error)
                console.error(`Error: ${result.error}`);
        }
        // Print execution history
        console.log('\n📊 Execution History:');
        const history = orchestrator.getExecutionHistory();
        history.forEach((result) => {
            console.log(`\n  Task ${result.taskId}:`);
            console.log(`    Status: ${result.success ? '✅' : '❌'}`);
            console.log(`    Executed: ${result.executedAt.toISOString()}`);
            if (result.error)
                console.log(`    Error: ${result.error}`);
        });
    }
    catch (error) {
        console.error('Task execution failed:', error);
    }
    finally {
        await orchestrator.cleanup();
    }
};
executeTasks().catch(console.error);
//# sourceMappingURL=task-executor.js.map