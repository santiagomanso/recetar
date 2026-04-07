import { PendingUsersList } from "@/app/admin/_components/pending-users-list"

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl px-8 pt-24 pb-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Panel de administración</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Aprobá o rechazá las solicitudes de acceso de los médicos.
        </p>
      </div>
      <PendingUsersList />
    </main>
  )
}
