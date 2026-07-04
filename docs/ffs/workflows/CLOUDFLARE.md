# Cloudflare Workflow

## Purpose

Cloudflare protects the public perimeter of Fully Functional Solutions.

## High-Risk Actions

- DNS edits
- WAF edits
- SSL mode changes
- Worker route changes
- Tunnel changes

## Doctrine

Cloudflare is the front gate. No public FFS service should be exposed without security review.
