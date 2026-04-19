"use client"

import { useRef } from "react"
import { motion, type Variants } from "framer-motion"
import { AsYouType } from "libphonenumber-js"
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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-14 w-14">
      <rect width="64" height="64" rx="16" fill="#4CAF72" />
      {/* White speech bubble background */}
      <path
        d="M32 10C19.85 10 10 19.85 10 32c0 3.9 1.05 7.56 2.89 10.7L10 54l11.65-3.05A21.87 21.87 0 0 0 32 54c12.15 0 22-9.85 22-22S44.15 10 32 10z"
        fill="white"
      />
      {/* Green phone handset */}
      <path
        d="M32 14.5C22.34 14.5 14.5 22.34 14.5 32c0 3.3.93 6.38 2.54 9.01l-1.7 6.27 6.46-1.69A17.37 17.37 0 0 0 32 49.5c9.66 0 17.5-7.84 17.5-17.5S41.66 14.5 32 14.5z"
        fill="#4CAF72"
      />
      {/* White phone icon */}
      <path
        d="M40.2 35.6c-.5-.25-2.94-1.45-3.4-1.62-.45-.16-.78-.24-1.1.25-.33.5-1.28 1.62-1.57 1.95-.29.33-.58.37-1.08.12-.5-.25-2.1-.77-4-2.46-1.48-1.32-2.48-2.94-2.77-3.44-.29-.5-.03-.77.22-1.02.22-.22.5-.58.74-.87.25-.29.33-.5.5-.83.16-.33.08-.62-.04-.87-.12-.25-1.1-2.64-1.5-3.62-.4-.95-.8-.82-1.1-.84l-.94-.01c-.33 0-.86.12-1.31.62-.45.5-1.72 1.68-1.72 4.1 0 2.4 1.76 4.74 2 5.07.25.33 3.44 5.5 8.4 7.5 1.18.5 2.1.8 2.81 1.03 1.18.37 2.25.32 3.1.19.94-.14 2.94-.95 3.36-1.88.41-.92.41-1.72.29-1.88-.12-.17-.45-.29-.95-.54z"
        fill="white"
      />
    </svg>
  )
}

interface StepPhoneProps {
  value: string
  onChange: (value: string) => void
}

export function StepPhone({ value, onChange }: StepPhoneProps) {
  const formatter = useRef(new AsYouType("AR"))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    formatter.current.reset()
    const formatted = formatter.current.input(raw.replace(/\D/g, ""))
    onChange(formatted)
  }

  return (
    <div className="py-2">
      <motion.div
        custom={0}
        variants={item}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3"
      >
        <WhatsAppIcon />
        <h2 className="text-xl font-bold text-foreground">Tu número de WhatsApp</h2>
      </motion.div>

      <motion.p
        custom={1}
        variants={item}
        initial="hidden"
        animate="visible"
        className="mt-4 text-sm text-muted-foreground leading-relaxed"
      >
        Te avisaremos cuando un paciente realice un pago o necesite atención.
      </motion.p>

      <motion.div
        custom={2}
        variants={item}
        initial="hidden"
        animate="visible"
        className="mt-6 space-y-2"
      >
        <Label className="text-sm font-medium">Número de teléfono</Label>
        <div className="flex items-center gap-2">
          <div className="flex h-12 shrink-0 items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground select-none">
            🇦🇷 +54
          </div>
          <Input
            type="tel"
            placeholder="9 11 1234 5678"
            value={value}
            onChange={handleChange}
            className="h-12 flex-1"
            maxLength={16}
            autoFocus
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Sin el 0 ni el 15. Ej: 9 11 1234 5678
        </p>
      </motion.div>
    </div>
  )
}
