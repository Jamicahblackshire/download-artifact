#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const QUEUE = "docs/ffs/tasks/AUTOWORK_QUEUE.md";
const LOG = "docs/ffs/memory/AUTOWORK_LOG.md";

const high = [/git\s+push/i, /railway/i, /cloudflare/i, /n8n/i, /payment/i, /\bDELETE\b/i];
const critical = [/rm\s+-rf\s+\//i, /drop\s+database/i, /destroy/i, /mkfs/i, /dd\s+if=/i];

function risk(cmd) {
  if (critical.some(p => p.test(cmd))) return "critical";
  if (high.some(p => p.test(cmd))) return "high";
  if (/npm|git|node|python|curl|wget/i.test(cmd)) return "medium";
  return "low";
}

function log(msg) {
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  fs.appendFileSync(LOG, `\n## ${new Date().toISOString()}\n${msg}\n`);
}

function loadCommands() {
  if (!fs.existsSync(QUEUE)) return [];
  return fs.readFileSync(QUEUE, "utf8")
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.startsWith("COMMAND:"))
    .map(l => l.slice(8).trim());
}

console.log("Max Core Autoworker online.");
console.log("Mode: SAFE AUTONOMY");
console.log("Watching task queue once, then exiting.");

const commands = loadCommands();

if (!commands.length) {
  console.log("No commands found in queue.");
  process.exit(0);
}

for (const cmd of commands) {
  const r = risk(cmd);
  console.log(`\n[COMMAND] ${cmd}`);
  console.log(`[RISK] ${r.toUpperCase()}`);

  if (r === "high" || r === "critical") {
    console.log("Blocked by SAFE AUTONOMY.");
    log(`- Command: ${cmd}\n- Risk: ${r}\n- Status: BLOCKED`);
    continue;
  }

  try {
    const out = execSync(cmd, { encoding: "utf8", shell: "/bin/bash" });
    if (out.trim()) console.log(out.trim());
    log(`- Command: ${cmd}\n- Risk: ${r}\n- Status: COMPLETE`);
  } catch (e) {
    console.error(e.message);
    log(`- Command: ${cmd}\n- Risk: ${r}\n- Status: ERROR`);
  }
}

console.log("\nAutowork complete.");
