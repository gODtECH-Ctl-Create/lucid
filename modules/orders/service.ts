import {
  calculateOrderPricing,
  type DiningMode,
  type Order,
  type OrderItem,
  transitionOrder,
} from "./domain"

export interface CreateOrderInput {
  diningMode: DiningMode
  tableId?: string
  customerId?: string
  items: OrderItem[]
  currency?: string
  notes?: string
  taxRate?: number
  discount?: number
}

export function createDraftOrder(input: CreateOrderInput, now = new Date()): Order {
  if (input.items.length === 0) {
    throw new Error("An order must contain at least one item")
  }

  const timestamp = now.toISOString()
  const orderId = `ord_${now.getTime()}`
  const orderNumber = `ORD-${String(now.getTime()).slice(-6)}`

  return {
    id: orderId,
    orderNumber,
    status: "draft",
    diningMode: input.diningMode,
    tableId: input.tableId,
    customerId: input.customerId,
    items: input.items,
    pricing: calculateOrderPricing(input.items, input.taxRate ?? 0, input.discount ?? 0),
    currency: input.currency ?? "USD",
    notes: input.notes,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function confirmOrder(order: Order): Order {
  return transitionOrder(order, "confirmed")
}

export function sendOrderToKitchen(order: Order): Order {
  return transitionOrder(order, "sent_to_kitchen")
}

export function markOrderPreparing(order: Order): Order {
  return transitionOrder(order, "preparing")
}

export function markOrderReady(order: Order): Order {
  return transitionOrder(order, "ready")
}

export function markOrderServed(order: Order): Order {
  return transitionOrder(order, "served")
}

export function closeOrder(order: Order): Order {
  return transitionOrder(order, "closed")
}
