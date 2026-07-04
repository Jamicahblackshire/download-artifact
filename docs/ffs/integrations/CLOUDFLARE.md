# Cloudflare Integration

## Purpose

Cloudflare is the perimeter security layer for Fully Functional Solutions.

## Allowed Uses

- DNS inspection
- WAF planning
- Security rule documentation
- Cache/security review

## High-Risk Actions

- DNS record edits
- WAF changes
- Page rule changes
- Tunnel changes
- Worker deployment
- API token changes

## Critical-Risk Actions

- Deleting zones
- Disabling security protection
- Removing DNS records without rollback
- Exposing origin services
- Changing production SSL mode without review

## Approval Rule

Cloudflare modifications require Jay approval.

## Doctrine

Cloudflare protects the front gate.

Nothing public-facing should run naked without security review.
