"use client"

import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PDFUpload } from "./pdf-upload"
import { useRecetaForm } from "@/app/dashboard/_hooks/use-receta-form"

export function RecetaForm() {
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
  } = useRecetaForm()

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                placeholder="11 1234-5678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                className="w-full pl-14"
                disabled={enProceso || estado === "exito"}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Sin el 0 ni el 15. Ej: 11 1234-5678
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
                placeholder="2500"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-16"
                disabled={enProceso || estado === "exito"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Estado */}
      {estado === "exito" && (
        <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Link de pago enviado por WhatsApp. La receta se enviará automáticamente cuando el paciente pague.
        </div>
      )}

      {estado === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Botón */}
      {estado === "exito" ? (
        <Button onClick={reset} className="w-full" size="lg">
          Nueva Receta
        </Button>
      ) : (
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
      )}

    </div>
  )
}
