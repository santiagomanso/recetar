"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface Step {
  id: string
  label: string
}

interface WizardProgressProps {
  current: number
  steps: Step[]
}

export function WizardProgress({ current, steps }: WizardProgressProps) {
  return (
    <div className="flex items-start">
      {steps.map((step, index) => {
        const isCompleted = index < current
        const isActive = index === current

        return (
          <div
            key={step.id}
            className="flex items-start"
            style={{ flex: index < steps.length - 1 ? 1 : "none" }}
          >
            <div className="flex flex-col items-center">
              <div
                className={[
                  "relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-300",
                  isCompleted
                    ? "border-[#16a34a] bg-[#16a34a] text-white"
                    : isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-transparent text-muted-foreground",
                ].join(" ")}
              >
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring" as const, stiffness: 500, damping: 25 }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </motion.span>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={[
                  "mt-1.5 whitespace-nowrap text-[10px] font-medium",
                  index <= current ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="relative mx-2 mt-4 h-0.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground"
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
