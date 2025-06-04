"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "manager" | "staff"
  restaurantId: string
  createdAt: Date
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SIGNUP_START" }
  | { type: "SIGNUP_SUCCESS"; payload: User }
  | { type: "SIGNUP_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
    case "SIGNUP_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case "LOGIN_SUCCESS":
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

    case "LOGIN_ERROR":
    case "SIGNUP_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<void>
  signup: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: "admin" | "manager" | "staff"
  }) => Promise<void>
  logout: () => void
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - in real app, this would be an API call
      if (email === "admin@lucid.com" && password === "admin123") {
        const user: User = {
          id: "1",
          email: email,
          firstName: "Admin",
          lastName: "User",
          role: "admin",
          restaurantId: "restaurant_1",
          createdAt: new Date(),
        }
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      } else {
        throw new Error("Invalid email or password")
      }
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: error instanceof Error ? error.message : "Login failed" })
      throw error // Re-throw to handle in component
    }
  }

  const signup = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: "admin" | "manager" | "staff"
  }) => {
    dispatch({ type: "SIGNUP_START" })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user creation - in real app, this would be an API call
      const user: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        restaurantId: "restaurant_1",
        createdAt: new Date(),
      }

      dispatch({ type: "SIGNUP_SUCCESS", payload: user })
    } catch (error) {
      dispatch({ type: "SIGNUP_ERROR", payload: error instanceof Error ? error.message : "Signup failed" })
      throw error // Re-throw to handle in component
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  return <AuthContext.Provider value={{ state, dispatch, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
