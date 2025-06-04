"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LucidLogo } from "@/components/lucid-logo"
import { useAuth } from "@/contexts/auth-context"
import { useRestaurant } from "@/contexts/restaurant-context"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const { state: authState, login, dispatch } = useAuth()
  const { dispatch: restaurantDispatch } = useRestaurant()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (authState.isAuthenticated) {
      restaurantDispatch({ type: "SET_VIEW", payload: "dashboard" })
    }
  }, [authState.isAuthenticated, restaurantDispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch({ type: "CLEAR_ERROR" })

    try {
      await login(formData.email, formData.password)
      // Redirect to dashboard after successful login
      restaurantDispatch({ type: "SET_VIEW", payload: "dashboard" })
    } catch (error) {
      // Error handling is done in the auth context
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // If user is already authenticated, redirect to dashboard
  if (authState.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LucidLogo className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LUCID CASH POINT</h1>
              <p className="text-sm text-gray-600">Restaurant Management System</p>
            </div>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your restaurant management account</CardDescription>
        </CardHeader>

        <CardContent>
          {authState.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authState.error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
                disabled={authState.isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={authState.isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={authState.isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={authState.isLoading}>
              {authState.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Email: admin@lucid.com</p>
            <p className="text-xs text-blue-700">Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
