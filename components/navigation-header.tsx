"use client"

import { Search, ArrowLeft, Home, LogOut, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRestaurant } from "@/contexts/restaurant-context"
import { useAuth } from "@/contexts/auth-context"

interface NavigationHeaderProps {
  title: string
  showBackButton?: boolean
}

export function NavigationHeader({ title, showBackButton = false }: NavigationHeaderProps) {
  const { state, dispatch } = useRestaurant()
  const { state: authState, logout } = useAuth()

  const handleBackToDashboard = () => {
    dispatch({ type: "SET_VIEW", payload: "dashboard" })
  }

  const handleGoToPOS = () => {
    dispatch({ type: "SET_VIEW", payload: "pos" })
  }

  const handleGoHome = () => {
    dispatch({ type: "SET_VIEW", payload: "home" })
  }

  const handleLogout = () => {
    logout()
    dispatch({ type: "SET_VIEW", payload: "home" })
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f5f5f0] px-10 py-3">
      <div className="flex items-center gap-4 text-[#181811]">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em]">{title}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleGoHome}>
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          {state.currentView === "dashboard" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToPOS}
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              Go to POS
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-[#8c8b5f] flex border-none bg-[#f5f5f0] items-center justify-center pl-4 rounded-l-xl border-r-0">
              <Search size={24} />
            </div>
            <Input
              placeholder="Search"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181811] focus:outline-0 focus:ring-0 border-none bg-[#f5f5f0] focus:border-none h-full placeholder:text-[#8c8b5f] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            />
          </div>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-green-700" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium">
                  {authState.user?.firstName} {authState.user?.lastName}
                </div>
                <div className="text-xs text-gray-500 capitalize">{authState.user?.role}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
