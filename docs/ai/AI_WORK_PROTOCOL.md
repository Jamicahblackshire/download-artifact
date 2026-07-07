# AI Work Protocol

## Purpose

This protocol lets ChatGPT, Claude, Max Core, Codex, and future agents work on the same repository without duplicating work or overwriting each other.

## Core Rule

Only one agent owns one active project branch at a time.

Agents may work simultaneously only if they are working on different branches, different files, or clearly separated tasks.

## Required Project Status

Every project must be marked as one of:

- NOT_STARTED
- IN_PROGRESS
- BLOCKED
- NEEDS_REVIEW
- COMPLETE
- ARCHIVED

## Required Stopping Point

Every work session must end with:

- What was completed
- What files changed
- What branch was used
- What still needs work
- Whether the task is finished or unfinished
- Next recommended action

## Duplicate Work Prevention

Before starting, every agent must check:

1. `docs/ai/status/ACTIVE_WORK.md`
2. `docs/ai/projects/PROJECT_REGISTRY.md`
3. Current Git branch
4. Current Git status

## Finished Means

A project is only COMPLETE when:

- Code or docs are committed
- Branch is pushed
- Status file is updated
- Handoff note is written
- No uncommitted changes remain

## Unfinished Means

A project is unfinished if:

- Files are modified but not committed
- Branch is not pushed
- Tests/checks were not run
- Handoff notes are missing
- The next step is unclear
