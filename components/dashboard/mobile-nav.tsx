"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderKanban, Settings, LogOut, Menu } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      })
      router.push("/auth/login")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">TaskFlow</span>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4">
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
