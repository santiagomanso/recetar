"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionArrow } from "./_shared";

export function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      id="cta"
      className="relative h-[calc(100svh-4rem)] flex flex-col bg-primary overflow-hidden"
    >
      <SectionArrow targetId="pricing" direction="up" />

      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative flex flex-1 min-h-0 items-center justify-center">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="overflow-hidden mb-6">
            <motion.h2
              className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl"
              initial={{ y: "105%" }}
              animate={isInView ? { y: "0%" } : { y: "105%" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Empezá a cobrar tus recetas hoy
            </motion.h2>
          </div>

          <motion.div
            className="h-px bg-linear-to-r from-transparent via-white/40 to-transparent mx-auto mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />

          <motion.p
            className="mx-auto max-w-2xl text-lg text-primary-foreground/70 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Sumate a los médicos que ya simplifican su trabajo con Recetar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.55 }}
          >
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="group h-14 rounded-full px-8 text-lg font-medium transition-all duration-300 hover:scale-105"
              >
                Enviar recetas gratis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
