export const ORDER_STATUSES = [
  "draft",
  "confirmed",
  "sent_to_kitchen",
  "preparing",
  "ready",
  "served",
  "closed",
  "cancelled",
  "voided",
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const DINE_MODES = ["dine_in", "takeaway", "delivery"] as const

export type DiningMode = (typeof DINE_MODES)[number]

export interface OrderItemModifier {
  id: string
  name: string
  priceDelta: number
}

export interface OrderItem {
  id: string
  menuItemId: string
  name: string
  unitPrice: number
  quantity: number
  notes?: string
  modifiers: OrderItemModifier[]
}

export interface OrderPricing {
  subtotal: number
  discount: number
  tax: number
  total: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  diningMode: DiningMode
  tableId?: string
  customerId?: string
  items: OrderItem[]
  pricing: OrderPricing
  currency: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export const TERMINAL_ORDER_STATUSES: readonly OrderStatus[] = ["closed", "cancelled", "voided"]

export function isTerminalOrderStatus(status: OrderStatus): boolean {
  return TERMINAL_ORDER_STATUSES.includes(status)
}

export function calculateOrderPricing(
  items: Pick<OrderItem, "unitPrice" | "quantity" | "modifiers">[],
  taxRate = 0,
  discount = 0,
): OrderPricing {
  const subtotal = items.reduce((sum, item) => {
    const modifierTotal = item.modifiers.reduce((modifierSum, modifier) => modifierSum + modifier.priceDelta, 0)
    return sum + (item.unitPrice + modifierTotal) * item.quantity
  }, 0)

  const normalizedDiscount = Math.max(0, Math.min(discount, subtotal))
  const taxableAmount = Math.max(0, subtotal - normalizedDiscount)
  const tax = taxableAmount * Math.max(0, taxRate)
  const total = taxableAmount + tax

  return {
    subtotal: roundMoney(subtotal),
    discount: roundMoney(normalizedDiscount),
    tax: roundMoney(tax),
    total: roundMoney(total),
  }
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true
  if (isTerminalOrderStatus(from)) return false

  const transitions: Record<OrderStatus, readonly OrderStatus[]> = {
    draft: ["confirmed", "cancelled"],
    confirmed: ["sent_to_kitchen", "cancelled", "voided"],
    sent_to_kitchen: ["preparing", "cancelled", "voided"],
    preparing: ["ready", "cancelled", "voided"],
    ready: ["served", "cancelled", "voided"],
    served: ["closed", "cancelled", "voided"],
    closed: [],
    cancelled: [],
    voided: [],
  }

  return transitions[from].includes(to)
}

export function transitionOrder(order: Order, nextStatus: OrderStatus): Order {
  if (!canTransitionOrder(order.status, nextStatus)) {
    throw new Error(`Invalid order transition: ${order.status} -> ${nextStatus}`)
  }

  return {
    ...order,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  }
}
