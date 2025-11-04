import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CheckCircle2, FolderKanban, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: projects } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  const { data: tasks } = await supabase.from("tasks").select("*")

  const totalProjects = projects?.length || 0
  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((t) => t.status === "done").length || 0
  const activeTasks = tasks?.filter((t) => t.status !== "done").length || 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>Create Project</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            <FolderKanban className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
            <ListTodo className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks done</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: project.color + "20" }}
                        >
                          <FolderKanban className="w-5 h-5" style={{ color: project.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {project.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderKanban className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first project to get started</p>
              <Link href="/dashboard/projects/new">
                <Button>Create Project</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
