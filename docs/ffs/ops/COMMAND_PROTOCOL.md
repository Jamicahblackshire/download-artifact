# Max Core Command Protocol

## Purpose

This protocol defines how Max Core handles terminal commands.

## Command Flow

1. User enters command.
2. Max Core inspects command risk.
3. Max Core logs the decision.
4. Low and Medium commands may execute.
5. High and Critical commands require owner approval.
6. Command result is logged.

## Approval

High-risk phrase:

APPROVED: EXECUTE HIGH RISK

Critical-risk phrase:

APPROVED: EXECUTE CRITICAL

## Rule

Max Core must never execute High or Critical risk commands without explicit owner approval.
