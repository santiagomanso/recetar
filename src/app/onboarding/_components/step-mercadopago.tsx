"use client"

import Image from "next/image"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react"

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
}

interface StepMercadoPagoProps {
  isConnected: boolean
  hasError?: boolean
}

const BENEFITS = [
  { icon: Zap, label: "Pagos instantáneos a tu cuenta personal" },
  { icon: ShieldCheck, label: "Sin intermediarios — el dinero es tuyo" },
  { icon: Lock, label: "Conexión segura y encriptada" },
]

export function StepMercadoPago({ isConnected, hasError }: StepMercadoPagoProps) {
  return (
    <div className="py-2">
      <AnimatePresence mode="wait">
        {isConnected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 380, damping: 28 }}
            className="flex flex-col items-center gap-4 py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring" as const, stiffness: 500, damping: 22, delay: 0.1 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
            >
              <CheckCircle2 className="h-8 w-8 text-success" />
            </motion.div>

            <div className="space-y-1">
              <p className="text-lg font-bold text-foreground">¡Cuenta conectada!</p>
              <p className="text-sm text-muted-foreground">
                Listo para recibir pagos de tus pacientes
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 px-6 py-3">
              <Image src="/mp-logo.svg" alt="MercadoPago" width={130} height={53} loading="eager" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="connect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            {/* Logo centrado */}
            <motion.div
              custom={0}
              variants={item}
              initial="hidden"
              animate="visible"
              className="flex justify-center"
            >
              <div className="rounded-xl border border-border bg-muted/40 px-6 py-3">
                <Image src="/mp-logo.svg" alt="MercadoPago" width={140} height={57} loading="eager" />
              </div>
            </motion.div>

            {/* Heading + copy */}
            <motion.div
              custom={1}
              variants={item}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <h2 className="text-xl font-bold text-foreground">
                Conectá tu cuenta de MercadoPago
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Al enviar una receta digital, tus pacientes recibirán un link de pago directo a
                tu cuenta. El cobro es automático — vos no tenés que hacer nada más.
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.ul
              custom={2}
              variants={item}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {BENEFITS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </span>
                  {label}
                </li>
              ))}
            </motion.ul>

            {/* Error */}
            {hasError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/8 px-3.5 py-2.5 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                Hubo un error al conectar. Intentá de nuevo.
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              custom={3}
              variants={item}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <a
                href="/api/mercadopago/connect"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Conectar con MercadoPago
                <ArrowRight className="h-4 w-4" />
              </a>
<p className="text-center text-xs text-muted-foreground">
                Serás redirigido a MercadoPago de forma segura
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
