"use client"

import { motion, type Variants } from "framer-motion"
import { Stethoscope } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
}

interface StepSpecialtyProps {
  value: string
  onChange: (value: string) => void
}

export function StepSpecialty({ value, onChange }: StepSpecialtyProps) {
  return (
    <div className="py-2">
      <motion.div
        custom={0}
        variants={item}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary">
          <Stethoscope className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">Tu especialidad</h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            opcional
          </span>
        </div>
      </motion.div>

      <motion.p
        custom={1}
        variants={item}
        initial="hidden"
        animate="visible"
        className="mt-2 text-sm text-muted-foreground leading-relaxed"
      >
        Aparecerá en tus recetas. Si querés, podés completarlo más tarde desde
        tu perfil.
      </motion.p>

      <motion.div
        custom={2}
        variants={item}
        initial="hidden"
        animate="visible"
        className="mt-6 space-y-2"
      >
        <Label className="text-sm font-medium">Especialidad médica</Label>
        <Input
          type="text"
          placeholder="Ej: Cardiología, Pediatría…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12"
          autoFocus
        />
      </motion.div>
    </div>
  )
}
