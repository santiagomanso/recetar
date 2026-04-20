"use client"

import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePrecioForm } from "@/app/configuracion/_hooks/use-precio-form"

interface PrecioCardProps {
  initialAmount: number | null
}

export function PrecioCard({ initialAmount }: PrecioCardProps) {
  const { amount, setAmount, isLoading, handleSave } = usePrecioForm(initialAmount)

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-card-foreground mb-1">Precio por defecto</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Este monto se pre-completa al enviar cada receta. Podés cambiarlo por envío.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">Monto en ARS</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-10 pl-7"
              placeholder="0.00"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando…</> : <><Save className="mr-2 h-4 w-4" />Guardar precio</>}
        </Button>
      </div>
    </div>
  )
}
