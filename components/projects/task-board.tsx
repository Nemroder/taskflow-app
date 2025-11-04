"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { TaskDialog } from "./task-dialog"
import { useToast } from "@/hooks/use-toast"

type Task = {
  id: string
  title: string
  description: string | null
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  tags: string[]
  position: number
  project_id: string
  assignee_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

type TaskBoardProps = {
  projectId: string
  initialTasks: Task[]
  userId: string
}

const columns = [
  { id: "todo", title: "To Do", color: "#6366f1" },
  { id: "in-progress", title: "In Progress", color: "#f59e0b" },
  { id: "done", title: "Done", color: "#10b981" },
]

const priorityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  high: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function TaskBoard({ projectId, initialTasks, userId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<"todo" | "in-progress" | "done">("todo")
  const { toast } = useToast()

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status).sort((a, b) => a.position - b.position)
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const task = tasks.find((t) => t.id === draggableId)
    if (!task) return

    const newStatus = destination.droppableId as "todo" | "in-progress" | "done"
    const destinationTasks = getTasksByStatus(newStatus)

    let newPosition: number
    if (destinationTasks.length === 0) {
      newPosition = 0
    } else if (destination.index === 0) {
      newPosition = destinationTasks[0].position - 1
    } else if (destination.index >= destinationTasks.length) {
      newPosition = destinationTasks[destinationTasks.length - 1].position + 1
    } else {
      const prevTask = destinationTasks[destination.index - 1]
      const nextTask = destinationTasks[destination.index]
      newPosition = (prevTask.position + nextTask.position) / 2
    }

    const updatedTasks = tasks.map((t) =>
      t.id === draggableId ? { ...t, status: newStatus, position: newPosition } : t,
    )
    setTasks(updatedTasks)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, position: newPosition })
        .eq("id", draggableId)

      if (error) throw error
    } catch (error) {
      setTasks(tasks)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleCreateTask = (status: "todo" | "in-progress" | "done") => {
    setSelectedTask(null)
    setSelectedStatus(status)
    setIsDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleTaskSaved = (task: Task) => {
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    } else {
      setTasks([...tasks, task])
    }
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col gap-3 lg:gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
                  <h3 className="font-semibold text-sm lg:text-base">{column.title}</h3>
                  <Badge variant="secondary" className="rounded-full text-xs">
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCreateTask(column.id as "todo" | "in-progress" | "done")}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col gap-3 min-h-[200px] p-2 lg:p-3 rounded-xl transition-colors ${
                      snapshot.isDraggingOver ? "bg-accent/50" : "bg-muted/20"
                    }`}
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-pointer hover:border-primary transition-all ${
                              snapshot.isDragging ? "shadow-lg rotate-2" : ""
                            }`}
                            onClick={() => handleEditTask(task)}
                          >
                            <CardHeader className="p-3 lg:p-4 pb-2 lg:pb-3">
                              <CardTitle className="text-sm font-medium leading-relaxed">{task.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 lg:p-4 pt-0 space-y-2 lg:space-y-3">
                              {task.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                                  {task.priority}
                                </Badge>
                                {task.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {task.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{task.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        projectId={projectId}
        userId={userId}
        defaultStatus={selectedStatus}
        onTaskSaved={handleTaskSaved}
        onTaskDeleted={handleTaskDeleted}
      />
    </>
  )
}
