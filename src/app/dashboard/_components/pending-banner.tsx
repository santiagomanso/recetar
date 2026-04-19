import { Clock } from "lucide-react"

export function PendingBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-accent bg-accent/10 p-4">
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
      <div>
        <p className="text-sm font-medium text-foreground">
          Tu cuenta está en revisión
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Podés completar tu perfil y explorar el panel, pero el envío de
          recetas estará disponible una vez que el administrador apruebe tu
          cuenta.
        </p>
      </div>
    </div>
  )
}
