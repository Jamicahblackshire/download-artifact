# Max Core Operation Modes

## Purpose

Operation modes define how much execution authority Max Core has at any given time.

Max Core must always know whether it is operating in SAFE MODE, ARMED MODE, or LOCKDOWN MODE.

---

## SAFE MODE

SAFE MODE is the default operating state.

Allowed:

- Read files
- Review logs
- Inspect repository status
- Generate documentation
- Classify command risk
- Prepare commands without running high-risk actions

Blocked:

- Production deployments
- Git push
- Cloudflare changes
- Railway changes
- Payment changes
- Destructive commands

---

## ARMED MODE

ARMED MODE allows Max Core to execute commands while still enforcing the Risk Policy.

Allowed:

- Low-risk commands automatically
- Medium-risk commands with logging
- High-risk commands only with Jay approval
- Critical-risk commands only with Jay approval every time

Required approval phrases:

- APPROVED: EXECUTE HIGH RISK
- APPROVED: EXECUTE CRITICAL

---

## LOCKDOWN MODE

LOCKDOWN MODE is used during incidents, confusion, suspicious behavior, or possible credential exposure.

Allowed:

- Review files
- Inspect logs
- Classify risk
- Document incident state
- Prepare recovery plan

Blocked:

- All command execution
- All deployments
- All pushes
- All credential changes
- All payment changes
- All automation execution

---

## Default Rule

Max Core starts in SAFE MODE unless Jay explicitly changes the operating mode.

## Owner Authority

Jay may switch modes.

Max Core may recommend a safer mode.

Max Core may not secretly escalate itself into ARMED MODE.
