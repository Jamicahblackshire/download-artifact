#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const taskFile = process.argv[2] || "docs/ffs/tasks/local-status-check.task.md";
const taskPath = path.resolve(process.cwd(), taskFile);
const logFile = path.resolve(process.cwd(), "docs/ffs/memory/TASK_LOG.md");

const criticalPatterns = [
  /rm\s+-rf\s+\//i,
  /mkfs/i,
  /dd\s+if=/i,
  /shutdown/i,
  /reboot/i,
  /curl\s+.*\|\s*(sh|bash)/i,
  /wget\s+.*\|\s*(sh|bash)/i,
  /drop\s+database/i,
  /destroy/i,
];

const highPatterns = [
  /git\s+push/i,
  /railway/i,
  /cloudflare/i,
  /n8n.*execute/i,
  /stripe/i,
  /square/i,
  /payment/i,
  /\bDELETE\b/i,
];

const mediumPatterns = [
  /npm/i,
  /git/i,
  /curl/i,
  /wget/i,
  /node/i,
  /python/i,
];

function inspect(command) {
  if (criticalPatterns.some((p) => p.test(command))) return "critical";
  if (highPatterns.some((p) => p.test(command))) return "high";
  if (mediumPatterns.some((p) => p.test(command))) return "medium";
  return "low";
}

function log(entry) {
  fs.mkdirSync(path.dirname(logFile), { recursive: true });

  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "# Max Core Task Log\n\n");
  }

  fs.appendFileSync(logFile, entry + "\n\n");
}

if (!fs.existsSync(taskPath)) {
  console.error(`Task file not found: ${taskFile}`);
  process.exit(1);
}

const raw = fs.readFileSync(taskPath, "utf8");
const lines = raw.split(/\r?\n/);

let mode = "SAFE";
const commands = [];

for (const line of lines) {
  const trimmed = line.trim();

  if (trimmed.toUpperCase().startsWith("MODE:")) {
    mode = trimmed.slice(5).trim().toUpperCase();
  }

  if (trimmed.startsWith("COMMAND:")) {
    commands.push(trimmed.slice(8).trim());
  }
}

console.log("Max Core Task Runner");
console.log(`Task File: ${taskFile}`);
console.log(`Mode: ${mode}`);
console.log(`Commands: ${commands.length}`);
console.log("");

for (const command of commands) {
  const risk = inspect(command);

  console.log(`[COMMAND] ${command}`);
  console.log(`[RISK] ${risk.toUpperCase()}`);

  if (mode === "LOCKDOWN") {
    console.log("Blocked by LOCKDOWN MODE.");
    log(`## ${new Date().toISOString()}\n- Command: ${command}\n- Risk: ${risk}\n- Status: blocked-lockdown`);
    continue;
  }

  if (mode === "SAFE" && (risk === "high" || risk === "critical")) {
    console.log("Blocked by SAFE MODE.");
    log(`## ${new Date().toISOString()}\n- Command: ${command}\n- Risk: ${risk}\n- Status: blocked-safe-mode`);
    continue;
  }

  if (risk === "high" || risk === "critical") {
    console.log("Blocked. Approval workflow will be added in next version.");
    log(`## ${new Date().toISOString()}\n- Command: ${command}\n- Risk: ${risk}\n- Status: blocked-approval-required`);
    continue;
  }

  try {
    const output = execSync(command, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    if (output.trim()) console.log(output.trim());

    log(`## ${new Date().toISOString()}\n- Command: ${command}\n- Risk: ${risk}\n- Status: completed`);
  } catch (error) {
    console.error(error.message);
    log(`## ${new Date().toISOString()}\n- Command: ${command}\n- Risk: ${risk}\n- Status: error`);
  }

  console.log("");
}

console.log("Task complete.");
