"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LucidLogo } from "@/components/lucid-logo"
import { useAuth } from "@/contexts/auth-context"
import { useRestaurant } from "@/contexts/restaurant-context"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const { state: authState, signup, dispatch } = useAuth()
  const { dispatch: restaurantDispatch } = useRestaurant()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
  })

  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch({ type: "CLEAR_ERROR" })

    // Validation
    if (formData.password !== formData.confirmPassword) {
      dispatch({ type: "SIGNUP_ERROR", payload: "Passwords do not match" })
      return
    }

    if (!passwordValidation.minLength || !passwordValidation.hasNumber || !passwordValidation.hasSpecial) {
      dispatch({ type: "SIGNUP_ERROR", payload: "Password does not meet requirements" })
      return
    }

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role as "admin" | "manager" | "staff",
      })
      // Redirect to dashboard after successful signup
      restaurantDispatch({ type: "SET_VIEW", payload: "dashboard" })
    } catch (error) {
      // Error handling is done in the auth context
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "password") {
      validatePassword(value)
    }
  }

  useEffect(() => {
    if (authState.isAuthenticated) {
      restaurantDispatch({ type: "SET_VIEW", payload: "dashboard" })
    }
  }, [authState.isAuthenticated, restaurantDispatch])

  // If user is already authenticated, redirect to dashboard
  if (authState.isAuthenticated) {
    return null
  }

  const isPasswordValid = passwordValidation.minLength && passwordValidation.hasNumber && passwordValidation.hasSpecial

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
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join our restaurant management platform</CardDescription>
        </CardHeader>

        <CardContent>
          {authState.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authState.error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  required
                  disabled={authState.isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                  disabled={authState.isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@restaurant.com"
                required
                disabled={authState.isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a strong password"
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

              {/* Password Requirements */}
              {formData.password && (
                <div className="text-xs space-y-1">
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.minLength ? "text-green-600" : "text-gray-500"}`}
                  >
                    <CheckCircle className="h-3 w-3" />
                    At least 8 characters
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"}`}
                  >
                    <CheckCircle className="h-3 w-3" />
                    Contains a number
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.hasSpecial ? "text-green-600" : "text-gray-500"}`}
                  >
                    <CheckCircle className="h-3 w-3" />
                    Contains a special character
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={authState.isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={authState.isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={authState.isLoading || !isPasswordValid || !formData.role}
            >
              {authState.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
