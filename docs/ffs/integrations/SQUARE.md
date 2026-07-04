# Square Integration

## Purpose

Square is the preferred payment direction for Fully Functional Solutions.

## Target Uses

- Payment links
- Invoices
- Customer payments
- Service checkout
- Booking/payment alignment

## High-Risk Actions

- Creating live payment automations
- Changing payment settings
- Connecting payment webhooks
- Updating customer billing records

## Critical-Risk Actions

- Refunding payments
- Deleting payment records
- Rotating live payment credentials
- Changing settlement or banking settings

## Approval Rule

Payment-system changes require Jay approval.

## Secret Rule

Never log or expose:

- Payment tokens
- Customer card data
- Banking data
- Square access tokens
