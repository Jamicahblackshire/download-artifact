# Railway Integration

## Purpose

Railway is a target hosting layer for FFS apps, backend services, webhooks, APIs, and future Max Core components.

## Allowed Uses

- Inspect project status
- Review deployment logs
- Configure non-production services
- Prepare deployment plans

## High-Risk Actions

- Production deployment
- Environment variable changes
- Service deletion
- Database changes
- Domain changes
- Restarting production services

## Approval Rule

Railway actions are High Risk by default.

Destructive Railway actions are Critical Risk.

## Required Documentation

Every Railway service must have:

- Purpose
- Environment
- Linked repository
- Required variables
- Deployment command
- Rollback procedure
