/**
 * Setup Script: Add Credentials Interactively
 * Run: npm run setup-credentials
 */

import * as readline from 'readline';
import credentialManager from './credential-manager';
import * as path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

const setupCredentials = async (): Promise<void> => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   AI Agent Orchestration - Credential Setup            ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Railway
  console.log('\n📍 RAILWAY CONFIGURATION');
  const railwayToken = await question('Enter Railway API Token: ');
  const railwayProjectId = await question('Enter Railway Project ID: ');
  if (railwayToken) credentialManager.setCredential('railway', 'apiToken', railwayToken);
  if (railwayProjectId) credentialManager.setCredential('railway', 'projectId', railwayProjectId);

  // Cloudflare
  console.log('\n📍 CLOUDFLARE CONFIGURATION');
  const cfToken = await question('Enter Cloudflare API Token: ');
  const cfZoneId = await question('Enter Cloudflare Zone ID: ');
  const cfAccountId = await question('Enter Cloudflare Account ID: ');
  if (cfToken) credentialManager.setCredential('cloudflare', 'apiToken', cfToken);
  if (cfZoneId) credentialManager.setCredential('cloudflare', 'zoneId', cfZoneId);
  if (cfAccountId) credentialManager.setCredential('cloudflare', 'accountId', cfAccountId);

  // n8n
  console.log('\n📍 N8N CONFIGURATION');
  const n8nApiKey = await question('Enter n8n API Key: ');
  const n8nBaseUrl = await question('Enter n8n Base URL (e.g., https://n8n.example.com): ');
  if (n8nApiKey) credentialManager.setCredential('n8n', 'apiKey', n8nApiKey);
  if (n8nBaseUrl) credentialManager.setCredential('n8n', 'baseUrl', n8nBaseUrl);

  // EspoCRM
  console.log('\n📍 ESPOCRM CONFIGURATION');
  const espoApiKey = await question('Enter EspoCRM API Key: ');
  const espoBaseUrl = await question('Enter EspoCRM Base URL (e.g., https://crm.example.com): ');
  if (espoApiKey) credentialManager.setCredential('espocrm', 'apiKey', espoApiKey);
  if (espoBaseUrl) credentialManager.setCredential('espocrm', 'baseUrl', espoBaseUrl);

  // Website
  console.log('\n📍 WEBSITE CONFIGURATION');
  const websiteRepoToken = await question('Enter GitHub/Git Repository Token: ');
  const websiteDeployHook = await question('Enter Website Deploy Webhook URL: ');
  if (websiteRepoToken) credentialManager.setCredential('website', 'repoToken', websiteRepoToken);
  if (websiteDeployHook) credentialManager.setCredential('website', 'deployHook', websiteDeployHook);

  console.log('\n✅ All credentials have been securely stored!');
  console.log(`📁 Credentials file: ${path.join(process.cwd(), '.credentials.encrypted')}`);
  console.log('⚠️  Keep this file secure and do not commit it to version control.\n');

  rl.close();
};

setupCredentials().catch(console.error);