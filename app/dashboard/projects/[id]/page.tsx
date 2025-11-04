import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { TaskBoard } from "@/components/projects/task-board"
import { ProjectChat } from "@/components/projects/project-chat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: project, error } = await supabase.from("projects").select("*").eq("id", params.id).single()

  if (error || !project) {
    notFound()
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", params.id)
    .order("position", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: project.color + "20" }}
            >
              <div className="w-5 h-5 rounded" style={{ backgroundColor: project.color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          </div>
        </div>
        <Link href={`/dashboard/projects/${params.id}/settings`}>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="board" className="w-full">
        <TabsList>
          <TabsTrigger value="board">Task Board</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="mt-6">
          <TaskBoard projectId={params.id} initialTasks={tasks || []} userId={user.id} />
        </TabsContent>
        <TabsContent value="chat" className="mt-6">
          <ProjectChat projectId={params.id} userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
