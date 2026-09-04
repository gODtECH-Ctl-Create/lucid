"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Order, OrderStatus, OrderItem } from "@/modules/orders/domain"
import { calculateOrderPricing, transitionOrder } from "@/modules/orders/domain"
import { createDraftOrder } from "@/modules/orders/service"

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  totalOrders: number
  totalSpent: number
  lastVisit: string
}

export interface RestaurantState {
  orders: Order[]
  customers: Customer[]
  currentView: "dashboard" | "pos"
  dailyMetrics: {
    totalSales: number
    numberOfOrders: number
    averageOrderValue: number
  }
}

export type RestaurantAction =
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: OrderStatus } }
  | { type: "ADD_CUSTOMER"; payload: Customer }
  | { type: "SET_VIEW"; payload: "dashboard" | "pos" }
  | { type: "UPDATE_METRICS" }

const sampleItems: OrderItem[] = [
  {
    id: "item_1",
    menuItemId: "menu_burger",
    name: "Original Cheeseburger With Chips",
    unitPrice: 23.99,
    quantity: 1,
    image: "/placeholder.svg",
    type: "Non Veg",
    modifiers: [],
  },
  {
    id: "item_2",
    menuItemId: "menu_juice",
    name: "Fresh Orange Juice With Basil Seed",
    unitPrice: 12.99,
    quantity: 1,
    image: "/placeholder.svg",
    type: "Veg",
    modifiers: [],
  },
]

const initialOrder = createDraftOrder(
  {
    diningMode: "dine_in",
    tableId: "4",
    items: sampleItems,
    taxRate: 0.05,
    currency: "USD",
  },
  new Date("2026-09-04T08:00:00.000Z"),
)

const initialOrders: Order[] = [
  transitionOrder(initialOrder, "confirmed"),
]

const initialState: RestaurantState = {
  orders: initialOrders,
  customers: [
    {
      id: "customer_1",
      name: "Floyd Miles",
      email: "floyd@example.com",
      phone: "+1234567890",
      totalOrders: 15,
      totalSpent: 450.75,
      lastVisit: new Date().toISOString(),
    },
    {
      id: "customer_2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1234567891",
      totalOrders: 8,
      totalSpent: 280.5,
      lastVisit: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  currentView: "dashboard",
  dailyMetrics: calculateMetrics(initialOrders),
}

function calculateMetrics(orders: Order[]): RestaurantState["dailyMetrics"] {
  const today = new Date().toDateString()
  const todayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === today)
  const totalSales = todayOrders.reduce((sum, order) => sum + order.pricing.total, 0)
  const numberOfOrders = todayOrders.length

  return {
    totalSales,
    numberOfOrders,
    averageOrderValue: numberOfOrders > 0 ? totalSales / numberOfOrders : 0,
  }
}

function restaurantReducer(state: RestaurantState, action: RestaurantAction): RestaurantState {
  switch (action.type) {
    case "ADD_ORDER": {
      const orders = [...state.orders, action.payload]
      return {
        ...state,
        orders,
        dailyMetrics: calculateMetrics(orders),
      }
    }

    case "UPDATE_ORDER_STATUS": {
      const orders = state.orders.map((order) =>
        order.id === action.payload.orderId ? transitionOrder(order, action.payload.status) : order,
      )
      return {
        ...state,
        orders,
        dailyMetrics: calculateMetrics(orders),
      }
    }

    case "ADD_CUSTOMER":
      return {
        ...state,
        customers: [...state.customers, action.payload],
      }

    case "SET_VIEW":
      return {
        ...state,
        currentView: action.payload,
      }

    case "UPDATE_METRICS":
      return {
        ...state,
        dailyMetrics: calculateMetrics(state.orders),
      }

    default:
      return state
  }
}

const RestaurantContext = createContext<{
  state: RestaurantState
  dispatch: React.Dispatch<RestaurantAction>
} | null>(null)

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(restaurantReducer, initialState)

  return <RestaurantContext.Provider value={{ state, dispatch }}>{children}</RestaurantContext.Provider>
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider")
  }
  return context
}

export function recalculateOrderPricing(order: Order, taxRate = 0.05, discount = 0): Order {
  return {
    ...order,
    pricing: calculateOrderPricing(order.items, taxRate, discount),
    updatedAt: new Date().toISOString(),
  }
}
