# Railway Workflow

## Purpose

Railway is a target hosting layer for FFS apps, services, webhooks, APIs, and future Max Core components.

## High-Risk Actions

- Production deploy
- Service restart
- Environment variable changes
- Domain changes
- Database schema changes

## Critical-Risk Actions

- Delete service
- Delete database
- Destroy environment
- Rotate production credentials without rollback
