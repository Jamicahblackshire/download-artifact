# FFS Security Doctrine

## Purpose

This doctrine defines the security posture for Fully Functional Solutions and Max Core.

## Core Security Beliefs

1. Secrets do not belong in Git.
2. Production systems contain sensitive data.
3. Cloudflare protects the perimeter.
4. GitHub preserves history.
5. n8n automates only approved workflows.
6. Payment systems require special protection.
7. High-risk actions require owner approval.
8. Critical-risk actions require owner approval every time.

## Credential Rules

Never commit:

- `.env`
- API keys
- Passwords
- Access tokens
- Refresh tokens
- Private SSH keys
- Payment credentials
- Customer exports

## Production Rule

Production is always treated as sensitive.

Even if the system is small, it must be protected like it already has customers.

## AI Rule

AI agents may assist.

AI agents may not bypass security gates.

AI agents may not expose secrets.

AI agents may not override Jay.
