import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { RestaurantProvider } from "@/contexts/restaurant-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lucid Cash Point | Restaurant Point of Sale",
  description: "Lucid Cash Point is a restaurant Point of Sale (POS) and management system prototype.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RestaurantProvider>{children}</RestaurantProvider>
      </body>
    </html>
  )
}
