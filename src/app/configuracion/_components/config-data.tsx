import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserWithConfig } from "@/services/users"
import { DashboardNavbar } from "@/app/dashboard/_components/dashboard-navbar"
import { PerfilCard } from "@/app/configuracion/_components/perfil-card"
import { MercadoPagoCard } from "@/app/configuracion/_components/mercadopago-card"
import { PrecioCard } from "@/app/configuracion/_components/precio-card"

export async function ConfigData() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await getUserWithConfig(session.user.id)
  if (!user) redirect("/login")
  if (!user.onboardingCompleted) redirect("/onboarding")

  const isLinked = !!user.mpAccessToken

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar userName={session.user.name} userImage={user.image} userSpecialty={user.specialty} />
      <main className="mx-auto w-full max-w-6xl px-4 pt-24 pb-14">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Configuración
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Administrá tu perfil, cuenta de cobros y preferencias de recetas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="lg:row-span-2 lg:h-full">
            <PerfilCard
              initialSpecialty={user.specialty}
              initialEmail={user.email}
              initialTelephone={user.telephone}
              initialImage={user.image}
              userName={user.name ?? ""}
            />
          </div>
          <MercadoPagoCard isLinked={isLinked} />
          <PrecioCard
            initialAmount={user.config?.defaultAmount
              ? Number(user.config.defaultAmount)
              : null}
          />
        </div>
      </main>
    </div>
  )
}
