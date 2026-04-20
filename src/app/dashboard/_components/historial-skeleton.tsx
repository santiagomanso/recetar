export function HistorialSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          {/* Icono */}
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-muted" />

          {/* Texto */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>

          {/* Badge + fecha */}
          <div className="flex flex-col items-end gap-2">
            <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
