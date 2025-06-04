"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
  type: "Veg" | "Non Veg"
}

interface Order {
  id: string
  tableNumber: string
  customerName: string
  items: OrderItem[]
  status: "pending" | "preparing" | "ready" | "completed"
  total: number
  createdAt: Date
  diningMode: "Dine in" | "Take Away" | "Delivery"
}

interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  totalOrders: number
  totalSpent: number
  lastVisit: Date
}

interface RestaurantState {
  orders: Order[]
  customers: Customer[]
  currentView: "home" | "dashboard" | "pos"
  dailyMetrics: {
    totalSales: number
    numberOfOrders: number
    averageOrderValue: number
  }
}

type RestaurantAction =
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: Order["status"] } }
  | { type: "ADD_CUSTOMER"; payload: Customer }
  | { type: "SET_VIEW"; payload: "home" | "dashboard" | "pos" }
  | { type: "UPDATE_METRICS" }

const initialState: RestaurantState = {
  orders: [
    {
      id: "1",
      tableNumber: "4",
      customerName: "Floyd Miles",
      items: [
        {
          id: "1",
          title: "Original Chess Meat Burger With Chips",
          price: 23.99,
          quantity: 1,
          image: "/placeholder.svg",
          type: "Non Veg",
        },
        {
          id: "2",
          title: "Fresh Orange Juice With Basil Seed",
          price: 12.99,
          quantity: 1,
          image: "/placeholder.svg",
          type: "Veg",
        },
        {
          id: "3",
          title: "Meat Sushi Maki With Tuna",
          price: 9.99,
          quantity: 1,
          image: "/placeholder.svg",
          type: "Non Veg",
        },
        {
          id: "4",
          title: "Tacos Salsa With Chickens Grilled",
          price: 14.99,
          quantity: 1,
          image: "/placeholder.svg",
          type: "Non Veg",
        },
      ],
      status: "preparing",
      total: 61.96,
      createdAt: new Date(),
      diningMode: "Dine in",
    },
    {
      id: "2",
      tableNumber: "2",
      customerName: "Sarah Johnson",
      items: [
        {
          id: "5",
          title: "Tasty Vegetable Salad Healthy Diet",
          price: 17.99,
          quantity: 2,
          image: "/placeholder.svg",
          type: "Veg",
        },
      ],
      status: "completed",
      total: 35.98,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      diningMode: "Take Away",
    },
  ],
  customers: [
    {
      id: "1",
      name: "Floyd Miles",
      email: "floyd@example.com",
      phone: "+1234567890",
      totalOrders: 15,
      totalSpent: 450.75,
      lastVisit: new Date(),
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1234567891",
      totalOrders: 8,
      totalSpent: 280.5,
      lastVisit: new Date(Date.now() - 3600000),
    },
  ],
  currentView: "home",
  dailyMetrics: {
    totalSales: 2450,
    numberOfOrders: 120,
    averageOrderValue: 20.42,
  },
}

function restaurantReducer(state: RestaurantState, action: RestaurantAction): RestaurantState {
  switch (action.type) {
    case "ADD_ORDER":
      const newState = {
        ...state,
        orders: [...state.orders, action.payload],
      }
      return {
        ...newState,
        dailyMetrics: calculateMetrics(newState.orders),
      }

    case "UPDATE_ORDER_STATUS":
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order,
      )
      return {
        ...state,
        orders: updatedOrders,
        dailyMetrics: calculateMetrics(updatedOrders),
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

function calculateMetrics(orders: Order[]) {
  const todayOrders = orders.filter((order) => {
    const today = new Date()
    const orderDate = new Date(order.createdAt)
    return orderDate.toDateString() === today.toDateString()
  })

  const totalSales = todayOrders.reduce((sum, order) => sum + order.total, 0)
  const numberOfOrders = todayOrders.length
  const averageOrderValue = numberOfOrders > 0 ? totalSales / numberOfOrders : 0

  return {
    totalSales,
    numberOfOrders,
    averageOrderValue,
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
