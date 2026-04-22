"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── SectionArrow ───────────────────────────────────────────── */

export function SectionArrow({
  targetId,
  direction,
}: {
  targetId: string;
  direction: "up" | "down";
}) {
  const Icon = direction === "up" ? ChevronUp : ChevronDown;
  return (
    <motion.button
      className={cn(
        "shrink-0 flex w-full items-center justify-center cursor-pointer z-10",
        direction === "down" ? "h-14 pb-2" : "h-10 mt-16",
      )}
      animate={{ y: direction === "down" ? [0, 5, 0] : [0, -5, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      onClick={() =>
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" })
      }
      aria-label={direction === "up" ? "Sección anterior" : "Sección siguiente"}
    >
      <Icon size={22} strokeWidth={1.5} className="text-muted-foreground/40" />
    </motion.button>
  );
}

/* ─── SectionHeading ─────────────────────────────────────────── */

export function SectionHeading({
  title,
  subtitle,
  isInView,
}: {
  title: string;
  subtitle: string;
  isInView: boolean;
}) {
  return (
    <div className="text-center mb-4 sm:mb-10">
      <div className="overflow-hidden mb-3 sm:mb-5">
        <motion.h2
          className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          initial={{ y: "105%" }}
          animate={isInView ? { y: "0%" } : { y: "105%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {title}
        </motion.h2>
      </div>
      <motion.div
        className="h-px bg-linear-to-r from-transparent via-accent to-transparent mx-auto mb-3 sm:mb-5"
        initial={{ width: 0 }}
        animate={isInView ? { width: 80 } : { width: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
      <motion.p
        className="mx-auto max-w-2xl text-sm sm:text-lg text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
