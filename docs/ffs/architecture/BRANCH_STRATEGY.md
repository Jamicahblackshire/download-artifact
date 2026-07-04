# Max Core Branch Strategy

## Purpose

This branch strategy documents the route used to establish Max Core as the AI Operations Commander for Fully Functional Solutions.

## Required Branches

### main

Stable production-ready source.

### docs/max-core-constitution

Stores Max Core identity, authority rules, security doctrine, risk policy, and operating philosophy.

### feature/max-core-safety-gate

Adds command risk classification and approval requirements.

### feature/max-core-terminal-runner

Creates the local terminal runner for Max Core.

### feature/max-core-memory

Stores system memory, known bugs, roadmap, active services, and completed milestones.

### feature/max-core-integrations

Adds integrations over time for GitHub, Railway, Cloudflare, n8n, Square, CRM, Slack, Airtable, OpenAI, Claude, and Codex.

### sandbox/max-core-testing

Used for testing commands, workflows, and automation before production.

## Operating Rule

Every branch must answer:

1. What is this branch for?
2. What system does it affect?
3. What risk level does it introduce?
4. How do we test it?
5. How do we roll it back?
