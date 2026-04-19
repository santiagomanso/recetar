import Link from "next/link"
import { FileText, AlertCircle, ArrowLeft } from "lucide-react"

interface AuthErrorPageProps {
  searchParams: Promise<{ error?: string }>
}

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  AccessDenied: {
    title: "Acceso denegado",
    description:
      "Este correo ya está registrado con contraseña. Iniciá sesión con tu correo y contraseña en lugar de usar Google.",
  },
  Configuration: {
    title: "Error de configuración",
    description:
      "Hay un problema con la configuración del servidor. Contactá al administrador.",
  },
  Verification: {
    title: "Enlace inválido",
    description: "El enlace de verificación expiró o ya fue utilizado.",
  },
}

const DEFAULT_ERROR = {
  title: "Error al iniciar sesión",
  description:
    "Ocurrió un error inesperado. Intentá de nuevo o contactá al administrador.",
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const { error } = await searchParams
  const content = (error ? ERROR_MESSAGES[error] : undefined) ?? DEFAULT_ERROR

  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Recetar</h1>
              <p className="text-sm text-muted-foreground">Accedé a tu cuenta</p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {content.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {content.description}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 h-[800px] w-[800px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold text-primary-foreground">
                Simplificá el cobro de tus recetas médicas
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Enviá recetas por WhatsApp con cobro automático via MercadoPago.
                Sin complicaciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
