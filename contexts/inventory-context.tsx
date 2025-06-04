"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  costPerUnit: number
  supplier: string
  lastRestocked: Date
  expiryDate?: Date
  description?: string
}

interface InventoryState {
  items: InventoryItem[]
}

type InventoryAction =
  | { type: "ADD_ITEM"; payload: InventoryItem }
  | { type: "UPDATE_ITEM"; payload: InventoryItem }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "UPDATE_STOCK"; payload: { id: string; quantity: number; type: "add" | "subtract" } }

const initialState: InventoryState = {
  items: [
    {
      id: "1",
      name: "Tomatoes",
      category: "Vegetables",
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unit: "kg",
      costPerUnit: 3.5,
      supplier: "Fresh Farm Co.",
      lastRestocked: new Date(Date.now() - 86400000 * 2), // 2 days ago
      expiryDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
      description: "Fresh organic tomatoes",
    },
    {
      id: "2",
      name: "Chicken Breast",
      category: "Meat",
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unit: "kg",
      costPerUnit: 12.99,
      supplier: "Premium Meats Ltd.",
      lastRestocked: new Date(Date.now() - 86400000), // 1 day ago
      expiryDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      description: "Premium quality chicken breast",
    },
    {
      id: "3",
      name: "Mozzarella Cheese",
      category: "Dairy",
      currentStock: 12,
      minStock: 5,
      maxStock: 30,
      unit: "kg",
      costPerUnit: 8.75,
      supplier: "Dairy Fresh Inc.",
      lastRestocked: new Date(Date.now() - 86400000 * 3), // 3 days ago
      expiryDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
      description: "Fresh mozzarella cheese",
    },
    {
      id: "4",
      name: "Orange Juice",
      category: "Beverages",
      currentStock: 0,
      minStock: 10,
      maxStock: 50,
      unit: "liters",
      costPerUnit: 4.25,
      supplier: "Citrus Co.",
      lastRestocked: new Date(Date.now() - 86400000 * 7), // 7 days ago
      description: "Fresh squeezed orange juice",
    },
    {
      id: "5",
      name: "Basil",
      category: "Spices",
      currentStock: 3,
      minStock: 5,
      maxStock: 20,
      unit: "kg",
      costPerUnit: 15.0,
      supplier: "Herb Garden",
      lastRestocked: new Date(Date.now() - 86400000 * 4), // 4 days ago
      expiryDate: new Date(Date.now() + 86400000 * 10), // 10 days from now
      description: "Fresh basil leaves",
    },
    {
      id: "6",
      name: "Rice",
      category: "Grains",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: "kg",
      costPerUnit: 2.5,
      supplier: "Grain Masters",
      lastRestocked: new Date(Date.now() - 86400000 * 10), // 10 days ago
      description: "Premium basmati rice",
    },
  ],
}

function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
      }

    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? action.payload : item)),
      }

    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_STOCK":
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            const newStock =
              action.payload.type === "add"
                ? item.currentStock + action.payload.quantity
                : Math.max(0, item.currentStock - action.payload.quantity)
            return {
              ...item,
              currentStock: newStock,
              lastRestocked: action.payload.type === "add" ? new Date() : item.lastRestocked,
            }
          }
          return item
        }),
      }

    default:
      return state
  }
}

const InventoryContext = createContext<{
  state: InventoryState
  dispatch: React.Dispatch<InventoryAction>
} | null>(null)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState)

  return <InventoryContext.Provider value={{ state, dispatch }}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
