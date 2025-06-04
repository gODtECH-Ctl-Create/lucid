"use client"

import { useRestaurant } from "@/contexts/restaurant-context"
import { SidebarNav } from "../components/sidebar-nav"
import { CategoryFilter } from "../components/category-filter"
import { FoodGrid } from "../components/food-grid"
import { Cart } from "../components/cart"
import { Footer } from "../components/footer"
import { NavigationHeader } from "../components/navigation-header"
import DashboardPage from "./dashboard/page"
import HomePage from "./home/page"

export default function RootPage() {
  const { state } = useRestaurant()

  // Show home page by default, then dashboard or POS based on currentView
  if (state.currentView === "dashboard") {
    return <DashboardPage />
  }

  if (state.currentView === "pos") {
    return (
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <NavigationHeader title="LUCID CASH POINT" showBackButton />
          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-auto p-4">
              <CategoryFilter />
              <FoodGrid />
            </main>
            <Cart />
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  // Default to home page
  return <HomePage />
}
