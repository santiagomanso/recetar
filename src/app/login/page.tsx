"use client"

import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { FileText, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg transition-transform duration-300 hover:scale-110">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">RecetaMed</h1>
                <p className="text-sm text-muted-foreground">Accede a tu cuenta</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <LoginForm />
          </div>
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
                Simplifica el cobro de tus recetas medicas
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Envia recetas por WhatsApp con cobro automatico via MercadoPago. Sin complicaciones.
              </p>
              
              <div className="mt-12 grid grid-cols-2 gap-6">
                {[
                  { value: "+5,000", label: "Medicos" },
                  { value: "+50,000", label: "Recetas" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "24/7", label: "Soporte" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                    <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
