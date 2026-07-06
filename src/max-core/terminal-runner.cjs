#!/usr/bin/env node

const readline = require("readline");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

let currentDir = process.cwd();
let currentMode = "SAFE";

const LOG_FILE = path.join(process.cwd(), "docs/ffs/memory/COMMAND_LOG.md");
const MODE_LOG_FILE = path.join(process.cwd(), "docs/ffs/memory/MODE_LOG.md");

const VALID_MODES = ["SAFE", "ARMED", "LOCKDOWN"];

const CRITICAL_PATTERNS = [
  /rm\s+-rf\s+\//i,
  /mkfs/i,
  /dd\s+if=/i,
  /shutdown/i,
  /reboot/i,
  /curl\s+.*\|\s*(sh|bash)/i,
  /wget\s+.*\|\s*(sh|bash)/i,
  /chmod\s+-R\s+777\s+\//i,
  /delete\s+repository/i,
  /drop\s+database/i,
  /destroy/i,
];

const HIGH_RISK_PATTERNS = [
  /git\s+push/i,
  /npm\s+publish/i,
  /railway\s+deploy/i,
  /railway/i,
  /cloudflare/i,
  /dns_records/i,
  /n8n.*execute/i,
  /stripe/i,
  /square/i,
  /payment/i,
  /\bDELETE\b/i,
];

const MEDIUM_RISK_PATTERNS = [
  /npm\s+install/i,
  /npm\s+run\s+build/i,
  /git\s+checkout/i,
  /git\s+commit/i,
  /curl/i,
  /wget/i,
  /node/i,
  /python/i,
];

function inspectCommand(command) {
  if (CRITICAL_PATTERNS.some((pattern) => pattern.test(command))) {
    return {
      allowed: false,
      risk: "critical",
      reason: "Critical command requires explicit owner approval every time.",
      requiresApproval: true,
      phrase: "APPROVED: EXECUTE CRITICAL",
    };
  }

  if (HIGH_RISK_PATTERNS.some((pattern) => pattern.test(command))) {
    return {
      allowed: false,
      risk: "high",
      reason: "High-risk command requires owner approval before execution.",
      requiresApproval: true,
      phrase: "APPROVED: EXECUTE HIGH RISK",
    };
  }

  if (MEDIUM_RISK_PATTERNS.some((pattern) => pattern.test(command))) {
    return {
      allowed: true,
      risk: "medium",
      reason: "Medium-risk command allowed with logging.",
      requiresApproval: false,
    };
  }

  return {
    allowed: true,
    risk: "low",
    reason: "Low-risk command allowed.",
    requiresApproval: false,
  };
}

function ensureFile(file, title) {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `# ${title}\n\n`);
  }
}

function logAction(command, decision, status) {
  ensureFile(LOG_FILE, "Max Core Command Log");

  const entry = [
    `## ${new Date().toISOString()}`,
    "",
    `- Mode: ${currentMode}`,
    `- Command: \`${command.replace(/`/g, "\\`")}\``,
    `- Risk: ${decision.risk}`,
    `- Status: ${status}`,
    `- Reason: ${decision.reason}`,
    "",
  ].join("\n");

  fs.appendFileSync(LOG_FILE, entry);
}

function logModeChange(previousMode, newMode, reason) {
  ensureFile(MODE_LOG_FILE, "Max Core Mode Log");

  const entry = [
    `## ${new Date().toISOString()}`,
    "",
    `- Previous Mode: ${previousMode}`,
    `- New Mode: ${newMode}`,
    `- Reason: ${reason}`,
    "",
  ].join("\n");

  fs.appendFileSync(MODE_LOG_FILE, entry);
}


function expandPath(target) {
  if (!target || target === "~") {
    return os.homedir();
  }

  if (target.startsWith("~/")) {
    return path.join(os.homedir(), target.slice(2));
  }

  return target;
}

function showHelp() {
  console.log(`
Max Core Terminal Runner

Current mode: ${currentMode}

Commands:
  help                         Show this help menu
  exit                         Close Max Core
  pwd                          Show current working directory
  cd <path>                    Change working directory
  risk <command>               Inspect command risk without running it
  mode                         Show current operation mode
  set-mode SAFE                Switch to SAFE MODE
  set-mode ARMED               Switch to ARMED MODE
  set-mode LOCKDOWN            Switch to LOCKDOWN MODE
  log                          Show command log path
  mode-log                     Show mode log path

Mode rules:
  SAFE MODE     Low/Medium commands allowed. High/Critical blocked.
  ARMED MODE    Low/Medium allowed. High/Critical require approval phrase.
  LOCKDOWN MODE No external command execution.

Approval phrases:
  APPROVED: EXECUTE HIGH RISK
  APPROVED: EXECUTE CRITICAL
`);
}

function setMode(mode) {
  const nextMode = mode.toUpperCase();

  if (!VALID_MODES.includes(nextMode)) {
    console.log(`Invalid mode: ${mode}`);
    console.log("Valid modes: SAFE, ARMED, LOCKDOWN");
    return;
  }

  if (nextMode === currentMode) {
    console.log(`Already in ${currentMode} MODE.`);
    return;
  }

  const previousMode = currentMode;
  currentMode = nextMode;

  console.log(`Mode changed: ${previousMode} -> ${currentMode}`);
  logModeChange(previousMode, currentMode, "Owner command through terminal runner");
}

function runCommand(command) {
  const decision = inspectCommand(command);

  console.log(`[MODE] ${currentMode}`);
  console.log(`[RISK] ${decision.risk.toUpperCase()}`);
  console.log(`[REASON] ${decision.reason}`);

  if (currentMode === "LOCKDOWN") {
    console.log("Blocked. LOCKDOWN MODE does not allow external command execution.");
    logAction(command, decision, "blocked-lockdown");
    return prompt();
  }

  if (currentMode === "SAFE" && (decision.risk === "high" || decision.risk === "critical")) {
    console.log("Blocked. SAFE MODE does not allow High or Critical risk execution.");
    console.log("Switch to ARMED MODE first if this action is truly needed.");
    logAction(command, decision, "blocked-safe-mode");
    return prompt();
  }

  if (decision.requiresApproval) {
    rl.question(`Approval required. Type "${decision.phrase}" to continue: `, (answer) => {
      if (answer !== decision.phrase) {
        console.log("Blocked. Approval phrase did not match.");
        logAction(command, decision, "blocked-approval-failed");
        return prompt();
      }

      execute(command, decision);
    });
    return;
  }

  execute(command, decision);
}

function execute(command, decision) {
  console.log(`[EXECUTING] ${command}`);

  exec(command, { cwd: currentDir, shell: "/bin/bash" }, (error, stdout, stderr) => {
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());

    if (error) {
      console.error(`[ERROR] ${error.message}`);
      logAction(command, decision, "error");
    } else {
      logAction(command, decision, "completed");
    }

    prompt();
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question(`Max:${currentMode}> `, (input) => {
    const command = input.trim();

    if (!command) return prompt();

    if (command === "exit") {
      console.log("Max Core Terminal Runner offline.");
      rl.close();
      return;
    }

    if (command === "help") {
      showHelp();
      return prompt();
    }

    if (command === "pwd") {
      console.log(currentDir);
      return prompt();
    }

    if (command === "mode") {
      console.log(currentMode);
      return prompt();
    }

    if (command === "log") {
      ensureFile(LOG_FILE, "Max Core Command Log");
      console.log(LOG_FILE);
      return prompt();
    }

    if (command === "mode-log") {
      ensureFile(MODE_LOG_FILE, "Max Core Mode Log");
      console.log(MODE_LOG_FILE);
      return prompt();
    }

    if (command.startsWith("set-mode ")) {
      setMode(command.slice(9).trim());
      return prompt();
    }

    if (command.startsWith("cd ")) {
      const target = expandPath(command.slice(3).trim());
      const nextDir = path.isAbsolute(target) ? target : path.resolve(currentDir, target);

      if (!fs.existsSync(nextDir) || !fs.statSync(nextDir).isDirectory()) {
        console.log(`Directory not found: ${nextDir}`);
        return prompt();
      }

      currentDir = nextDir;
      console.log(currentDir);
      return prompt();
    }

    if (command.startsWith("risk ")) {
      const targetCommand = command.slice(5).trim();
      console.log(inspectCommand(targetCommand));
      return prompt();
    }

    runCommand(command);
  });
}

console.log("Max Core Terminal Runner online.");
console.log("Default mode: SAFE");
console.log("Type `help` for commands.");
prompt();
