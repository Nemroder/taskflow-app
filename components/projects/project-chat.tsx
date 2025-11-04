"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

type Comment = {
  id: string
  content: string
  project_id: string
  user_id: string
  created_at: string
  profiles?: {
    full_name: string | null
    email: string
  }
}

type ProjectChatProps = {
  projectId: string
  userId: string
}

export function ProjectChat({ projectId, userId }: ProjectChatProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<{ full_name: string | null; email: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createClient()

    const loadComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: true })

      if (data) {
        setComments(data)
        setTimeout(() => scrollToBottom(), 100)
      }
    }

    const loadUserProfile = async () => {
      const { data } = await supabase.from("profiles").select("full_name, email").eq("id", userId).single()

      if (data) {
        setUserProfile(data)
      }
    }

    loadComments()
    loadUserProfile()

    const channel = supabase
      .channel(`comments:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("comments")
            .select(`
              *,
              profiles:user_id (
                full_name,
                email
              )
            `)
            .eq("id", payload.new.id)
            .single()

          if (data) {
            setComments((prev) => [...prev, data])
            setTimeout(() => scrollToBottom(), 100)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, userId])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("comments").insert({
        content: newComment,
        project_id: projectId,
        user_id: userId,
      })

      if (error) throw error

      setNewComment("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
          <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5" />
          Project Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4 lg:px-6" ref={scrollRef}>
          <div className="space-y-3 lg:space-y-4 py-4">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="w-10 h-10 lg:w-12 lg:h-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              comments.map((comment) => {
                const isOwnMessage = comment.user_id === userId
                const displayName = comment.profiles?.full_name || comment.profiles?.email?.split("@")[0] || "User"
                const initial = displayName.charAt(0).toUpperCase()

                return (
                  <div
                    key={comment.id}
                    className={`flex gap-2 lg:gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className="w-7 h-7 lg:w-8 lg:h-8 flex-shrink-0">
                      <AvatarFallback
                        className={isOwnMessage ? "bg-primary text-primary-foreground text-xs" : "bg-muted text-xs"}
                      >
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex flex-col gap-1 max-w-[75%] lg:max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {!isOwnMessage && <span className="font-medium">{displayName}</span>}
                        <span className="text-[10px] lg:text-xs">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div
                        className={`rounded-2xl px-3 py-2 lg:px-4 ${
                          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-xs lg:text-sm leading-relaxed break-words">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-3 lg:p-4">
          <form onSubmit={handleSendComment} className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button type="submit" disabled={isLoading || !newComment.trim()} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
