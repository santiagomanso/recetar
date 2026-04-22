"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, ChevronDown } from "lucide-react";

/* ─── Timing constants ───────────────── */

const ECG_DELAY = 0;
const ECG_DURATION = 0.5;
const ECG_FINISH = ECG_DELAY + ECG_DURATION;

/* ─── EcgLine (FIX REAL) ───────────────── */

function EcgLine() {
  const path =
    "M 0,60 L 200,60 " +
    "Q 210,60 215,50 Q 220,42 225,42 Q 230,42 235,50 Q 240,60 245,60 " +
    "L 260,60 L 265,65 L 290,4 L 305,116 L 315,60 " +
    "Q 325,60 335,48 Q 345,36 355,36 Q 365,48 375,60 Q 385,60 400,60 " +
    "L 800,60 " +
    "Q 810,60 815,50 Q 820,42 825,42 Q 830,42 835,50 Q 840,60 845,60 " +
    "L 860,60 L 865,65 L 890,4 L 905,116 L 915,60 " +
    "Q 925,60 935,48 Q 945,36 955,36 Q 965,48 975,60 Q 985,60 1000,60 " +
    "L 1200,60";

  return (
    <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
      <svg
        viewBox='0 0 1200 120'
        preserveAspectRatio='none' // 🔥 FIX CLAVE
        className='w-full h-24 sm:h-28 lg:h-32 block' // 🔥 altura responsive
        fill='none'
      >
        {/* Línea base */}
        <g className='opacity-[0.18] dark:opacity-[0.12]'>
          <motion.path
            d={path}
            stroke='currentColor'
            strokeWidth='1.5'
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: ECG_DURATION,
              ease: "easeInOut",
              delay: ECG_DELAY,
            }}
          />
        </g>

        {/* Scanner verde */}
        <motion.path
          d={path}
          stroke='#4ade80'
          strokeWidth='2.5'
          strokeLinecap='round'
          initial={{ pathLength: 0.01, pathOffset: 0, opacity: 0 }}
          animate={{
            pathOffset: [0, 1],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            pathOffset: {
              duration: 2.5,
              ease: "linear",
              repeat: Infinity,
              delay: ECG_FINISH,
            },
            opacity: {
              duration: 2.5,
              times: [0, 0.05, 0.95, 1],
              repeat: Infinity,
              delay: ECG_FINISH,
            },
          }}
        />
      </svg>
    </div>
  );
}

/* ─── TypewriterText ───────────────── */

const PHRASES = [
  "Enviá. El paciente paga. Listo.",
  "Recetas médicas con cobro automático",
  "WhatsApp + MercadoPago en un click",
  "El consultorio digital del médico moderno",
];

const CONTENT_APPEAR_MS = ECG_FINISH;
const CURSOR_WAIT_MS = 500;
const TYPE_CHAR_MS = 48;
const DELETE_CHAR_MS = 28;
const HOLD_FULL_MS = 2600;

type Phase = "idle" | "waiting" | "typing" | "full" | "deleting";

function TypewriterText() {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [idx, setIdx] = useState(0);
  const phrase = PHRASES[idx];

  useEffect(() => {
    const t = setTimeout(() => setPhase("waiting"), CONTENT_APPEAR_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "waiting") {
      const t = setTimeout(() => setPhase("typing"), CURSOR_WAIT_MS);
      return () => clearTimeout(t);
    }
    if (phase === "typing") {
      let i = displayed.length;
      const iv = setInterval(() => {
        i++;
        setDisplayed(phrase.slice(0, i));
        if (i >= phrase.length) {
          clearInterval(iv);
          setPhase("full");
        }
      }, TYPE_CHAR_MS);
      return () => clearInterval(iv);
    }
    if (phase === "full") {
      const t = setTimeout(() => setPhase("deleting"), HOLD_FULL_MS);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      let i = displayed.length;
      const iv = setInterval(() => {
        i--;
        setDisplayed(phrase.slice(0, Math.max(0, i)));
        if (i <= 0) {
          clearInterval(iv);
          setIdx((p) => (p + 1) % PHRASES.length);
          setPhase("waiting");
        }
      }, DELETE_CHAR_MS);
      return () => clearInterval(iv);
    }
  }, [phase]);

  const showCursor = phase !== "idle" && phase !== "full";

  return (
    <div className='flex h-6 items-center justify-center'>
      <p className='text-xs tracking-[0.22em] uppercase text-muted-foreground'>
        {displayed}
        {showCursor && (
          <motion.span
            className='inline-block w-px h-[1em] bg-accent align-middle ml-px'
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        )}
      </p>
    </div>
  );
}

/* ─── SplashSection ───────────────── */

export function SplashSection() {
  return (
    <section id='splash' className='relative h-svh flex flex-col items-center justify-center overflow-hidden bg-background'>
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
        <div className='h-128 w-lg rounded-full bg-primary/5 blur-3xl' />
      </div>

      <EcgLine />

      <motion.div
        className='relative z-10 flex flex-col items-center gap-5 text-center px-4 pt-20 sm:pt-0'
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
          delay: ECG_FINISH,
        }}
      >
        <div className='inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm'>
          <span className='text-muted-foreground'>Nuevo:</span>
          <span className='font-medium'>Integración con MercadoPago</span>
        </div>

        <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10'>
          <FileText className='h-7 w-7 text-primary' />
        </div>

        <h1 className='text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl'>
          Recetar
        </h1>

        <TypewriterText />

        <Link href='/login'>
          <Button size='lg' className='h-12 rounded-full px-8'>
            Enviar recetas
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </Link>
      </motion.div>

      <motion.button
        className='absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: ECG_FINISH + 0.4 }}
        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label='Ver más'
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <ChevronDown className='text-muted-foreground/40' />
        </motion.div>
      </motion.button>
    </section>
  );
}
