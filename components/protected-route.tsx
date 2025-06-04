"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRestaurant } from "@/contexts/restaurant-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { state: authState } = useAuth()
  const { dispatch } = useRestaurant()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && !authState.isAuthenticated) {
      router.push("/login")
    }
  }, [authState.isAuthenticated, requireAuth, router])

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !authState.isAuthenticated) {
    return null
  }

  return <>{children}</>
}
