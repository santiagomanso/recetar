"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RevealAnimation, StaggerContainer } from "@/components/reveal-animation"
import {
  FileText,
  Zap,
  Shield,
  Clock,
  CreditCard,
  MessageCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 h-[1000px] w-[1000px] rounded-full bg-accent/5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 h-[800px] w-[800px] rounded-full bg-muted blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
        <RevealAnimation direction="down" delay={0}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-muted-foreground">Nuevo:</span>
            <span className="font-medium">Integracion con MercadoPago</span>
          </div>
        </RevealAnimation>

        <RevealAnimation direction="up" delay={100}>
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Recetas medicas con
            <span className="relative mx-3 inline-block">
              <span className="relative z-10">cobro automatico</span>
              <span className="absolute bottom-2 left-0 -z-0 h-3 w-full bg-accent/30 sm:h-4" />
            </span>
          </h1>
        </RevealAnimation>

        <RevealAnimation direction="up" delay={200}>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Carga tu receta, envia el link de pago por WhatsApp, y la receta se entrega automaticamente cuando tu paciente paga.
          </p>
        </RevealAnimation>

        <RevealAnimation direction="up" delay={300}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="group h-14 rounded-full px-8 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Comenzar gratis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/#como-funciona">
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-full px-8 text-base font-medium transition-all duration-300 hover:scale-105"
              >
                Ver como funciona
              </Button>
            </Link>
          </div>
        </RevealAnimation>

        <RevealAnimation direction="fade" delay={500}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Sin comisiones ocultas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Aprobado por el Ministerio de Salud</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Soporte 24/7</span>
            </div>
          </div>
        </RevealAnimation>

        {/* Stats */}
        <RevealAnimation direction="up" delay={600}>
          <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "+5,000", label: "Medicos activos" },
              { value: "+50,000", label: "Recetas enviadas" },
              { value: "99.9%", label: "Uptime garantizado" },
              { value: "< 30s", label: "Tiempo de entrega" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center transition-transform duration-300 hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </RevealAnimation>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Carga tu receta",
      description: "Subi el PDF de la receta autorizada por el Ministerio de Salud en segundos.",
    },
    {
      icon: CreditCard,
      title: "Link de pago automatico",
      description: "Se genera un link de MercadoPago y se envia automaticamente por WhatsApp.",
    },
    {
      icon: Shield,
      title: "Cobro garantizado",
      description: "La receta solo se entrega cuando el paciente completa el pago.",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp directo",
      description: "Comunicacion directa con tus pacientes en la plataforma que ya usan.",
    },
    {
      icon: Zap,
      title: "Entrega instantanea",
      description: "Apenas se confirma el pago, la receta se envia automaticamente.",
    },
    {
      icon: Clock,
      title: "Historial completo",
      description: "Accede al historial de todas tus recetas, pagos y entregas.",
    },
  ]

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <RevealAnimation direction="up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Todo lo que necesitas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Una plataforma completa para gestionar el envio de recetas medicas con cobro automatico.
            </p>
          </div>
        </RevealAnimation>

        <StaggerContainer
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          staggerDelay={100}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Carga la receta",
      description: "Subi el PDF de la receta ya generada por tu sistema autorizado.",
    },
    {
      step: "02",
      title: "Ingresa los datos",
      description: "Completa el numero de WhatsApp del paciente y el monto a cobrar.",
    },
    {
      step: "03",
      title: "Envia el link",
      description: "Con un click se envia el link de pago de MercadoPago al paciente.",
    },
    {
      step: "04",
      title: "Entrega automatica",
      description: "Cuando el paciente paga, la receta se envia automaticamente por WhatsApp.",
    },
  ]

  return (
    <section id="como-funciona" className="relative bg-muted/50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <RevealAnimation direction="up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Como funciona
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Cuatro pasos simples para enviar recetas con cobro automatico.
            </p>
          </div>
        </RevealAnimation>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <RevealAnimation key={step.step} direction="up" delay={index * 150}>
              <div className="group relative">
                <div className="text-7xl font-bold text-muted/50 transition-colors duration-300 group-hover:text-accent/30">
                  {step.step}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-8 hidden h-0.5 w-8 bg-border lg:block" />
                )}
              </div>
            </RevealAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <RevealAnimation direction="up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Precios simples y transparentes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Solo pagas por lo que usas. Sin suscripciones ni compromisos.
            </p>
          </div>
        </RevealAnimation>

        <RevealAnimation direction="up" delay={200}>
          <div className="mx-auto mt-16 max-w-lg">
            <div className="relative rounded-3xl border-2 border-primary bg-card p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  Mas popular
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-card-foreground">Por receta</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold tracking-tight text-foreground">$50</span>
                  <span className="text-muted-foreground">/ receta</span>
                </div>
                <p className="mt-2 text-muted-foreground">
                  + comision de MercadoPago (3.99%)
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  "Recetas ilimitadas",
                  "Integracion con MercadoPago",
                  "Envio por WhatsApp",
                  "Historial completo",
                  "Soporte por email",
                  "Dashboard analitico",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login" className="mt-8 block">
                <Button className="h-12 w-full text-base font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  Comenzar ahora
                </Button>
              </Link>
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-primary py-24 sm:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <RevealAnimation direction="up">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            Empieza a cobrar tus recetas hoy
          </h2>
        </RevealAnimation>
        
        <RevealAnimation direction="up" delay={100}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Unite a miles de medicos que ya simplifican su trabajo con Recetar.
          </p>
        </RevealAnimation>

        <RevealAnimation direction="up" delay={200}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="group h-14 rounded-full px-8 text-base font-medium transition-all duration-300 hover:scale-105"
              >
                Crear cuenta gratis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </RevealAnimation>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Recetar</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/#features" className="transition-colors hover:text-foreground">
              Funcionalidades
            </Link>
            <Link href="/#pricing" className="transition-colors hover:text-foreground">
              Precios
            </Link>
            <Link href="/login" className="transition-colors hover:text-foreground">
              Login
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>2026 Recetar. Esta es una version de demostacion (mock).</p>
        </div>
      </div>
    </footer>
  )
}
