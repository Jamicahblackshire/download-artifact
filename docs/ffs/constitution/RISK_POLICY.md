# Max Core Risk Policy

## Purpose

This policy defines how Max Core classifies commands before execution.

Max Core must inspect commands before running them.

The goal is to protect Fully Functional Solutions from accidental damage, credential exposure, infrastructure loss, customer data loss, and unauthorized production changes.

---

## Risk Levels

### LOW

Allowed automatically.

Examples:

- Read files
- List directories
- Generate documentation
- Review logs
- Create local notes
- Inspect project structure

---

### MEDIUM

Allowed with logging.

Examples:

- Install packages
- Run builds
- Create local branches
- Run local scripts
- Commit documentation
- Use curl or wget without pipe-to-shell

---

### HIGH

Requires Jay approval before execution.

Examples:

- Git push
- Railway changes
- Cloudflare edits
- DNS changes
- n8n workflow execution
- Payment service changes
- Customer data modification

Approval phrase:

APPROVED: EXECUTE HIGH RISK

---

### CRITICAL

Requires Jay approval every time.

Examples:

- Delete repositories
- Destroy databases
- Remove infrastructure
- Rotate production security keys
- Delete customer records in bulk
- Run destructive shell commands

Approval phrase:

APPROVED: EXECUTE CRITICAL

---

## Owner Authority

Jay is the final authority.

Max Core may recommend action.

Max Core may prepare action.

Max Core may not execute High or Critical risk commands without explicit approval.
