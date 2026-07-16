#!/usr/bin/env node

/**
 * MAX CORE — FFS INTELLIGENCE LAYER v4.0
 * Business context, risk engine, and boot display
 */

const fs = require("fs");
const path = require("path");

const FFS_CONTEXT = {
  owner: "JT (Jamicah Blackshire)",
  business: "Fully Functional Solutions",
  website: "fullyfsolutions.com",
  mission: "Diagnostic-first service for underserved communities",
  commandChain: [
    "JT — Final Authority (owner, escalate only critical decisions)",
    "Claude — Technical Backup (escalate when Max cannot resolve with logic + research)",
    "Max Core — Operations Commander (handles everything else autonomously)",
  ],
  divisions: {
    tech: { name: "JT Mobile & PC Fix", webhook: "/webhook/pipeline/tech" },
    auto: { name: "Precision Auto Diagnostics", webhook: "/webhook/pipeline/auto" },
    clarity: { name: "Clarity Sessions", webhook: "/webhook/pipeline/clarity" },
    journey: { name: "The Journey", webhook: "/webhook/pipeline/journey" },
    transport: { name: "Shophia's Transportation", webhook: "/webhook/pipeline/transport" },
  },
  crew: {
    booking: "Handles lead intake, qualification, and scheduling",
    payment: "Handles invoicing, billing, and payment processing",
    alex: "Chatbot — sales funnel guide and lead nurturer on fullyfsolutions.com",
  },
  stack: {
    n8n: "https://n8n.fullyfsolutions.com",
    crm: "https://crm.fullyfsolutions.com",
    site: "https://fullyfsolutions.com",
    github: "github.com/Jamicahblackshire/ffs-infrastructure",
    railway_project: "b76e24c7-eee0-4af5-bbbe-6d0d98d657c3",
    tunnel_id: "beaf37e6-1e46-474d-9043-5c7419ff6edf",
    cloudflared_config: "/etc/cloudflared/config.yml",
  },
};

const RISK_PATTERNS = {
  critical: [
    /rm\s+-rf\s+\//i, /mkfs/i, /dd\s+if=/i, /shutdown/i, /reboot/i,
    /curl\s+.*\|\s*(sh|bash)/i, /wget\s+.*\|\s*(sh|bash)/i,
    /drop\s+database/i, /destroy/i, /delete\s+repository/i,
  ],
  high: [
    /git\s+push\s+.*--force/i, /cloudflare.*delete/i, /dns.*delete/i,
    /railway.*delete/i, /stripe/i, /square/i, /\bDELETE\s+FROM\b/i,
    /DROP\s+TABLE/i,
  ],
  medium: [
    /git\s+push/i, /railway/i, /cloudflare/i, /psql/i,
    /systemctl/i, /docker/i, /npm\s+install/i, /curl/i, /wget/i,
  ],
};

function assessRisk(cmd) {
  if (RISK_PATTERNS.critical.some(p => p.test(cmd))) return "critical";
  if (RISK_PATTERNS.high.some(p => p.test(cmd))) return "high";
  if (RISK_PATTERNS.medium.some(p => p.test(cmd))) return "medium";
  return "low";
}

function assessIntent(cmd) {
  if (/n8n|fullyfsolutions\.com\/webhook/i.test(cmd)) return "n8n automation pipeline";
  if (/crm\.fullyfsolutions/i.test(cmd)) return "EspoCRM — customer data";
  if (/cloudflared|cloudflare/i.test(cmd)) return "Cloudflare tunnel/DNS";
  if (/railway/i.test(cmd)) return "Railway — cloud hosting";
  if (/psql|postgres/i.test(cmd)) return "Postgres database";
  if (/git/i.test(cmd)) return "GitHub — version control";
  if (/docker/i.test(cmd)) return "Docker — local containers";
  return "local system";
}

function logEntry(msg, file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, `# Max Core Log\n\n`);
  fs.appendFileSync(file, `\n## ${new Date().toISOString()}\n${msg}\n`);
}

function displayBoot() {
  const time = new Date().toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  });
  console.log("\n" + "═".repeat(62));
  console.log("  MAX CORE v4.0 — FFS OPERATIONS COMMANDER");
  console.log("═".repeat(62));
  console.log(`  Business : Fully Functional Solutions`);
  console.log(`  Owner    : JT — Final Authority`);
  console.log(`  Backup   : Claude — Technical Execution`);
  console.log(`  Online   : ${time}`);
  console.log("═".repeat(62));
  console.log("  STANDING AT ATTENTION. READY FOR ORDERS, JT.");
  console.log("─".repeat(62));
  console.log("  Talk to me in plain English. I've got you.");
  console.log("  Type 'help' to see what I can do.");
  console.log("─".repeat(62) + "\n");
}

module.exports = { FFS_CONTEXT, assessRisk, assessIntent, logEntry, displayBoot };
