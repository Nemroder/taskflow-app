import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNav user={user} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
