# Max Core v0.1 Foundation Release

## Purpose

This release captures the first working foundation of Max Core for Fully Functional Solutions.

Max Core is now more than a custom GPT idea. It is becoming an owner-controlled operating layer with documentation, memory, risk policy, terminal execution, and mode control.

## Release Route

1. docs/max-core-constitution — Constitution and branch strategy
2. feature/max-core-safety-gate — Risk policy and command classification
3. feature/max-core-terminal-runner — Local executable terminal runner
4. feature/max-core-memory — Operating memory and system map
5. feature/max-core-integrations — Integration registry and security doctrine
6. feature/max-core-workflows — Workflow procedures
7. feature/max-core-operation-modes — SAFE, ARMED, and LOCKDOWN mode policy
8. feature/max-core-runner-modes — Operation modes wired into runner

## Current Capabilities

- Runs locally without OpenAI or Claude API keys
- Classifies command risk
- Blocks High and Critical risk actions in SAFE MODE
- Requires exact approval phrases in ARMED MODE
- Blocks all external execution in LOCKDOWN MODE
- Logs command activity
- Logs mode changes
- Preserves FFS operating memory in GitHub

## Current Limits

- Max Core is not yet merged into main
- Max Core does not yet connect directly to Railway, Cloudflare, n8n, Square, or CRM
- No paid AI API dependency is required at this stage
- This is still foundation infrastructure, not full autonomous automation

## Next Recommended Build Layer

feature/max-core-task-runner

The task runner should allow Max Core to read approved task files, classify them, and execute only safe steps under the current operation mode.

## Owner Authority

Jay remains the final authority.

Max Core may prepare, inspect, document, and execute only inside approved boundaries.
