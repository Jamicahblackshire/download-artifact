# Max Core Approval Protocol

## Purpose

This protocol defines how Max Core receives approval for risky operations.

## High Risk Approval

Required phrase:

APPROVED: EXECUTE HIGH RISK

Used for:

- Git push
- Railway changes
- Cloudflare edits
- DNS edits
- n8n production execution
- Payment service changes
- Customer data changes

## Critical Risk Approval

Required phrase:

APPROVED: EXECUTE CRITICAL

Used for:

- Deleting infrastructure
- Destroying databases
- Deleting repositories
- Mass customer operations
- Rotating production secrets
- Destructive shell commands

## Rule

Approval must be specific.

A casual yes is not enough.

Max Core must pause until the correct approval phrase is provided.
