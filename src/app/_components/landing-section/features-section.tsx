"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  CreditCard,
  Shield,
  MessageCircle,
  Zap,
  Clock,
} from "lucide-react";
import { SectionArrow, SectionHeading } from "./_shared";

const FEATURES = [
  {
    icon: FileText,
    title: "Carga tu receta",
    description:
      "Subi el PDF de la receta autorizada por el Ministerio de Salud en segundos.",
  },
  {
    icon: CreditCard,
    title: "Link de pago automático",
    description:
      "Se genera un link de MercadoPago y se envía automáticamente por WhatsApp.",
  },
  {
    icon: Shield,
    title: "Cobro garantizado",
    description:
      "La receta solo se entrega cuando el paciente completa el pago.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp directo",
    description:
      "Comunicación directa con tus pacientes en la plataforma que ya usan.",
  },
  {
    icon: Zap,
    title: "Entrega instantánea",
    description:
      "Apenas se confirma el pago, la receta se envía automáticamente.",
  },
  {
    icon: Clock,
    title: "Historial completo",
    description:
      "Accedé al historial de todas tus recetas, pagos y entregas.",
  },
];

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} id="features" className="relative h-[calc(100svh-4rem)] flex flex-col">
      <SectionArrow targetId="splash" direction="up" />

      <div className="flex flex-1 min-h-0 flex-col justify-center overflow-hidden py-4">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            title="Todo lo que necesitas"
            subtitle="Una plataforma completa para gestionar el envío de recetas médicas con cobro automático."
            isInView={isInView}
          />
        </div>

        {/* Mobile: horizontal snap scroll */}
        <div className="md:hidden overflow-x-auto pb-2">
          <div className="flex gap-3 px-4 snap-x snap-mandatory">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="w-[72vw] shrink-0 snap-center rounded-2xl border border-border bg-card p-5"
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.07 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid mx-auto w-full max-w-6xl px-4 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.08 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <SectionArrow targetId="como-funciona" direction="down" />
    </section>
  );
}
