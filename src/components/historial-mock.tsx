"use client"

import { FileText, CheckCircle2, Clock, Send } from "lucide-react"
import { cn } from "@/lib/utils"

// Datos mock para el historial
const historialMock = [
  {
    id: "REC-001",
    paciente: "+54 11 5555-1234",
    monto: 2500,
    estado: "completado" as const,
    fecha: "Hoy, 14:32",
    receta: "Receta_Martinez_Juan.pdf",
  },
  {
    id: "REC-002",
    paciente: "+54 11 5555-5678",
    monto: 3000,
    estado: "esperando" as const,
    fecha: "Hoy, 13:15",
    receta: "Receta_Lopez_Maria.pdf",
  },
  {
    id: "REC-003",
    paciente: "+54 11 5555-9012",
    monto: 2500,
    estado: "completado" as const,
    fecha: "Ayer, 18:45",
    receta: "Receta_Garcia_Pedro.pdf",
  },
]

const estadoConfig = {
  completado: {
    label: "Enviada",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: "bg-success/10 text-success border-success/20",
  },
  esperando: {
    label: "Esperando pago",
    icon: <Clock className="h-3.5 w-3.5" />,
    className: "bg-warning/10 text-warning-foreground border-warning/20",
  },
  enviado: {
    label: "Link enviado",
    icon: <Send className="h-3.5 w-3.5" />,
    className: "bg-primary/10 text-primary border-primary/20",
  },
}

export function HistorialMock() {
  return (
    <div className="space-y-3">
      {historialMock.map((item) => {
        const config = estadoConfig[item.estado]
        return (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-card-foreground">
                {item.receta}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.paciente} · ${item.monto.toLocaleString("es-AR")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                  config.className
                )}
              >
                {config.icon}
                {config.label}
              </span>
              <span className="text-xs text-muted-foreground">{item.fecha}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
