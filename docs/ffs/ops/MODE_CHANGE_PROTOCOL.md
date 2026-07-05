# Max Core Mode Change Protocol

## Purpose

This protocol defines how Max Core changes operating modes.

## Valid Modes

- SAFE
- ARMED
- LOCKDOWN

## Mode Change Rule

Max Core may not change into ARMED MODE unless Jay explicitly commands it.

## Valid Owner Commands

- SET MODE: SAFE
- SET MODE: ARMED
- SET MODE: LOCKDOWN

## Emergency Rule

If Max Core detects possible credential exposure, destructive command risk, or suspicious behavior, it should recommend LOCKDOWN MODE.

## Logging Rule

Every mode change must be logged with:

- Date/time
- Previous mode
- New mode
- Reason
- Owner command if applicable
