"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, History, User, Shirt } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Virtual Try-On</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/try-on">
              <Button
                variant={pathname === "/try-on" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Try on yourself
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Shirt className="h-4 w-4" />
                Show on model
              </Button>
            </Link>
            <Link href="/history">
              <Button
                variant={pathname === "/history" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <History className="h-4 w-4" />
                History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
