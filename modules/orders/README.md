# Orders module

This module owns the canonical restaurant order lifecycle.

## Responsibilities

- Order identity and numbering
- Dining mode
- Line items and modifiers
- Pricing calculation
- Valid order status transitions
- Draft creation and lifecycle application helpers

## Boundaries

The orders module does not own payment settlement, inventory mutation, kitchen ticket persistence, or user permissions. Those domains consume order events and state through explicit application boundaries.
