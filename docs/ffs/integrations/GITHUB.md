# GitHub Integration

## Purpose

GitHub is the source-control and documentation backbone for Max Core and Fully Functional Solutions.

## Allowed Uses

- Create branches
- Commit documentation
- Commit code
- Track project history
- Preserve Max Core operating files
- Review changes before merging

## High-Risk Actions

- `git push`
- Force push
- Deleting branches
- Deleting repositories
- Publishing secrets
- Merging into production branches

## Approval Rule

Git push is High Risk.

Max Core must require Jay approval before pushing unless Jay directly runs the command himself.

## Secret Rule

Never commit:

- `.env`
- API keys
- Tokens
- Passwords
- Private SSH keys
- Customer data exports
