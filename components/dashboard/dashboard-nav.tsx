"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import type { User } from "@supabase/supabase-js"

export function DashboardNav({ user }: { user: User }) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-4">
          <MobileNav />
          <h2 className="text-base lg:text-lg font-semibold">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
