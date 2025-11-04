import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderKanban, Plus } from "lucide-react"
import Link from "next/link"

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("*, tasks(count)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage all your projects</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: project.color + "20" }}
                    >
                      <FolderKanban className="w-6 h-6" style={{ color: project.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {project.description || "No description"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{project.tasks?.[0]?.count || 0} tasks</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderKanban className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              Create your first project to start organizing your tasks and collaborating with your team
            </p>
            <Link href="/dashboard/projects/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
