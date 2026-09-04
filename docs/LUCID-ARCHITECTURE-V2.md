# Lucid Cash Point: Product & System Architecture V2

**Status:** Proposed foundation
**Date:** 2026-09-04
**Scope:** Restaurant Point of Sale (POS) and restaurant operations platform

## 1. Purpose

Lucid is being revived from an older restaurant POS prototype into a portfolio-quality product architecture that follows the operational model of a modern restaurant system.

The goal of V2 is not to rewrite the existing application immediately. The goal is to establish a stable domain model and workflow contract, then migrate the existing screens and components into that model incrementally.

## 2. Current-state assessment

The current repository is a Next.js application with a dashboard, settings area, reusable UI components, client-side restaurant state, inventory state, and payment provider adapters. Historical versions contain richer inventory and restaurant workflows than the current main branch.

Current characteristics:

- Dashboard metrics and recent orders are largely demonstration data.
- Restaurant state is currently managed through client-side React context/reducer patterns.
- Inventory exists as a separate client-side state domain in the historical implementation.
- Payment integrations are represented through provider adapters and a unified payment service.
- Several navigation targets describe capabilities that are not yet represented as complete first-class product modules on the current branch.
- Server-side payment API routes exist in the repository and therefore the production application and GitHub Pages demo must remain conceptually separate.

### Architectural conclusion

Lucid is currently best treated as a functional prototype rather than a production-ready POS backend. The prototype contains useful UI and domain concepts, so the recommended path is incremental extraction and replacement rather than a destructive rewrite.

## 3. Target architecture

```text
                           LUCID CLIENTS
               +----------------+----------------+
               |                                 |
        Web POS / Dashboard              Future Desktop POS
               |                                 |
               +---------------+-----------------+
                               |
                        Application API
                               |
       +-----------------------+-----------------------+
       |                       |                       |
   Orders Domain          Payments Domain        Catalog Domain
       |                       |                       |
       +-----------+-----------+-----------+-----------+
                   |                       |
             Kitchen Domain          Inventory Domain
                   |                       |
             Staff / Auth          Customers / CRM
                   |                       |
                   +-----------+-----------+
                               |
                       Reporting / Audit
                               |
                       PostgreSQL Database
                               |
                    Realtime / Sync Boundary
```

The target system is organized around business domains, not individual screens.

## 4. Core domains

### 4.1 Organization and location

Owns restaurant identity and operating locations.

Responsibilities:
- restaurant profile
- location/branch
- operating hours
- currency
- tax defaults
- business settings

### 4.2 Staff, authentication and permissions

Owns identities and authorization.

Responsibilities:
- users
- roles
- permissions
- shifts
- active sessions
- cash drawer ownership
- audit events

Initial roles:

```text
Owner
Manager
Supervisor
Cashier / Server
Kitchen Staff
```

Permissions must be action-based, especially for discounts, voids, refunds, cash adjustments, configuration changes, and user administration.

### 4.3 Catalog / menu

Owns what the restaurant sells.

Responsibilities:
- menu categories
- menu items
- prices
- availability
- modifiers
- modifier options
- tax classification
- kitchen routing
- recipes / ingredient mapping

### 4.4 Tables and dining areas

Owns physical table state.

Responsibilities:
- dining areas
- tables
- table capacity
- table status
- open checks/orders
- table transfer
- table merge/split where supported

Recommended table state:

```text
AVAILABLE
SEATED
OPEN_ORDER
AWAITING_PAYMENT
CLOSED
```

### 4.5 Orders

Owns the commercial order record and its lifecycle.

An order contains:
- order identifier
- restaurant/location
- dining mode
- table reference when applicable
- customer reference when applicable
- line items
- modifiers
- notes
- discounts
- taxes
- totals
- timestamps
- source
- lifecycle status

Order status must be explicit rather than an arbitrary string.

Recommended lifecycle:

```text
DRAFT
  -> CONFIRMED
  -> SENT_TO_KITCHEN
  -> PREPARING
  -> READY
  -> SERVED / COLLECTED / OUT_FOR_DELIVERY
  -> CLOSED
```

Exceptional states:

```text
CANCELLED
VOIDED
```

Status transitions should be validated by domain rules rather than directly mutated by UI components.

### 4.6 Kitchen / Kitchen Display System

The Kitchen Display System (KDS) owns preparation workflow, not payment workflow.

Responsibilities:
- kitchen tickets
- station routing
- ticket priority
- item-level preparation state
- preparation timestamps
- ready notifications

Example:

```text
Order confirmed
      -> kitchen ticket created
      -> station routing
      -> preparing
      -> ready
      -> handoff
```

Different items from one order may route to different stations.

### 4.7 Payments

Payment lifecycle must be separate from order lifecycle.

Recommended payment states:

```text
PENDING
AUTHORIZED
CAPTURED
PARTIALLY_PAID
PAID
FAILED
VOIDED
REFUNDED
PARTIALLY_REFUNDED
```

The order may be operationally complete before payment is complete, depending on the restaurant's workflow.

The provider abstraction should expose strongly typed operations such as:

```text
initialize
createPayment
verifyPayment
capturePayment
refundPayment
getPaymentStatus
```

Provider-specific credentials, API behavior, and fee rules stay inside provider adapters.

### 4.8 Inventory

Inventory must model movement, not only a current quantity.

Responsibilities:
- ingredients / stock items
- units
- stock levels
- minimum/reorder levels
- purchase receipts
- stock adjustments
- wastage
- transfers
- suppliers
- inventory valuation
- inventory transactions

The important relationship is:

```text
Menu Item
   -> Recipe
      -> Ingredients
         -> Inventory Transactions
```

A completed sale should be able to produce the appropriate ingredient stock movements once recipe-based depletion is enabled.

### 4.9 Customers

Owns customer identity and customer history.

Responsibilities:
- customer profile
- contact information
- order history
- visit history
- spend totals
- preferences
- loyalty features later

### 4.10 Reporting and analytics

Reporting reads operational data. It should not become a second source of truth.

Initial reports:
- sales by day/week/month
- order count
- average order value
- payment method breakdown
- best-selling items
- discounts and voids
- refunds
- inventory value
- stock movement
- staff activity

### 4.11 Printing and device integration

Printer configuration is a device/integration concern.

Responsibilities:
- printer registration
- printer type
- receipt routing
- kitchen ticket routing
- print templates
- connection state

The browser UI should not own direct business logic for printer behavior.

## 5. Canonical entities

The target database should evolve toward entities such as:

```text
restaurants
locations
users
roles
permissions
user_roles
shifts
cash_drawers
cash_movements

dining_areas
tables

menu_categories
menu_items
menu_item_modifiers
modifier_options
recipes
recipe_ingredients

orders
order_items
order_item_modifiers
order_status_history

kitchen_stations
kitchen_tickets
kitchen_ticket_items

payments
payment_transactions
refunds

inventory_items
inventory_transactions
stock_adjustments
suppliers
purchase_orders

customers
customer_visits

taxes
discounts
printers
printer_routes

sessions
audit_logs
```

This is a target model, not a migration instruction to create all tables at once.

## 6. Source-of-truth rules

The following rules are architectural invariants:

1. UI state is not the source of truth for financial or operational records.
2. Order status, payment status, and kitchen status are separate concepts.
3. Every financially significant action must be traceable to a user and timestamp.
4. Inventory changes are recorded as transactions or adjustments, not by silently overwriting a quantity.
5. Payment-provider details are isolated behind adapters.
6. Reporting derives from operational records.
7. GitHub Pages is a static demo surface only and is never treated as the production backend.

## 7. Application layers

```text
Presentation
  pages, screens, components
       |
Application
  commands, queries, orchestration
       |
Domain
  entities, rules, state transitions
       |
Infrastructure
  database, payment providers, printers, external services
```

Business rules should not live primarily inside JSX event handlers.

## 8. Main operational workflows

### 8.1 Dine-in order

```text
Server selects table
      -> create draft order
      -> add menu items/modifiers
      -> apply tax/discount rules
      -> confirm order
      -> create kitchen ticket(s)
      -> kitchen prepares
      -> item(s) ready
      -> serve
      -> request/collect payment
      -> verify/capture payment
      -> receipt
      -> close order
      -> update reporting/inventory
```

### 8.2 Takeaway order

```text
Create order
  -> confirm
  -> send to kitchen
  -> prepare
  -> ready
  -> payment
  -> receipt
  -> handoff
  -> close
```

### 8.3 Delivery order

```text
Create order
  -> confirm
  -> kitchen preparation
  -> ready
  -> dispatch assignment
  -> out for delivery
  -> delivered
  -> payment completion where applicable
  -> close
```

### 8.4 Refund

```text
Find completed payment
  -> authorize refund
  -> create refund record
  -> provider refund
  -> verify result
  -> mark refunded/partially refunded
  -> audit event
  -> reporting adjustment
```

### 8.5 Inventory replenishment

```text
Low stock detected
  -> create replenishment request
  -> purchase from supplier
  -> receive goods
  -> record stock transaction
  -> update inventory balance
  -> retain purchase history
```

## 9. Offline-first direction

Offline capability is not part of the first rebuild milestone, but the architecture must allow it.

Future model:

```text
POS Client
   -> local store / queue
   -> sync engine
   -> server API
   -> PostgreSQL
```

Transactions that must survive temporary connectivity loss should be designed as replayable operations with idempotent identifiers.

## 10. Deployment architecture

### Portfolio demo

```text
GitHub repository
     -> GitHub Actions
     -> Next.js static export
     -> GitHub Pages
```

The demo may use seeded/local data and should clearly be a demonstration environment.

### Production direction

```text
Web / POS client
       |
    Next.js
       |
   Application API
       |
 PostgreSQL / Supabase
       |
 Payments / Realtime / Storage / External services
```

The existing payment route handlers remain production-side concerns and should not be coupled to the GitHub Pages demo.

## 11. Migration strategy

We will not rewrite Lucid in one pass.

### Phase 1: Architecture foundation
- establish this document
- define domain vocabulary
- define status transitions
- identify existing components that map to each domain
- document known gaps

### Phase 2: Core data and domain contracts
- define database schema
- define typed domain models
- establish repositories/data-access boundaries
- introduce stable identifiers and timestamps

### Phase 3: POS and orders
- rebuild order creation
- cart/modifier handling
- table/dining mode
- taxes/discounts
- order lifecycle

### Phase 4: Kitchen
- ticket creation
- station routing
- KDS workflow
- preparation lifecycle

### Phase 5: Inventory
- ingredient catalog
- stock movements
- recipes
- reorder levels
- wastage

### Phase 6: Payments
- typed provider interface
- Paystack/Flutterwave first for the Nigerian-focused path
- verification, refunds, failures
- payment audit trail

### Phase 7: Staff and control
- authentication
- roles
- permissions
- shifts
- cash drawer
- audit logs

### Phase 8: Reporting
- operational reporting
- financial reporting
- inventory analytics

### Phase 9: Offline and device integrations
- local persistence
- sync queue
- printer integration
- resilience testing

### Phase 10: Portfolio demo polish
- demo data
- onboarding/demo mode
- responsive polish
- screenshots
- deployment verification

## 12. What we should not change yet

Until the relevant domain has been rebuilt, do not:

- delete historical payment adapters
- replace the whole UI system
- move every component into a new folder structure at once
- introduce a new database provider without a migration plan
- make the GitHub Pages build the production runtime
- hard-code more sample data into dashboard components
- mix order and payment statuses into one field

## 13. Definition of architectural readiness

A module is ready to be considered production-oriented when:

- it has an explicit domain owner
- its state transitions are defined
- its persistent records have a source of truth
- user actions are authorized
- important operations are auditable
- failures have defined behavior
- UI components are not responsible for infrastructure concerns
- the module can be tested independently of the visual layer

## 14. Immediate next implementation target

The first code milestone after this document is **Core Order Domain + POS workflow**.

We should build the order lifecycle before polishing the dashboard because every major Lucid capability depends on the order being a reliable source of operational truth.
