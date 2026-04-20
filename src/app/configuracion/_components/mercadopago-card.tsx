"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { unlinkMpAction } from "@/app/configuracion/_actions/unlink-mp"

interface MercadoPagoCardProps {
  isLinked: boolean
}

export function MercadoPagoCard({ isLinked }: MercadoPagoCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [linked, setLinked] = useState(isLinked)

  async function handleUnlink() {
    startTransition(async () => {
      const result = await unlinkMpAction()
      if (result.success) {
        setLinked(false)
        toast.success("MercadoPago desvinculado")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-card-foreground mb-1">MercadoPago</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Tu cuenta de MercadoPago recibe los pagos de tus pacientes directamente.
      </p>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {linked ? (
            <Badge variant="default" className="bg-success text-success-foreground gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success-foreground" />
              Vinculado
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              No vinculado
            </Badge>
          )}
        </div>

        {linked ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" disabled={isPending} className="gap-2">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="h-4 w-4" />Desvincular</>}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Desvincular MercadoPago?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tus pacientes no podrán pagar hasta que vuelvas a vincular tu cuenta.
                  El historial de recetas no se borra.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleUnlink} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Sí, desvincular
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button asChild size="sm" className="gap-2">
            <a href="/api/mercadopago/connect">
              <ExternalLink className="h-4 w-4" />
              Vincular cuenta
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
