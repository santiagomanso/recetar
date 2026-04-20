import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/app/dashboard/_components/dashboard-navbar";
import { RecetaForm } from "@/components/receta-form";
import { Historial } from "@/app/dashboard/_components/historial";
import { HistorialSkeleton } from "@/app/dashboard/_components/historial-skeleton";
import { FileText } from "lucide-react";
import { getUserById, getCachedDefaultAmount } from "@/services/users";

export async function DashboardData() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [user, defaultAmount] = await Promise.all([
    getUserById(session.user.id),
    getCachedDefaultAmount(session.user.id),
  ]);

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className='min-h-screen bg-background'>
      <DashboardNavbar userName={session.user.name} userImage={user.image} userSpecialty={user.specialty} />

      <main className='mx-auto w-full max-w-6xl px-4 pt-28 pb-12'>
        {/* Hero */}
        <div className='mb-5'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Panel de Recetas
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Bienvenido, {session.user.name ?? session.user.email}. Cargá y enviá
            recetas médicas con cobro automático via MercadoPago.
          </p>
        </div>

        {/* Main Content */}
        <div className='flex w-full flex-col gap-6 lg:flex-row lg:items-start'>
          {/* Form */}
          <div className='w-full min-w-0 lg:flex-3'>
            <div className='w-full rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6'>
              <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground sm:mb-6'>
                <FileText className='h-5 w-5' />
                Nueva Receta
              </h3>
              <RecetaForm initialMonto={defaultAmount ?? 5000} />
            </div>
          </div>

          {/* Historial */}
          <div className='w-full min-w-0 lg:flex-2'>
            <div className='w-full rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6'>
              <h3 className='mb-4 text-lg font-semibold text-card-foreground'>
                Recetas Recientes
              </h3>
              <Suspense fallback={<HistorialSkeleton />}>
                <Historial doctorId={user.id} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
