# Max Core Task Runner Protocol

## Purpose

The task runner allows Max Core to execute approved task files without requiring a paid AI API.

## Task File Format

Task files live in docs/ffs/tasks/.

Each task file may include:

- A title using # 
- A mode line using MODE: SAFE, MODE: ARMED, or MODE: LOCKDOWN
- One or more command lines using COMMAND:

## Mode Rules

SAFE allows Low and Medium risk commands.

ARMED allows Low and Medium risk commands and requires approval for High and Critical risk commands.

LOCKDOWN blocks all external command execution.

## Logging

Task activity is logged in docs/ffs/memory/TASK_LOG.md.
