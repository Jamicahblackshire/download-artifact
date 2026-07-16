"use strict";
/**
 * Setup Script: Add Credentials Interactively
 * Run: npm run setup-credentials
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const credential_manager_1 = __importDefault(require("./credential-manager"));
const path = __importStar(require("path"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const question = (query) => {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
};
const setupCredentials = async () => {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   AI Agent Orchestration - Credential Setup            ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    // Railway
    console.log('\n📍 RAILWAY CONFIGURATION');
    const railwayToken = await question('Enter Railway API Token: ');
    const railwayProjectId = await question('Enter Railway Project ID: ');
    if (railwayToken)
        credential_manager_1.default.setCredential('railway', 'apiToken', railwayToken);
    if (railwayProjectId)
        credential_manager_1.default.setCredential('railway', 'projectId', railwayProjectId);
    // Cloudflare
    console.log('\n📍 CLOUDFLARE CONFIGURATION');
    const cfToken = await question('Enter Cloudflare API Token: ');
    const cfZoneId = await question('Enter Cloudflare Zone ID: ');
    const cfAccountId = await question('Enter Cloudflare Account ID: ');
    if (cfToken)
        credential_manager_1.default.setCredential('cloudflare', 'apiToken', cfToken);
    if (cfZoneId)
        credential_manager_1.default.setCredential('cloudflare', 'zoneId', cfZoneId);
    if (cfAccountId)
        credential_manager_1.default.setCredential('cloudflare', 'accountId', cfAccountId);
    // n8n
    console.log('\n📍 N8N CONFIGURATION');
    const n8nApiKey = await question('Enter n8n API Key: ');
    const n8nBaseUrl = await question('Enter n8n Base URL (e.g., https://n8n.example.com): ');
    if (n8nApiKey)
        credential_manager_1.default.setCredential('n8n', 'apiKey', n8nApiKey);
    if (n8nBaseUrl)
        credential_manager_1.default.setCredential('n8n', 'baseUrl', n8nBaseUrl);
    // EspoCRM
    console.log('\n📍 ESPOCRM CONFIGURATION');
    const espoApiKey = await question('Enter EspoCRM API Key: ');
    const espoBaseUrl = await question('Enter EspoCRM Base URL (e.g., https://crm.example.com): ');
    if (espoApiKey)
        credential_manager_1.default.setCredential('espocrm', 'apiKey', espoApiKey);
    if (espoBaseUrl)
        credential_manager_1.default.setCredential('espocrm', 'baseUrl', espoBaseUrl);
    // Website
    console.log('\n📍 WEBSITE CONFIGURATION');
    const websiteRepoToken = await question('Enter GitHub/Git Repository Token: ');
    const websiteDeployHook = await question('Enter Website Deploy Webhook URL: ');
    if (websiteRepoToken)
        credential_manager_1.default.setCredential('website', 'repoToken', websiteRepoToken);
    if (websiteDeployHook)
        credential_manager_1.default.setCredential('website', 'deployHook', websiteDeployHook);
    console.log('\n✅ All credentials have been securely stored!');
    console.log(`📁 Credentials file: ${path.join(process.cwd(), '.credentials.encrypted')}`);
    console.log('⚠️  Keep this file secure and do not commit it to version control.\n');
    rl.close();
};
setupCredentials().catch(console.error);
//# sourceMappingURL=setup-credentials.js.map