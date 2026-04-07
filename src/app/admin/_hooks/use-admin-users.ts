"use client"

import { useState, useEffect, useTransition } from "react"
import {
  getPendingUsersAction,
  approveUserAction,
  rejectUserAction,
} from "@/app/admin/_actions/users"

interface PendingUser {
  id: string
  name: string
  email: string
  specialty: string | null
  status: string
  createdAt: Date
}

export function useAdminUsers() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [actionUserId, setActionUserId] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setIsLoading(true)
    const data = await getPendingUsersAction()
    setUsers(data as PendingUser[])
    setIsLoading(false)
  }

  function approve(userId: string) {
    setActionUserId(userId)
    startTransition(async () => {
      await approveUserAction(userId)
      await loadUsers()
      setActionUserId(null)
    })
  }

  function reject(userId: string) {
    setActionUserId(userId)
    startTransition(async () => {
      await rejectUserAction(userId)
      await loadUsers()
      setActionUserId(null)
    })
  }

  return { users, isLoading, isPending, actionUserId, approve, reject }
}
