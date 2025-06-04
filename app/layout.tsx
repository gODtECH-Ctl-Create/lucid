import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { RestaurantProvider } from "@/contexts/restaurant-context"
import { InventoryProvider } from "@/contexts/inventory-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LUCID CASH POINT",
  description: "Restaurant POS and Management System",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RestaurantProvider>
            <InventoryProvider>{children}</InventoryProvider>
          </RestaurantProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
