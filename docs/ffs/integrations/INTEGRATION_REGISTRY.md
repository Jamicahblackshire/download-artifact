# FFS Integration Registry

## Purpose

This registry defines every external system Max Core may interact with for Fully Functional Solutions.

Max Core must know what each system does before interacting with it.

No integration may be used with production credentials unless its security rules are documented.

---

## Active / Target Integrations

| System | Purpose | Risk Level | Status |
|---|---|---:|---|
| GitHub | Source control, branches, issues, documentation | High | Active |
| Railway | App/service hosting | High | Target |
| Cloudflare | DNS, WAF, security perimeter | High/Critical | Active/Target |
| n8n | Workflow automation | High | Target |
| Square | Payments and invoices | High/Critical | Target |
| WordPress / Hostinger | Public FFS website | High | Active |
| CRM | Lead/customer tracking | High | Target |
| Slack | Internal alerts and approvals | Medium/High | Target |
| Airtable / DB Layer | Data tracking and event logs | High | Target |
| OpenAI | Optional AI provider | Medium/High | Optional |
| Claude | Optional AI provider | Medium/High | Optional |
| Codex | Optional coding worker | Medium/High | Optional |
| Local Models | Optional offline AI worker | Medium | Future |

---

## Core Rule

Integrations are tools.

They do not control the business.

Jay controls the business.

Max Core controls routing, documentation, and safety gates.

Worker models execute only inside approved boundaries.
