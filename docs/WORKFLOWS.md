# Lucid Operational Workflows

**Status:** Proposed foundation
**Version:** 2.0
**Date:** 2026-09-04

This document defines the expected behavior of Lucid from the staff member's point of view and the system's point of view.

## 1. Workflow vocabulary

### Order

A commercial request for one or more menu items.

### Order item

A single menu item inside an order, including quantity, modifiers, notes, price snapshot, tax, and kitchen routing information.

### Kitchen ticket

A preparation instruction generated from an order and routed to one or more kitchen stations.

### Payment transaction

A financial attempt or completed movement of money against an order.

### Inventory transaction

A recorded movement that increases or decreases stock.

## 2. Order creation workflow

```text
Select dining mode
       |
       +--> Dine In ----> Select table
       |
       +--> Takeaway
       |
       +--> Delivery --> Capture delivery details
       |
       v
Select customer (optional depending on policy)
       |
       v
Select menu items
       |
       v
Apply modifiers / notes
       |
       v
Calculate subtotal
       |
       v
Apply discounts
       |
       v
Calculate taxes
       |
       v
Calculate final total
       |
       v
Save DRAFT order
```

The price used by the order must be a snapshot of the price at order time. Later menu price changes must not rewrite historical orders.

## 3. Confirming an order

```text
DRAFT
  |
  v
Validate order
  |
  +--> invalid --> show correction
  |
  v
CONFIRMED
  |
  v
Create kitchen ticket(s)
  |
  v
SENT_TO_KITCHEN
```

Validation should include:

- at least one item
- valid quantities
- valid menu item availability
- valid modifiers
- valid tax/discount rules
- valid table reference for dine-in when required

## 4. Kitchen workflow

```text
Kitchen ticket created
       |
       v
QUEUED
       |
       v
PREPARING
       |
       v
READY
       |
       v
HANDED_OFF
```

The kitchen should be able to progress individual items even when an order contains multiple stations.

Example:

```text
Order #1042
 |
 +-- Burger ------> Grill ------> Ready
 |
 +-- Fries -------> Fry Station -> Ready
 |
 +-- Soda --------> Bar ---------> Ready
```

The parent order should only reach its final ready/served state according to the restaurant's configured fulfillment rule.

## 5. Payment workflow

Payment is a separate state machine.

```text
UNPAID
  |
  v
PAYMENT_STARTED
  |
  +--> FAILED
  |
  v
AUTHORIZED / CAPTURED
  |
  v
PAID
```

Refunds branch from a completed payment:

```text
PAID
 |
 +--> PARTIALLY_REFUNDED
 |
 +--> REFUNDED
```

A provider callback/webhook or verification request must not blindly mutate an order. It must reconcile against a known payment transaction and idempotency key.

## 6. Dine-in workflow

```text
AVAILABLE TABLE
      |
      v
SEATED
      |
      v
OPEN ORDER
      |
      v
ORDER CONFIRMED
      |
      v
KITCHEN
      |
      v
SERVED
      |
      v
AWAITING PAYMENT
      |
      v
PAID
      |
      v
CLOSE ORDER
      |
      v
AVAILABLE TABLE
```

Table state and order state are related but separate. Closing an order should release the table only when there are no other active checks associated with that table.

## 7. Takeaway workflow

```text
ORDER CREATED
      |
      v
CONFIRMED
      |
      v
PREPARING
      |
      v
READY
      |
      v
PAYMENT / VERIFIED PAYMENT
      |
      v
COLLECTED
      |
      v
CLOSED
```

## 8. Delivery workflow

```text
ORDER CREATED
      |
      v
CONFIRMED
      |
      v
PREPARING
      |
      v
READY
      |
      v
ASSIGNED
      |
      v
OUT_FOR_DELIVERY
      |
      v
DELIVERED
      |
      v
CLOSED
```

Delivery-specific states should not be forced into the kitchen status field.

## 9. Inventory workflow

Inventory changes must be explicit.

### Sale depletion

```text
Order closed / configured fulfillment point
       |
       v
Resolve recipe
       |
       v
Calculate ingredient quantities
       |
       v
Create inventory OUT transactions
       |
       v
Update available balance
```

### Receiving stock

```text
Purchase / supplier receipt
       |
       v
Validate received quantity
       |
       v
Create inventory IN transactions
       |
       v
Update available balance
```

### Wastage

```text
Record waste
   |
   v
Select ingredient
   |
   v
Record quantity + reason + user
   |
   v
Create inventory WASTE transaction
```

## 10. Shift and cash drawer workflow

```text
OPEN SHIFT
   |
   v
DECLARE OPENING CASH
   |
   v
PROCESS ORDERS / CASH MOVEMENTS
   |
   v
CLOSE SHIFT
   |
   v
COUNT DRAWER
   |
   v
RECONCILE EXPECTED VS ACTUAL
   |
   v
FINALIZE SHIFT
```

Cash differences must be recorded, not silently ignored.

## 11. Discount workflow

```text
Apply discount request
       |
       v
Check permission
       |
       +--> denied --> block action
       |
       v
Validate discount rule
       |
       v
Apply discount snapshot to order
       |
       v
Audit event
```

High-value discounts may require manager approval later.

## 12. Void and cancellation workflow

A cancellation before kitchen submission may simply cancel the order.

A void after kitchen or payment activity must preserve history.

```text
Active order
   |
   +--> Cancel before fulfillment
   |       -> CANCELLED
   |
   +--> Void after operational activity
           -> VOIDED
           -> audit event
```

Voids must not delete financial history.

## 13. Refund workflow

```text
Completed payment
       |
       v
Refund requested
       |
       v
Permission check
       |
       v
Create refund intent
       |
       v
Provider request
       |
       +--> failed --> REFUND_FAILED
       |
       v
Provider success
       |
       v
REFUNDED / PARTIALLY_REFUNDED
       |
       v
Audit + reporting update
```

## 14. Error handling rules

### Payment failure

The order stays intact. Payment is marked failed and the cashier can retry or choose another allowed method.

### Kitchen failure

If a kitchen station becomes unavailable, the order remains visible and can be rerouted by authorized staff.

### Inventory conflict

If stock is insufficient, the system should use a configured policy:

```text
block sale
OR
allow sale with low/out-of-stock warning
```

The policy should be explicit, not an accidental side effect.

### Network outage

The future offline mode should queue safe operations locally and synchronize them using stable transaction identifiers.

## 15. Audit-sensitive events

The following events should generate audit records:

- order void
- discount above threshold
- payment verification result
- refund
- stock adjustment
- wastage
- cash movement
- shift close/reconciliation
- user role change
- critical restaurant configuration change

## 16. UI responsibility rules

Screens may:

- collect user input
- display state
- trigger commands
- display validation errors

Screens should not directly:

- calculate provider signatures
- mutate inventory balances without a domain operation
- mark payments as paid merely because a button was clicked
- delete historical orders
- bypass authorization rules

## 17. Demo-mode workflow

GitHub Pages is a demonstration environment.

Demo mode may use:

- seeded orders
- seeded menu
- seeded inventory
- simulated payment success/failure
- simulated kitchen timing

Demo mode must never contain real payment credentials or call live financial APIs.

## 18. Acceptance criteria for the core workflow

Before calling the first core implementation complete:

- a cashier can create an order
- order totals are deterministic
- order status transitions are validated
- a kitchen ticket is generated from a confirmed order
- payment status is independent from order status
- successful payment creates a durable transaction record
- failed payment does not lose the order
- order history remains immutable after closure except through controlled adjustment/refund flows
- the dashboard reads derived data instead of hard-coded operational values
