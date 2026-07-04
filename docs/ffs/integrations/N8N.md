# n8n Integration

## Purpose

n8n is the workflow automation layer for Fully Functional Solutions.

## Target Uses

- Lead intake
- Booking notifications
- CRM updates
- Slack alerts
- Approval routing
- Customer follow-up
- Daily business reports

## High-Risk Actions

- Executing production workflows
- Changing webhook URLs
- Changing credentials
- Modifying customer data flows
- Sending automated customer messages

## Approval Rule

Production workflow execution requires Jay approval unless the workflow has been previously approved and documented.

## Required Workflow Documentation

Every workflow must include:

- Name
- Purpose
- Trigger
- Inputs
- Outputs
- Credentials used
- Failure behavior
- Rollback/disable procedure
