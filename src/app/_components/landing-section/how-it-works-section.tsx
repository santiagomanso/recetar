"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionArrow, SectionHeading } from "./_shared";

// TODO: reemplazar con el ID del video de YouTube cuando esté listo
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

const STEPS = [
  {
    step: "01",
    title: "Cargá la receta",
    description: "Subí el PDF de la receta ya generada por tu sistema autorizado.",
  },
  {
    step: "02",
    title: "Ingresá los datos",
    description: "Completá el número de WhatsApp del paciente y el monto a cobrar.",
  },
  {
    step: "03",
    title: "Enviá el link",
    description: "Con un click se envía el link de pago de MercadoPago al paciente.",
  },
  {
    step: "04",
    title: "Entrega automática",
    description:
      "Cuando el paciente paga, la receta se envía automáticamente por WhatsApp.",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      id="como-funciona"
      className="relative h-[calc(100svh-4rem)] flex flex-col bg-muted/30"
    >
      <SectionArrow targetId="features" direction="up" />

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden py-4">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            title="Cómo funciona"
            subtitle="Cuatro pasos simples para enviar recetas con cobro automático."
            isInView={isInView}
          />
        </div>

        {/* Video */}
        <motion.div
          className="mx-auto w-full max-w-3xl px-4 mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-border shadow-2xl"
            style={{ aspectRatio: "16/9" }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
              title="Como funciona Recetar"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </motion.div>

        {/* Steps — horizontal scroll on mobile, grid on desktop */}
        <div className="md:hidden overflow-x-auto pb-2 shrink-0">
          <div className="flex gap-3 px-4 snap-x snap-mandatory">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                className="w-[72vw] shrink-0 snap-center rounded-2xl border border-border bg-card p-5"
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 + i * 0.08 }}
              >
                <div className="text-5xl font-bold text-muted/50">{step.step}</div>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="hidden md:grid mx-auto w-full max-w-6xl px-4 gap-8 grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.7 + i * 0.1 }}
            >
              <div className="text-7xl font-bold text-muted/50 transition-colors duration-300 group-hover:text-accent/30">
                {step.step}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
              {i < STEPS.length - 1 && (
                <div className="absolute -right-4 top-8 hidden h-0.5 w-8 bg-border lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <SectionArrow targetId="pricing" direction="down" />
    </section>
  );
}
