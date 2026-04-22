import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/app/dashboard/_components/dashboard-navbar";
import { RecetaForm } from "@/components/receta-form";
import { Historial } from "@/app/dashboard/_components/historial";
import { HistorialSkeleton } from "@/app/dashboard/_components/historial-skeleton";
import {
  DashboardRefreshProvider,
  HistorialSection,
} from "@/app/dashboard/_components/dashboard-refresh-context";
import { HistorialSpinner } from "@/app/dashboard/_components/historial-spinner";
import { FileText } from "lucide-react";
import { getUserById, getCachedDefaultAmount } from "@/services/users";
import { hasDeliveries as checkHasDeliveries } from "@/services/deliveries";

export async function DashboardData() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [user, defaultAmount, doctorHasDeliveries] = await Promise.all([
    getUserById(session.user.id),
    getCachedDefaultAmount(session.user.id),
    checkHasDeliveries(session.user.id),
  ]);

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <DashboardRefreshProvider>
      <div className='min-h-screen bg-background'>
        <DashboardNavbar
          userName={session.user.name}
          userImage={user.image}
          userSpecialty={user.specialty}
        />

        <main className='mx-auto w-full max-w-6xl px-4 pt-20 md:pt-22 pb-12'>
          {/* Hero */}
          <div className='mb-5'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Panel de Recetas
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              Bienvenido, {session.user.name ?? session.user.email}. Cargá y
              enviá recetas médicas con cobro automático via MercadoPago.
            </p>
          </div>

          {/* Main Content */}
          <div className='flex w-full flex-col gap-6 md:flex-row md:items-start'>
            {/* Form */}
            <div className='w-full min-w-0 md:flex-1'>
              <div className='w-full rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6'>
                <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground sm:mb-6'>
                  <FileText className='h-5 w-5' />
                  Nueva Receta
                </h3>
                <RecetaForm initialMonto={defaultAmount ?? 5000} />
              </div>
            </div>

            {/* Historial — oculto en mobile, visible desde tablet */}
            <div className='hidden md:block w-full min-w-0 md:flex-1'>
              <div className='w-full rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6'>
                <h3 className='mb-4 text-lg font-semibold text-card-foreground'>
                  Recetas Recientes
                </h3>
                <HistorialSection hasDeliveries={doctorHasDeliveries}>
                  <Suspense fallback={<HistorialSpinner />}>
                    <Historial doctorId={user.id} limit={4} />
                  </Suspense>
                </HistorialSection>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardRefreshProvider>
  );
}
