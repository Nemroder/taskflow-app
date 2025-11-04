"use client"

import type React from "react"

import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { useAuthStore } from "@/lib/store/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setIsLoading])

  return <>{children}</>
}
