"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminUsers } from "@/app/admin/_hooks/use-admin-users"

function UserCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-3">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}

interface PendingUser {
  id: string
  name: string
  email: string
  specialty: string | null
  status: string
  createdAt: Date
}

interface UserCardProps {
  user: PendingUser
  isActing: boolean
  onApprove: (userId: string) => void
  onReject: (userId: string) => void
}

function UserCard({ user, isActing, onApprove, onReject }: UserCardProps) {
  const formattedDate = format(new Date(user.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: es })

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-2">
      <p className="text-lg font-semibold text-card-foreground">{user.name}</p>
      <p className="text-sm text-muted-foreground">{user.email}</p>
      <p className="text-sm text-muted-foreground">
        Especialidad: {user.specialty ?? "Sin especialidad"}
      </p>
      <p className="text-xs text-muted-foreground">Solicitado el {formattedDate}</p>
      <div className="flex gap-3 pt-3">
        <Button
          size="sm"
          disabled={isActing}
          onClick={() => onApprove(user.id)}
          className="bg-success text-success-foreground hover:bg-success/90"
        >
          Aprobar
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={isActing}
          onClick={() => onReject(user.id)}
        >
          Rechazar
        </Button>
      </div>
    </div>
  )
}

export function PendingUsersList() {
  const { users, isLoading, isPending, actionUserId, approve, reject } = useAdminUsers()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <UserCardSkeleton />
        <UserCardSkeleton />
        <UserCardSkeleton />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-lg font-medium text-card-foreground">No hay médicos pendientes</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Todas las solicitudes han sido procesadas.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {users.length} {users.length === 1 ? "médico pendiente" : "médicos pendientes"}
      </p>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isActing={isPending && actionUserId === user.id}
          onApprove={approve}
          onReject={reject}
        />
      ))}
    </div>
  )
}
