"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { ActionButton } from "@/components/action-button"
import { MetricCard } from "@/components/metric-card"
import { useRestaurant } from "@/contexts/restaurant-context"
import { useRouter } from "next/navigation"

const diningModeLabels = {
  dine_in: "Dine in",
  takeaway: "Take away",
  delivery: "Delivery",
} as const

export default function DashboardPage() {
  const { state, dispatch } = useRestaurant()
  const router = useRouter()

  const handleNewOrder = () => {
    dispatch({ type: "SET_VIEW", payload: "pos" })
    router.push("/pos")
  }

  const handleOrderManagement = () => {
    router.push("/orders")
  }

  const handleCustomerProfiles = () => {
    router.push("/customers")
  }

  const handleInventory = () => {
    router.push("/inventory")
  }

  const handleReports = () => {
    router.push("/reports")
  }

  const { totalSales, numberOfOrders, averageOrderValue } = state.dailyMetrics

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <NavigationHeader title="Lucid Cash Point" />

        <div className="mx-auto flex w-full max-w-6xl flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-5xl flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Restaurant operations</p>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Monitor orders, sales, and daily activity.</p>
              </div>
              <Button onClick={handleNewOrder} className="bg-green-600 hover:bg-green-700">
                New Order
              </Button>
            </div>

            <div className="px-0">
              <div className="flex h-12 w-full items-stretch rounded-xl bg-[#f5f5f0]">
                <div className="flex items-center justify-center pl-4 text-[#8c8b5f]">
                  <Search size={22} />
                </div>
                <Input
                  placeholder="Search dashboard"
                  className="h-full border-none bg-transparent px-3 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MetricCard title="Total Sales" value={`$${totalSales.toFixed(2)}`} />
              <MetricCard title="Number of Orders" value={numberOfOrders.toString()} />
              <MetricCard title="Average Order Value" value={`$${averageOrderValue.toFixed(2)}`} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <ActionButton onClick={handleNewOrder}>New Order</ActionButton>
              <ActionButton onClick={handleOrderManagement}>Order Management</ActionButton>
              <ActionButton onClick={handleCustomerProfiles}>Customer Profiles</ActionButton>
              <ActionButton onClick={handleInventory}>Inventory</ActionButton>
              <ActionButton onClick={handleReports}>Reports</ActionButton>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#181811]">Recent Orders</h2>
                <p className="text-sm text-gray-500">Latest activity from this session.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleOrderManagement}>
                View all
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {state.orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#e6e6db] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <span className="font-bold text-green-700">{order.tableId ? `T${order.tableId}` : "TA"}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#181811]">{order.orderNumber}</p>
                      <p className="text-sm text-[#8c8b5f]">
                        {order.items.length} items • {diningModeLabels[order.diningMode]}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-[#181811]">${order.pricing.total.toFixed(2)}</p>
                    <p className="text-sm capitalize text-gray-600">{order.status.replaceAll("_", " ")}</p>
                  </div>
                </div>
              ))}
              {state.orders.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                  No orders yet. Create your first order from the POS.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
