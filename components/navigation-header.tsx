"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface NavigationHeaderProps {
  title: string
  showBackButton?: boolean
}

export function NavigationHeader({ title, showBackButton }: NavigationHeaderProps) {
  const router = useRouter()

  return (
    <div className="border-b bg-white py-2 px-4 flex items-center justify-between">
      {showBackButton && (
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <h1 className="text-lg font-semibold">{title}</h1>
      <div></div> {/* Placeholder for alignment */}
    </div>
  )
}
