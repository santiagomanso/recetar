import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import { LoginForm } from "@/app/(auth)/login/_components/login-form";

interface LoginPageDataProps {
  searchParams: Promise<{ error?: string }>;
}

export async function LoginPageData({ searchParams }: LoginPageDataProps) {
  const cookieStore = await cookies();
  const authHint = cookieStore.get("auth_hint")?.value as
    | "credentials"
    | "google"
    | undefined;

  const { error } = await searchParams;

  return (
    <div className='flex min-h-screen'>
      {/* Left side - Form */}
      <div className='flex flex-1 flex-col justify-start pt-10 md:pt-0 px-4 sm:px-6 lg:flex-none md:justify-center lg:pt-0 lg:px-20 xl:px-24'>
        <div className='mx-auto w-full max-w-sm lg:w-96'>
          <div>
            <Link
              href='/'
              className='inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              <ArrowLeft className='h-4 w-4' />
              Volver al inicio
            </Link>

            <div className='mt-8 flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg transition-transform duration-300 hover:scale-110'>
                <FileText className='h-6 w-6 text-primary-foreground' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-foreground'>
                  RecetaMed
                </h1>
                <p className='text-sm text-muted-foreground'>
                  Accedé a tu cuenta
                </p>
              </div>
            </div>
          </div>

          <div className='mt-10'>
            <LoginForm authHint={authHint} urlError={error} />
          </div>

          <p className='mt-6 text-center text-sm text-muted-foreground'>
            ¿No tenés cuenta?{" "}
            <Link
              href='/register'
              className='font-medium text-primary underline-offset-4 hover:underline'
            >
              Registrate
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className='relative hidden flex-1 lg:block'>
        <div className='absolute inset-0 bg-primary'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute -top-1/2 -right-1/2 h-200 w-200 rounded-full bg-white/5 blur-3xl' />
            <div className='absolute -bottom-1/2 -left-1/4 h-150 w-150 rounded-full bg-white/10 blur-3xl' />
          </div>

          <div className='relative flex h-full flex-col items-center justify-center px-12 text-center'>
            <div className='max-w-md'>
              <h2 className='text-3xl font-bold text-primary-foreground'>
                Simplificá el cobro de tus recetas médicas
              </h2>
              <p className='mt-4 text-lg text-primary-foreground/80'>
                Enviá recetas por WhatsApp con cobro automático via MercadoPago.
                Sin complicaciones.
              </p>

              <div className='mt-12 grid grid-cols-2 gap-6'>
                {[
                  { value: "+5,000", label: "Médicos" },
                  { value: "+50,000", label: "Recetas" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "24/7", label: "Soporte" },
                ].map((stat) => (
                  <div key={stat.label} className='text-center'>
                    <div className='text-2xl font-bold text-primary-foreground'>
                      {stat.value}
                    </div>
                    <div className='text-sm text-primary-foreground/60'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
