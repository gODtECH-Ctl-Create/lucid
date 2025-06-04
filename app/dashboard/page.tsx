"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NavigationHeader } from "@/components/navigation-header"
import { ActionButton } from "@/components/action-button"
import { MetricCard } from "@/components/metric-card"
import { useRestaurant } from "@/contexts/restaurant-context"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { state, dispatch } = useRestaurant()
  const router = useRouter()

  const handleNewOrder = () => {
    dispatch({ type: "SET_VIEW", payload: "pos" })
  }

  const handleOrderManagement = () => {
    // Navigate to order management view
    console.log("Navigate to order management")
  }

  const handleCustomerProfiles = () => {
    // Navigate to customer profiles view
    console.log("Navigate to customer profiles")
  }

  const handleInventory = () => {
    router.push("/inventory")
  }

  const handleReports = () => {
    // Navigate to reports view
    console.log("Navigate to reports")
  }

  const { totalSales, numberOfOrders, averageOrderValue } = state.dailyMetrics

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Spline Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <NavigationHeader title="DineIn Dashboard" />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="px-4 py-3">
              <div className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-[#8c8b5f] flex border-none bg-[#f5f5f0] items-center justify-center pl-4 rounded-l-xl border-r-0">
                    <Search size={24} />
                  </div>
                  <Input
                    placeholder="Search for items"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181811] focus:outline-0 focus:ring-0 border-none bg-[#f5f5f0] focus:border-none h-full placeholder:text-[#8c8b5f] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
                <ActionButton onClick={handleNewOrder}>New Order</ActionButton>
                <ActionButton onClick={handleOrderManagement}>Order Management</ActionButton>
              </div>
            </div>

            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
                <ActionButton onClick={handleCustomerProfiles}>Customer Profiles</ActionButton>
                <ActionButton onClick={handleInventory}>Inventory</ActionButton>
              </div>
            </div>

            <div className="flex px-4 py-3">
              <ActionButton className="flex-1" onClick={handleReports}>
                Reports
              </ActionButton>
            </div>

            <h2 className="text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              {"Today's Activity"}
            </h2>

            <div className="flex flex-wrap gap-4 p-4">
              <MetricCard title="Total Sales" value={`$${totalSales.toFixed(2)}`} />
              <MetricCard title="Number of Orders" value={numberOfOrders.toString()} />
              <MetricCard title="Average Order Value" value={`$${averageOrderValue.toFixed(2)}`} />
            </div>

            <h2 className="text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Recent Orders
            </h2>

            <div className="flex flex-col gap-3 p-4">
              {state.orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-[#e6e6db] rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold">T{order.tableNumber}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#181811]">{order.customerName}</p>
                      <p className="text-sm text-[#8c8b5f]">
                        {order.items.length} items • {order.diningMode}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#181811]">${order.total.toFixed(2)}</p>
                    <p
                      className={`text-sm capitalize ${
                        order.status === "completed"
                          ? "text-green-600"
                          : order.status === "preparing"
                            ? "text-orange-600"
                            : "text-gray-600"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
