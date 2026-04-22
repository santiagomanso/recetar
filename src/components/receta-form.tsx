"use client"

import { useRef, useEffect } from "react"
import { Send, Loader2, CheckCircle2, AlertCircle, FilePlus2 } from "lucide-react"
import { AsYouType } from "libphonenumber-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PDFUpload } from "./pdf-upload"
import { useRecetaForm } from "@/app/dashboard/_hooks/use-receta-form"
import { useDashboardRefresh } from "@/app/dashboard/_components/dashboard-refresh-context"

export function RecetaForm({ initialMonto }: { initialMonto: number }) {
  const { markSending, refresh } = useDashboardRefresh()
  const phoneFormatter = useRef(new AsYouType("AR"))

  const {
    pdfFile,
    setPdfFile,
    telefono,
    setTelefono,
    monto,
    setMonto,
    estado,
    errorMsg,
    puedeEnviar,
    enProceso,
    handleEnviar,
    reset,
  } = useRecetaForm(initialMonto)

  useEffect(() => {
    if (estado === "enviando") markSending()  // skeleton aparece al click
    if (estado === "exito") refresh()         // refresh DB cuando termina
  }, [estado, markSending, refresh])

  function handleReset() {
    reset()
  }

  // Estado de éxito — mostrar solo el mensaje y botón de nueva receta
  if (estado === "exito") {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">¡Link enviado!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            El paciente recibirá la receta por WhatsApp una vez que pague.
          </p>
        </div>
        <Button onClick={handleReset} className="w-full" size="lg">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Nueva Receta
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Formulario */}
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="pdf" className="text-sm font-medium text-foreground">
            Receta Médica (PDF)
          </Label>
          <PDFUpload onFileSelect={setPdfFile} selectedFile={pdfFile} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[11fr_9fr] lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-sm font-medium text-foreground">
              WhatsApp del Paciente
            </Label>
            <div className="relative w-full">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                +54
              </span>
              <Input
                id="telefono"
                type="tel"
                placeholder="9 11 1234-5678"
                value={telefono}
                onChange={(e) => {
                  phoneFormatter.current.reset()
                  const formatted = phoneFormatter.current.input(e.target.value.replace(/\D/g, ""))
                  setTelefono(formatted)
                }}
                className="w-full pl-14"
                maxLength={16}
                disabled={enProceso}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Sin el 0 ni el 15. Ej: 9 11 1234-5678
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto" className="text-sm font-medium text-foreground">
              Monto a Cobrar
            </Label>
            <div className="relative w-full">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                ARS $
              </span>
              <Input
                id="monto"
                type="number"
                placeholder="5000"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-[4.5rem]"
                disabled={enProceso}
              />
            </div>
          </div>
        </div>
      </div>

      {estado === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <Button
        onClick={handleEnviar}
        disabled={!puedeEnviar || enProceso}
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
      >
        {enProceso ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Enviar Link de Pago
          </>
        )}
      </Button>
    </div>
  )
}
