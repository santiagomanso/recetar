import { FileText, CheckCircle2, Clock, Send, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getDeliveriesByDoctor } from "@/services/deliveries"
import { format, isToday, isYesterday } from "date-fns"
import { ResendButton } from "@/app/dashboard/_components/resend-button"

const statusConfig = {
  PENDING_PAYMENT: {
    label: "Esperando pago",
    icon: <Clock className="h-3.5 w-3.5" />,
    className: "bg-warning/10 text-warning-foreground border-warning/20",
  },
  PAID: {
    label: "Pagada",
    icon: <Send className="h-3.5 w-3.5" />,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  SENT: {
    label: "Enviada",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: "bg-success/10 text-success border-success/20",
  },
  FAILED: {
    label: "Error",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

function formatDate(date: Date): string {
  if (isToday(date)) return `Hoy, ${format(date, "HH:mm")}`
  if (isYesterday(date)) return `Ayer, ${format(date, "HH:mm")}`
  return format(date, "dd/MM HH:mm")
}

function formatPhone(phone: string): string {
  // patientPhone is stored as "549XXXXXXXXXX" — strip leading 54
  return phone.startsWith("54") ? phone.slice(2) : phone
}

interface HistorialProps {
  doctorId: string
}

export async function Historial({ doctorId }: HistorialProps) {
  const deliveries = await getDeliveriesByDoctor(doctorId)

  if (deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">Todavía no enviaste ninguna receta.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {deliveries.map((delivery) => {
        const config = statusConfig[delivery.status]
        const displayName = delivery.pdfName ?? `receta-${delivery.id.slice(-6)}`
        const phone = formatPhone(delivery.patientPhone)
        const amount = Number(delivery.amount)

        return (
          <div
            key={delivery.id}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-card-foreground">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground">
                {phone} · ${amount.toLocaleString("es-AR")}
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
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatDate(delivery.createdAt)}
                </span>
                {delivery.status === "PENDING_PAYMENT" && (
                  <ResendButton deliveryId={delivery.id} />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
