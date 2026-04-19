import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/app/dashboard/_components/dashboard-navbar";
import { RecetaForm } from "@/components/receta-form";
import { HistorialMock } from "@/components/historial-mock";
import { FileText } from "lucide-react";
import { getUserById } from "@/services/users";

export async function DashboardData() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className='min-h-screen bg-background'>
      <DashboardNavbar userName={session.user.name} />

      <main className='mx-auto w-full max-w-6xl px-4 pt-18 pb-12'>
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
              <RecetaForm />
            </div>
          </div>

          {/* Historial */}
          <div className='w-full min-w-0 lg:flex-2'>
            <div className='w-full rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6'>
              <h3 className='mb-4 text-lg font-semibold text-card-foreground'>
                Recetas Recientes
              </h3>
              <HistorialMock />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
