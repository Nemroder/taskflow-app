"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const colors = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
  "#06b6d4", // cyan
]

export default function NewProjectPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name,
          description,
          color: selectedColor,
          owner_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      })

      router.push(`/dashboard/projects/${data.id}`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-2">Set up a new project to organize your tasks</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Enter the basic information for your project</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="My Awesome Project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this project about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Project Color</Label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-10 h-10 rounded-lg transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color,
                      border: selectedColor === color ? "3px solid white" : "none",
                      boxShadow: selectedColor === color ? "0 0 0 2px " + color : "none",
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
              <Link href="/dashboard/projects">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
