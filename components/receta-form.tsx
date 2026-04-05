"use client"

import { useState } from "react"
import { Send, Loader2, CheckCircle2, Clock, CreditCard, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PDFUpload } from "./pdf-upload"
import { cn } from "@/lib/utils"

type Estado = 'idle' | 'enviando_link' | 'esperando_pago' | 'procesando_pago' | 'enviando_receta' | 'completado'

interface EstadoInfo {
  label: string
  icon: React.ReactNode
  color: string
}

const estadosInfo: Record<Estado, EstadoInfo> = {
  idle: { label: "Listo para enviar", icon: <Send className="h-4 w-4" />, color: "text-muted-foreground" },
  enviando_link: { label: "Enviando link de pago...", icon: <Loader2 className="h-4 w-4 animate-spin" />, color: "text-primary" },
  esperando_pago: { label: "Esperando pago del paciente...", icon: <Clock className="h-4 w-4" />, color: "text-warning-foreground bg-warning/20" },
  procesando_pago: { label: "Procesando pago (webhook)...", icon: <CreditCard className="h-4 w-4 animate-pulse" />, color: "text-primary" },
  enviando_receta: { label: "Enviando receta por WhatsApp...", icon: <MessageCircle className="h-4 w-4 animate-pulse" />, color: "text-accent" },
  completado: { label: "Receta enviada con éxito", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-accent" },
}

export function RecetaForm() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [telefono, setTelefono] = useState("")
  const [monto, setMonto] = useState("2500")
  const [estado, setEstado] = useState<Estado>("idle")
  const [logs, setLogs] = useState<string[]>([])

  const agregarLog = (mensaje: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${mensaje}`])
  }

  const simularFlujo = async () => {
    if (!pdfFile || !telefono) return

    // Limpiar logs anteriores
    setLogs([])

    // 1. Enviar link de pago
    setEstado("enviando_link")
    agregarLog("📤 Generando link de MercadoPago...")
    await delay(1500)
    const linkPago = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=MOCK_${Date.now()}`
    agregarLog(`✅ Link generado: ${linkPago}`)
    agregarLog(`📱 Enviando link por WhatsApp a +${telefono}...`)
    await delay(1000)
    agregarLog(`✅ Link enviado por WhatsApp`)

    // 2. Esperando pago
    setEstado("esperando_pago")
    agregarLog("⏳ Esperando que el paciente realice el pago...")
    await delay(3000) // Simular espera del pago

    // 3. Webhook recibido
    setEstado("procesando_pago")
    agregarLog("🔔 Webhook de MercadoPago recibido!")
    agregarLog("💳 Estado del pago: APROBADO")
    agregarLog(`💰 Monto recibido: $${monto} ARS`)
    await delay(1500)

    // 4. Enviar receta
    setEstado("enviando_receta")
    agregarLog(`📄 Preparando envío de receta: ${pdfFile.name}`)
    await delay(1000)
    agregarLog(`📱 Enviando receta por WhatsApp a +${telefono}...`)
    await delay(1500)
    agregarLog("✅ Receta enviada exitosamente!")

    // 5. Completado
    setEstado("completado")
    agregarLog("🎉 Proceso completado!")
  }

  const resetForm = () => {
    setPdfFile(null)
    setTelefono("")
    setMonto("2500")
    setEstado("idle")
    setLogs([])
  }

  const estadoActual = estadosInfo[estado]
  const puedeEnviar = pdfFile && telefono && estado === "idle"
  const enProceso = estado !== "idle" && estado !== "completado"

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

        <div className="space-y-2">
          <Label htmlFor="telefono" className="text-sm font-medium text-foreground">
            WhatsApp del Paciente
          </Label>
          <div className="flex gap-2">
            <div className="flex h-10 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              +54
            </div>
            <Input
              id="telefono"
              type="tel"
              placeholder="11 1234-5678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
              className="rounded-l-none"
              disabled={enProceso}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Número sin el 0 ni el 15. Ejemplo: 11 1234-5678
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monto" className="text-sm font-medium text-foreground">
            Monto a Cobrar
          </Label>
          <div className="flex gap-2">
            <div className="flex h-10 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              ARS $
            </div>
            <Input
              id="monto"
              type="number"
              placeholder="2500"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="rounded-l-none"
              disabled={enProceso}
            />
          </div>
        </div>
      </div>

      {/* Estado actual */}
      <div className={cn(
        "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium",
        estado === "completado" ? "border-accent/30 bg-accent/10" : "border-border bg-muted/30",
        estadoActual.color
      )}>
        {estadoActual.icon}
        {estadoActual.label}
      </div>

      {/* Botón de acción */}
      {estado === "completado" ? (
        <Button onClick={resetForm} className="w-full" size="lg">
          Nueva Receta
        </Button>
      ) : (
        <Button
          onClick={simularFlujo}
          disabled={!puedeEnviar || enProceso}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {enProceso ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar Link de Pago
            </>
          )}
        </Button>
      )}

      {/* Logs del proceso */}
      {logs.length > 0 && (
        <div className="rounded-lg border border-border bg-foreground/5 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Log del Proceso (Mock)
          </h4>
          <div className="space-y-1.5 font-mono text-xs">
            {logs.map((log, index) => (
              <p key={index} className="text-muted-foreground">
                {log}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
