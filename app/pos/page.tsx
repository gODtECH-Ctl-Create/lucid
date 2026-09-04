"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, ShoppingCart, Utensils } from "lucide-react"

import { NavigationHeader } from "@/components/navigation-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRestaurant } from "@/contexts/restaurant-context"
import type { DiningMode, OrderItem } from "@/modules/orders/domain"
import { createDraftOrder, confirmOrder } from "@/modules/orders/service"

const TAX_RATE = 0.05

const MENU_ITEMS = [
  { id: "menu_burger", name: "Original Cheeseburger With Chips", price: 23.99, category: "Mains" },
  { id: "menu_juice", name: "Fresh Orange Juice With Basil Seed", price: 12.99, category: "Drinks" },
  { id: "menu_tacos", name: "Tacos Salsa With Chicken Grilled", price: 14.99, category: "Mains" },
  { id: "menu_salad", name: "Tasty Vegetable Salad Healthy Diet", price: 17.99, category: "Starters" },
  { id: "menu_sushi", name: "Meat Sushi Maki With Tuna", price: 9.99, category: "Starters" },
  { id: "menu_fries", name: "Original Cheeseburger With French Fries", price: 10.59, category: "Sides" },
] as const

const DINING_MODES: { value: DiningMode; label: string }[] = [
  { value: "dine_in", label: "Dine in" },
  { value: "takeaway", label: "Take away" },
  { value: "delivery", label: "Delivery" },
]

function createCartItem(item: (typeof MENU_ITEMS)[number]): OrderItem {
  return {
    id: `${item.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    menuItemId: item.id,
    name: item.name,
    unitPrice: item.price,
    quantity: 1,
    modifiers: [],
  }
}

export default function POSPage() {
  const router = useRouter()
  const { dispatch } = useRestaurant()
  const [cart, setCart] = useState<OrderItem[]>([])
  const [diningMode, setDiningMode] = useState<DiningMode>("dine_in")
  const [tableId, setTableId] = useState("4")
  const [category, setCategory] = useState("All")

  const categories = ["All", ...new Set(MENU_ITEMS.map((item) => item.category))]
  const visibleItems = category === "All" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === category)

  const pricing = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const tax = subtotal * TAX_RATE
    return { subtotal, tax, total: subtotal + tax }
  }, [cart])

  const addToCart = (menuItem: (typeof MENU_ITEMS)[number]) => {
    setCart((current) => {
      const existing = current.find((item) => item.menuItemId === menuItem.id)
      if (existing) {
        return current.map((item) =>
          item.menuItemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...current, createCartItem(menuItem)]
    })
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const placeOrder = () => {
    if (cart.length === 0) return

    const draft = createDraftOrder({
      diningMode,
      tableId: diningMode === "dine_in" ? tableId : undefined,
      items: cart,
      taxRate: TAX_RATE,
      currency: "USD",
    })

    const confirmed = confirmOrder(draft)
    dispatch({ type: "ADD_ORDER", payload: confirmed })
    setCart([])
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader title="Point of Sale" showBackButton />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:flex-row">
        <section className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Order entry</p>
              <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((itemCategory) => (
              <Button
                key={itemCategory}
                size="sm"
                variant={category === itemCategory ? "default" : "outline"}
                onClick={() => setCategory(itemCategory)}
                className="whitespace-nowrap"
              >
                {itemCategory}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                    </div>
                    <Badge variant="secondary">${item.price.toFixed(2)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => addToCart(item)} className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add to order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <aside className="w-full lg:max-w-md">
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Current Order
                  </CardTitle>
                  <p className="text-sm text-gray-500">Build the order before confirming it.</p>
                </div>
                <Badge>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex gap-2">
                {DINING_MODES.map((mode) => (
                  <Button
                    key={mode.value}
                    size="sm"
                    variant={diningMode === mode.value ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setDiningMode(mode.value)}
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>

              {diningMode === "dine_in" && (
                <label className="block text-sm font-medium text-gray-700">
                  Table
                  <select
                    value={tableId}
                    onChange={(event) => setTableId(event.target.value)}
                    className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {["1", "2", "3", "4", "5", "6", "7", "8"].map((table) => (
                      <option key={table} value={table}>Table {table}</option>
                    ))}
                  </select>
                </label>
              )}

              <Separator />

              <div className="max-h-72 space-y-3 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <Utensils className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">Your order is empty</p>
                    <p className="mt-1 text-xs text-gray-500">Select menu items to start.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${pricing.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Tax 5%</span><span>${pricing.tax.toFixed(2)}</span></div>
                <div className="flex justify-between pt-2 text-base font-bold"><span>Total</span><span>${pricing.total.toFixed(2)}</span></div>
              </div>

              <Button
                onClick={placeOrder}
                disabled={cart.length === 0}
                className="h-12 w-full bg-green-600 text-white hover:bg-green-700"
              >
                Confirm Order • ${pricing.total.toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  )
}
