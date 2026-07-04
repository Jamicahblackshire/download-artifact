# Incident Response Workflow

## Purpose

Defines what Max Core should do when something breaks, leaks, fails, or behaves dangerously.

## Incident Types

- Exposed credential
- Website outage
- Failed deployment
- Broken payment route
- Broken booking route
- Suspicious login
- Cloudflare security event
- n8n workflow failure
- Customer data concern

## Critical Rule

If a secret is exposed, assume it is compromised. Rotate it. Do not reuse it.
