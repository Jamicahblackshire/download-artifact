#!/usr/bin/env node

/**
 * MAX CORE TERMINAL RUNNER v4.0
 * Plain English • Bash • Research • Auto-correct • Personality
 */

const readline = require("readline");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { FFS_CONTEXT, assessRisk, assessIntent, logEntry, displayBoot } = require("./ffs-context.cjs");

let currentDir = process.env.HOME || "/home/jamicahblackshire";
let currentMode = "ARMED";

const LOG_DIR = path.join(process.cwd(), "docs/ffs/memory");
const TASK_LOG = path.join(LOG_DIR, "TASK_LOG.md");
const INCIDENT_LOG = path.join(LOG_DIR, "INCIDENT_LOG.md");

// AUTO-CORRECT
const TYPOS = {
  "chekc":"check","chek":"check","resart":"restart","deploey":"deploy",
  "depoly":"deploy","teh":"the","hte":"the","adn":"and","waht":"what",
  "wat":"what","stauts":"status","staus":"status","wokflow":"workflow",
  "databse":"database","cloudflrae":"cloudflare","railwy":"railway",
  "gitub":"github","shwo":"show","lsit":"list","listt":"list",
};

function autoCorrect(input) {
  let out = input;
  for (const [typo, fix] of Object.entries(TYPOS)) {
    out = out.replace(new RegExp(`\\b${typo}\\b`, "gi"), fix);
  }
  return out;
}

// NLP COMMAND MAP
const NLP = [
  { match: /check.*n8n|n8n.*status|is n8n/i, cmd: "curl -sI https://n8n.fullyfsolutions.com | head -5" },
  { match: /check.*crm|crm.*status|is.*crm/i, cmd: "curl -sI https://crm.fullyfsolutions.com | head -5" },
  { match: /check.*site|site.*up/i, cmd: "curl -sI https://fullyfsolutions.com | head -5" },
  { match: /check.*tunnel|tunnel.*status/i, cmd: "sudo systemctl status cloudflared --no-pager" },
  { match: /what.*broke|what.*wrong|check.*everything|system.*status/i, cmd: `echo "=== N8N ===" && curl -sI https://n8n.fullyfsolutions.com 2>/dev/null | head -2; echo "=== CRM ===" && curl -sI https://crm.fullyfsolutions.com 2>/dev/null | head -2; echo "=== TUNNEL ===" && sudo systemctl is-active cloudflared; echo "=== DOCKER ===" && docker ps 2>/dev/null | head -5` },
  { match: /restart.*tunnel|tunnel.*restart/i, cmd: "sudo systemctl restart cloudflared" },
  { match: /show.*tunnel.*config|tunnel.*config/i, cmd: "cat /etc/cloudflared/config.yml" },
  { match: /pull.*github|update.*repo|sync.*repo/i, cmd: "git -C ~/ffs-infrastructure pull origin main" },
  { match: /show.*repo|repo.*status|git.*status/i, cmd: "git -C ~/ffs-infrastructure status" },
  { match: /show.*log|check.*log/i, cmd: `tail -30 ${TASK_LOG} 2>/dev/null || echo "No logs yet"` },
  { match: /show.*error|check.*error|incidents/i, cmd: `tail -30 ${INCIDENT_LOG} 2>/dev/null || echo "No incidents"` },
  { match: /restart.*crm|crm.*restart|restart.*espo/i, cmd: "docker restart espocrm" },
  { match: /show.*docker|docker.*status|containers/i, cmd: "docker ps" },
  { match: /disk.*space|storage.*space/i, cmd: "df -h" },
  { match: /memory|ram.*usage/i, cmd: "free -h" },
  { match: /show.*workflow|list.*workflow/i, cmd: "ls ~/ffs-infrastructure/n8n-workflows/" },
  { match: /import.*workflow|deploy.*workflow/i, cmd: "ls ~/ffs-infrastructure/n8n-workflows/ && echo 'Use API key to import via curl'" },
  { match: /who.*i am|current.*user/i, cmd: "whoami" },
  { match: /ip.*address|my.*ip/i, cmd: "curl -s ifconfig.me" },
  { match: /uptime|how long.*running/i, cmd: "uptime" },
];

function parseNLP(input) {
  for (const entry of NLP) {
    if (entry.match.test(input)) return entry.cmd;
  }
  return null;
}

// WEB RESEARCH
function research(query) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 20000);
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    https.get(url, { headers: { "User-Agent": "MaxCore/4.0" } }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        clearTimeout(timer);
        try {
          const j = JSON.parse(data);
          resolve(j.AbstractText || (j.RelatedTopics?.[0]?.Text) || null);
        } catch { resolve(null); }
      });
    }).on("error", () => { clearTimeout(timer); resolve(null); });
  });
}

// LOGGING
function log(msg, file = TASK_LOG) { logEntry(msg, file); }

// CONVERSATION
function handleConvo(input, rl) {
  const l = input.toLowerCase();
  if (/^(hey|hi|hello|sup|yo|what'?s up)\b/i.test(l)) {
    const g = ["What's good JT. Ready when you are.", "I'm here. What do you need?", "Standing by. What's the move?", "Hey. What are we working on?"];
    console.log(`\n  ${g[Math.floor(Math.random() * g.length)]}\n`);
    return true;
  }
  if (/how are you|you good/i.test(l)) { console.log("\n  All systems running. Ready to work.\n"); return true; }
  if (/^(thanks|thank you|good job|nice|perfect|got it|bet|solid)\b/i.test(l)) {
    const r = ["Understood. Next move?", "Copy that. What else?", "On it. Anything else?", "Got it. What's next?"];
    console.log(`\n  ${r[Math.floor(Math.random() * r.length)]}\n`);
    return true;
  }
  if (/who are you|what are you|introduce/i.test(l)) {
    console.log(`\n  I'm Max — FFS Operations Commander.\n  Built by JT. I run the business stack so you don't have to babysit it.\n  Plain English is fine. I figure out the rest.\n`);
    return true;
  }
  return false;
}

// BUILT-INS
function handleBuiltin(input, rl) {
  const l = input.toLowerCase().trim();
  const parts = input.trim().split(/\s+/);

  if (l === "help") {
    console.log(`
  ┌──────────────────────────────────────────────────────┐
  │  MAX CORE v4.0 — JUST TALK TO ME IN PLAIN ENGLISH   │
  ├──────────────────────────────────────────────────────┤
  │  "Check if n8n is running"                          │
  │  "What broke"                                        │
  │  "Pull latest from GitHub"                           │
  │  "Restart the tunnel"                                │
  │  "Show me the logs"                                  │
  │  "How much disk space do we have"                    │
  │  "Research <anything>"                               │
  ├──────────────────────────────────────────────────────┤
  │  COMMANDS:                                           │
  │    help / status / stack / divisions / crew          │
  │    mode / set-mode SAFE|ARMED|LOCKDOWN               │
  │    research <query>   Web search (20 sec)            │
  │    risk <cmd>         Check risk level               │
  │    bash <cmd>         Force raw bash                 │
  │    cd / pwd / log / exit                             │
  └──────────────────────────────────────────────────────┘
`);
    return true;
  }

  if (l === "exit" || l === "bye" || l === "shutdown") {
    console.log("\n  Max Core offline. FFS is in your hands, JT.\n");
    rl.close(); process.exit(0);
  }

  if (l === "pwd" || l === "where am i") { console.log(`  ${currentDir}\n`); return true; }

  if (l.startsWith("cd ")) {
    const t = parts.slice(1).join(" ").replace(/^~/, process.env.HOME);
    const r = path.resolve(currentDir, t);
    if (fs.existsSync(r) && fs.statSync(r).isDirectory()) { currentDir = r; console.log(`  ${currentDir}\n`); }
    else console.log(`  Can't find: ${t}\n`);
    return true;
  }

  if (l === "mode") { console.log(`  Mode: ${currentMode}\n`); return true; }

  if (l.startsWith("set-mode ")) {
    const m = parts[1]?.toUpperCase();
    if (["SAFE","ARMED","LOCKDOWN"].includes(m)) { console.log(`  Mode: ${currentMode} → ${m}\n`); currentMode = m; log(`Mode: ${currentMode} → ${m}`); }
    else console.log(`  Valid: SAFE, ARMED, LOCKDOWN\n`);
    return true;
  }

  if (l === "status") {
    console.log(`\n  FFS STACK:\n  n8n : ${FFS_CONTEXT.stack.n8n}\n  CRM : ${FFS_CONTEXT.stack.crm}\n  Site: ${FFS_CONTEXT.stack.site}\n\n  Run "check everything" for live status.\n`);
    return true;
  }

  if (l === "stack") {
    console.log("\n  SYSTEMS:"); for (const [k,v] of Object.entries(FFS_CONTEXT.stack)) console.log(`    ${k.padEnd(20)}: ${v}`); console.log("");
    return true;
  }

  if (l === "divisions") {
    console.log("\n  DIVISIONS:"); for (const [k,v] of Object.entries(FFS_CONTEXT.divisions)) console.log(`    [${k.toUpperCase()}] ${v.name} → ${v.webhook}`); console.log("");
    return true;
  }

  if (l === "crew") {
    console.log("\n  AI CREW:"); for (const [k,v] of Object.entries(FFS_CONTEXT.crew)) console.log(`    [${k.toUpperCase()}] ${v}`); console.log("");
    return true;
  }

  if (/^(research|search|look up|google|find out)\s+/i.test(l)) {
    const q = input.replace(/^(research|search|look up|google|find out)\s+/i, "").trim();
    console.log(`  Researching: "${q}" (20 sec window)...`);
    research(q).then(r => {
      if (r) console.log(`\n  FOUND:\n  ${r}\n`);
      else console.log(`  Nothing solid found. Try different terms or I can bash-search.\n`);
      prompt(rl);
    });
    return true;
  }

  if (l.startsWith("risk ")) {
    const c = parts.slice(1).join(" ");
    const r = assessRisk(c);
    console.log(`\n  Risk: ${r.toUpperCase()} | System: ${assessIntent(c)}\n  Action: ${r==="critical"?"BLOCK — escalate to JT":r==="high"?"Needs approval":r==="medium"?"Execute with logging":"Execute freely"}\n`);
    return true;
  }

  if (l.startsWith("bash ")) { runCommand(parts.slice(1).join(" "), rl); return true; }

  if (l === "log") { console.log(`  Task log: ${TASK_LOG}\n  Incidents: ${INCIDENT_LOG}\n`); return true; }

  return false;
}

// EXECUTE
function executeCommand(input, rl) {
  const nlp = parseNLP(input);
  if (nlp) { console.log(`  [→ ${nlp.slice(0,60)}${nlp.length>60?"...":""}]\n`); runCommand(nlp, rl); return; }
  runCommand(input, rl);
}

function runCommand(cmd, rl) {
  const risk = assessRisk(cmd);
  if (currentMode === "LOCKDOWN") { console.log("  [BLOCKED] Lockdown active.\n"); return prompt(rl); }
  if (risk === "critical") { console.log("  [BLOCKED] Critical risk — escalate to JT immediately.\n"); log(`CRITICAL BLOCKED: ${cmd}`, INCIDENT_LOG); return prompt(rl); }
  if (risk === "high" && currentMode === "SAFE") { console.log("  [BLOCKED] High risk in SAFE mode. Switch to ARMED if approved.\n"); return prompt(rl); }
  if (risk === "high" && currentMode === "ARMED") {
    console.log(`  [HIGH RISK] This touches: ${assessIntent(cmd)}`);
    rl.question('  Type "APPROVED: EXECUTE HIGH RISK" to continue: ', (a) => {
      if (a.trim() === "APPROVED: EXECUTE HIGH RISK") { log(`APPROVED HIGH: ${cmd}`); run(cmd, rl); }
      else { console.log("  Aborted.\n"); prompt(rl); }
    });
    return;
  }
  run(cmd, rl);
}

function run(cmd, rl) {
  log(`CMD: ${cmd} | MODE: ${currentMode}`);
  exec(cmd, { cwd: currentDir, shell: "/bin/bash", timeout: 30000 }, (err, stdout, stderr) => {
    if (stdout) process.stdout.write(stdout.trim() + "\n");
    if (stderr && !err) process.stderr.write(stderr.trim() + "\n");
    if (err) {
      console.log(`\n  [ERROR] ${err.message.split("\n")[0]}`);
      if (err.message.includes("command not found")) console.log("  That tool might not be installed. Want me to install it?");
      else if (err.message.includes("Permission denied")) console.log("  Permission issue. Try prefixing with sudo.");
      else if (err.message.includes("ECONNREFUSED")) console.log("  Connection refused. Service might be down.");
      log(`ERROR: ${err.message}`, INCIDENT_LOG);
    } else { log(`DONE: ${cmd}`); }
    console.log("");
    prompt(rl);
  });
}

// PROMPT
function prompt(rl) {
  rl.question(`Max:${currentMode}> `, (raw) => {
    if (!raw.trim()) return prompt(rl);
    const input = autoCorrect(raw.trim());
    if (input !== raw.trim()) console.log(`  [corrected: "${input}"]`);
    if (handleConvo(input, rl)) return prompt(rl);
    if (handleBuiltin(input, rl)) {
      if (/^(research|search|look up|google|find out)\s+/i.test(input.toLowerCase())) return;
      return prompt(rl);
    }
    executeCommand(input, rl);
  });
}

// BOOT
displayBoot();
fs.mkdirSync(LOG_DIR, { recursive: true });
fs.mkdirSync(path.join(process.cwd(), ".runtime"), { recursive: true });
log(`BOOT: Max Core v4.0`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl.on("close", () => { console.log("\n  Max offline.\n"); process.exit(0); });
prompt(rl);
