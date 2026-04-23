"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionArrow, SectionHeading } from "./_shared";

const PLAN_FEATURES = [
  "Recetas ilimitadas",
  "Integración con MercadoPago",
  "Envío por WhatsApp",
  "Historial completo",
  "Soporte por email",
  "Dashboard analítico",
];

export function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section ref={ref} id="pricing" className="relative h-[calc(100svh-4rem)] flex flex-col">
      <SectionArrow targetId="como-funciona" direction="up" />

      <div className="flex flex-1 min-h-0 flex-col justify-center overflow-hidden py-6 px-4">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            title="Precios simples y transparentes"
            subtitle="Solo pagás por lo que usás. Sin suscripciones ni compromisos."
            isInView={isInView}
          />
        </div>

        <motion.div
          className="mx-auto w-full max-w-lg px-4"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <div className="relative rounded-3xl border-2 border-primary bg-card p-5 sm:p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                Más popular
              </span>
            </div>

            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">
                Por receta
              </h3>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                  $50
                </span>
                <span className="text-muted-foreground">/ receta</span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                + comisión de MercadoPago (3.99%)
              </p>
            </div>

            <ul className="mt-5 sm:mt-8 space-y-2 sm:space-y-3">
              {PLAN_FEATURES.map((feature, i) => (
                <motion.li
                  key={feature}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.07 }}
                >
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-accent" />
                  <span className="text-sm sm:text-lg text-card-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Link href="/login" className="mt-5 sm:mt-8 block">
              <Button className="h-11 sm:h-12 w-full font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                Comenzar ahora
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <SectionArrow targetId="cta" direction="down" />
    </section>
  );
}
