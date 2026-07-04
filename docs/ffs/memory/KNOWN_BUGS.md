# FFS Known Bugs and Issues

## Purpose

This file tracks known system issues, bugs, and risks.

---

## Website Issues

- Booking/payment flow needs continued review.
- Service routing must be checked before public launch.
- Vendor/service names must stay clear and professional.
- Mobile menu behavior may need inspection.

---

## Automation Issues

- n8n workflow structure still needs final mapping.
- Production credentials must not be exposed.
- Webhooks must require authentication.
- High-risk workflow execution must require Jay approval.

---

## Repository Issues

- Current repository began as `download-artifact`, not a dedicated FFS repository.
- Long-term recommendation: migrate Max Core into `ffs-core` or `max-core`.
- AI orchestration files from the old branch may need cleanup before production use.

---

## Security Issues

- Never commit `.env` files.
- Never expose API tokens in terminal output.
- Never run destructive commands without approval.
