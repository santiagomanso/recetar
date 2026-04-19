"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { FileText, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/app/onboarding/_hooks/use-onboarding"
import { WizardProgress } from "@/app/onboarding/_components/wizard-progress"
import { StepMercadoPago } from "@/app/onboarding/_components/step-mercadopago"
import { StepPhone } from "@/app/onboarding/_components/step-phone"
import { StepSpecialty } from "@/app/onboarding/_components/step-specialty"

interface OnboardingWizardProps {
  hasSpecialty: boolean
  email: string
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 52 : -52, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 52 : -52, opacity: 0 }),
}

export function OnboardingWizard({ hasSpecialty, email }: OnboardingWizardProps) {
  const {
    step,
    direction,
    totalSteps,
    data,
    isSubmitting,
    error,
    canAdvance,
    goNext,
    goBack,
    setMpConnected,
    setTelephone,
    setSpecialty,
    handleComplete,
  } = useOnboarding(hasSpecialty)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const mp = searchParams.get("mp")
    if (mp === "connected") {
      setMpConnected(true)
      router.replace("/onboarding", { scroll: false })
    }
  }, [searchParams, router, setMpConnected])

  const steps = [
    { id: "mp", label: "Pagos" },
    { id: "phone", label: "Teléfono" },
    ...(!hasSpecialty ? [{ id: "specialty", label: "Especialidad" }] : []),
  ]

  const isLastStep = step === totalSteps - 1
  const mpHasError = searchParams.get("mp") === "error"
  const isMpStep = step === 0

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-56 -top-56 h-[700px] w-[700px] rounded-full blur-3xl"
          style={{ background: "rgba(0,188,255,0.06)" }}
        />
        <div
          className="absolute -bottom-56 -left-56 h-[700px] w-[700px] rounded-full blur-3xl"
          style={{ background: "rgba(255,230,0,0.07)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "rgba(10,0,128,0.03)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[460px]"
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/[0.1]">
          {/* Top strip — MP brand colors */}
          <div
            className="h-[3px]"
            style={{
              background:
                "linear-gradient(to right, #00bcff 0%, #0a0080 40%, #FFE600 100%)",
            }}
          />

          {/* Header */}
          <div className="px-7 pb-5 pt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-7 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none text-foreground">
                    RecetaMed
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Configurá tu cuenta médica
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {email.split("@")[0]}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <WizardProgress current={step} steps={steps} />
            </motion.div>
          </div>

          {/* Step content */}
          <div
            className="relative overflow-hidden"
            style={{
              minHeight: isMpStep ? 340 : 280,
              padding: isMpStep ? "0 28px 0" : "0 28px",
            }}
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <StepMercadoPago
                    isConnected={data.mpConnected}
                    hasError={mpHasError && !data.mpConnected}
                  />
                )}
                {step === 1 && (
                  <StepPhone value={data.telephone} onChange={setTelephone} />
                )}
                {step === 2 && !hasSpecialty && (
                  <StepSpecialty value={data.specialty} onChange={setSpecialty} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="px-7 pb-7 pt-4">
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-3 text-center text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}

            <div className="flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  disabled={isSubmitting}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Button>
              ) : (
                <div />
              )}

              {isLastStep ? (
                <Button
                  onClick={handleComplete}
                  disabled={!canAdvance || isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Finalizar
                    </>
                  )}
                </Button>
              ) : canAdvance ? (
                <Button onClick={goNext} className="gap-2">
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-center text-xs text-muted-foreground"
        >
          Paso {step + 1} de {totalSteps}
        </motion.p>
      </motion.div>
    </div>
  )
}
