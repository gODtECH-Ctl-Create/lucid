"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface ActionButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ActionButton({ children, onClick, className = "" }: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#f8f406] text-[#181811] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#f8f406]/90 ${className}`}
    >
      <span className="truncate">{children}</span>
    </Button>
  )
}
