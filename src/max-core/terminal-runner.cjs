#!/usr/bin/env node

const readline = require("readline");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

let currentDir = process.cwd();

const LOG_FILE = path.join(process.cwd(), "docs/ffs/memory/COMMAND_LOG.md");

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

function ensureLogFile() {
  const dir = path.dirname(LOG_FILE);
  fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(
      LOG_FILE,
      "# Max Core Command Log\n\nThis file records Max Core terminal runner activity.\n\n"
    );
  }
}

function logAction(command, decision, status) {
  ensureLogFile();

  const entry = [
    `## ${new Date().toISOString()}`,
    "",
    `- Command: \`${command.replace(/`/g, "\\`")}\``,
    `- Risk: ${decision.risk}`,
    `- Status: ${status}`,
    `- Reason: ${decision.reason}`,
    "",
  ].join("\n");

  fs.appendFileSync(LOG_FILE, entry);
}

function showHelp() {
  console.log(`
Max Core Terminal Runner

Commands:
  help                 Show this help menu
  exit                 Close Max Core
  pwd                  Show current working directory
  cd <path>            Change working directory
  risk <command>       Inspect command risk without running it
  log                  Show command log path

Approval phrases:
  APPROVED: EXECUTE HIGH RISK
  APPROVED: EXECUTE CRITICAL
`);
}

function runCommand(command) {
  const decision = inspectCommand(command);

  console.log(`[RISK] ${decision.risk.toUpperCase()}`);
  console.log(`[REASON] ${decision.reason}`);

  if (decision.requiresApproval) {
    rl.question(`Approval required. Type "${decision.phrase}" to continue: `, (answer) => {
      if (answer !== decision.phrase) {
        console.log("Blocked. Approval phrase did not match.");
        logAction(command, decision, "blocked");
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

  exec(command, { cwd: currentDir }, (error, stdout, stderr) => {
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
  rl.question("Max> ", (input) => {
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

    if (command === "log") {
      ensureLogFile();
      console.log(LOG_FILE);
      return prompt();
    }

    if (command.startsWith("cd ")) {
      const target = command.slice(3).trim();
      const nextDir = path.resolve(currentDir, target);

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
console.log("Type `help` for commands.");
prompt();
