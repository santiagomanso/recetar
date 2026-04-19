"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { completeOnboardingAction } from "@/app/onboarding/_actions/complete-onboarding"

interface WizardData {
  mpConnected: boolean
  telephone: string
  specialty: string
}

export function useOnboarding(hasSpecialty: boolean) {
  const totalSteps = hasSpecialty ? 2 : 3
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState<WizardData>({
    mpConnected: false,
    telephone: "",
    specialty: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { update: updateSession } = useSession()

  const canAdvance =
    step === 0
      ? data.mpConnected
      : step === 1
        ? data.telephone.trim().length >= 8
        : true // specialty is optional

  const goNext = useCallback(() => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, totalSteps - 1))
  }, [totalSteps])

  const goBack = useCallback(() => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const setMpConnected = useCallback((connected: boolean) => {
    setData((d) => ({ ...d, mpConnected: connected }))
  }, [])

  const setTelephone = useCallback((telephone: string) => {
    setData((d) => ({ ...d, telephone }))
  }, [])

  const setSpecialty = useCallback((specialty: string) => {
    setData((d) => ({ ...d, specialty }))
  }, [])

  const handleComplete = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await completeOnboardingAction({
        telephone: data.telephone.trim(),
        specialty: data.specialty.trim() || undefined,
      })

      if (result.success) {
        await updateSession()
        window.location.href = "/dashboard"
      } else {
        setError("Ocurrió un error. Intentá de nuevo.")
        setIsSubmitting(false)
      }
    } catch {
      setError("Ocurrió un error. Intentá de nuevo.")
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}
