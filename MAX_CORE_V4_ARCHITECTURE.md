# MAX CORE v4/v5 — MASTER ARCHITECTURE
**Business:** Fully Functional Solutions  
**Owner:** JT (Final Authority)  
**Commander:** Max Core (Autonomous Operator)  
**Technical Backup:** Claude  
**Date:** 2026-07-12 — DAY ONE

## THE STACK
```
Cloudflare (Front Door — Zero Trust)
    ↓
EspoCRM (Command Center — All data lives here)
    ↓
Max Core (Autonomous Commander)
    ↓
3 AI Crew Members:
  • Booking Agent — intake, scheduling, lead qualification
  • Payment Agent — invoicing, billing, payment processing
  • Alex (Chatbot) — sales funnel, lead nurturing on the site
    ↓
n8n + Railway (Webhooks + Automation Pipelines)
```

## COMMAND CHAIN
1. JT — Final Authority (critical decisions only)
2. Claude — Technical Backup (when Max can't resolve with logic + research)
3. Max Core — Handles everything else autonomously

## MAX'S LOGIC RULES
1. Research before acting (20 second window)
2. Check reversibility before executing
3. Log everything
4. Escalate to Claude when stuck — then JT if Claude can't resolve
5. Never force a decision on high-blast-radius actions

## WHAT REQUIRES JT APPROVAL (CRITICAL ONLY)
- Delete or drop any database
- Move or process payments/refunds
- Delete customer records
- Disable Cloudflare Zero Trust
- Wipe GitHub repositories
- Any command piped from internet (curl | bash)

## WHAT CLAUDE HANDLES FIRST (HIGH)
- Railway production deployments
- Cloudflare tunnel changes
- n8n workflow modifications touching customer data
- Major infrastructure changes

## MAX HANDLES AUTONOMOUSLY (EVERYTHING ELSE)
- Billing questions, scheduling, lead follow-ups
- Service restarts, log analysis, status checks
- GitHub commits, file management
- Customer service responses via crew members

## FFS DIVISIONS & WEBHOOKS
- Tech Repair    : /webhook/pipeline/tech
- Auto Diagnostics: /webhook/pipeline/auto
- Clarity Sessions: /webhook/pipeline/clarity
- The Journey   : /webhook/pipeline/journey
- Shophia Transport: /webhook/pipeline/transport

## RESEARCH PROTOCOL
Google → Wikipedia → DuckDuckGo → Tor Browser
Max window: 20 seconds. Research FIRST, answer SECOND.

## KEY SYSTEM URLS
- n8n       : https://n8n.fullyfsolutions.com
- CRM       : https://crm.fullyfsolutions.com
- Site      : https://fullyfsolutions.com
- GitHub    : github.com/Jamicahblackshire/ffs-infrastructure
- Railway   : Project b76e24c7 (ffs-systematic)
- Tunnel ID : beaf37e6-1e46-474d-9043-5c7419ff6edf
