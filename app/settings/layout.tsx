import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { CreditCard, FileText, Home, Printer, Receipt, SettingsIcon, Store, Users, Utensils } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export const metadata: Metadata = {
  title: "Settings",
  description: "Restaurant POS System Settings",
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-[240px] border-r bg-muted/40 lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b py-4 px-5">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Store className="h-5 w-5" />
                <span>Restaurant POS</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 py-4">
              <nav className="grid gap-2 px-2">
                <Link href="/settings" passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-start gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Home className="h-4 w-4" />
                    General
                  </Button>
                </Link>
                <Link href="/settings/restaurant" passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-start gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Store className="h-4 w-4" />
                    Restaurant Info
                  </Button>
                </Link>
                <Link href="/settings/menu" passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-start gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Utensils className="h-4 w-4" />
                    Menu Management
                  </Button>
                </Link>
                <Link href="/settings/payments" passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-start gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <CreditCard className="h-4 w-4" />
                    Payment Settings
                  </Button>
                </Link>
                <Link href="/settings/users" passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-start gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Users className="h-4 w-4" />
                    User Management
                  </Button>
                </Link>
                <Link href="/settings/printers" passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-start gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Printer className="h-4 w-4" />
                    Printer Settings
                  </Button>
                </Link>
                <Link href="/settings/taxes" passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-start gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Receipt className="h-4 w-4" />
                    Tax & Currency
                  </Button>
                </Link>
                <Link href="/settings/receipts" passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-start gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    Receipt Templates
                  </Button>
                </Link>
                <Link href="/settings/system" passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-start gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <SettingsIcon className="h-4 w-4" />
                    System Settings
                  </Button>
                </Link>
              </nav>
            </ScrollArea>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
