"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Trash2, X } from "lucide-react"

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

type TaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  projectId: string
  userId: string
  defaultStatus: "todo" | "in-progress" | "done"
  onTaskSaved: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  projectId,
  userId,
  defaultStatus,
  onTaskSaved,
  onTaskDeleted,
}: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"todo" | "in-progress" | "done">(defaultStatus)
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setPriority(task.priority)
      setTags(task.tags)
    } else {
      setTitle("")
      setDescription("")
      setStatus(defaultStatus)
      setPriority("medium")
      setTags([])
    }
  }, [task, defaultStatus])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      if (task) {
        // Update existing task
        const { data, error } = await supabase
          .from("tasks")
          .update({
            title,
            description,
            status,
            priority,
            tags,
          })
          .eq("id", task.id)
          .select()
          .single()

        if (error) throw error
        onTaskSaved(data)
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        })
      } else {
        // Create new task
        const tasksInStatus = await supabase
          .from("tasks")
          .select("position")
          .eq("project_id", projectId)
          .eq("status", status)
          .order("position", { ascending: false })
          .limit(1)

        const newPosition = tasksInStatus.data?.[0]?.position ? tasksInStatus.data[0].position + 1 : 0

        const { data, error } = await supabase
          .from("tasks")
          .insert({
            title,
            description,
            status,
            priority,
            tags,
            project_id: projectId,
            created_by: userId,
            position: newPosition,
          })
          .select()
          .single()

        if (error) throw error
        onTaskSaved(data)
        toast({
          title: "Task created",
          description: "Your task has been created successfully.",
        })
      }

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save task",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!task) return
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("tasks").delete().eq("id", task.id)

      if (error) throw error

      onTaskDeleted(task.id)
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>{task ? "Update your task details" : "Add a new task to your project"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {task && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="mr-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
