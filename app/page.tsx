"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRestaurant } from "@/contexts/restaurant-context"
import { SidebarNav } from "../components/sidebar-nav"
import { CategoryFilter } from "../components/category-filter"
import { FoodGrid } from "../components/food-grid"
import { Cart } from "../components/cart"
import { Footer } from "../components/footer"
import { NavigationHeader } from "../components/navigation-header"
import { ProtectedRoute } from "../components/protected-route"
import DashboardPage from "./dashboard/page"
import HomePage from "./home/page"
import LoginPage from "./login/page"
import { useEffect } from "react"

export default function RootPage() {
  const { state: authState } = useAuth()
  const { state } = useRestaurant()

  // Handle authentication redirect with useEffect
  useEffect(() => {
    // Only redirect if we're not already on the right view
    if (!authState.isAuthenticated && state.currentView !== "home") {
      // Don't redirect, just show login
    }
  }, [authState.isAuthenticated, state.currentView])

  // If not authenticated, show login page
  if (!authState.isAuthenticated) {
    return <LoginPage />
  }

  // Show appropriate view based on currentView
  switch (state.currentView) {
    case "dashboard":
      return (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      )

    case "pos":
      return (
        <ProtectedRoute>
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
        </ProtectedRoute>
      )

    default:
      return (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      )
  }
}
