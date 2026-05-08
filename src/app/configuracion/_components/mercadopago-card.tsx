"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import {
  Loader2, ExternalLink, Trash2, CheckCircle2,
  ChevronLeft, ChevronRight, MoreHorizontal, ShieldCheck, LayoutGrid, XCircle, Images,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { toast } from "sonner"
import { unlinkMpAction } from "@/app/configuracion/_actions/unlink-mp"

interface MercadoPagoCardProps {
  isLinked: boolean
}

// ─── Pasos del carousel de texto ──────────────────────────────────────────

const STEPS = [
  {
    icon: CheckCircle2,
    iconClass: "text-success",
    title: "¡Listo por nuestra parte!",
    body: "Eliminamos la vinculación con Recetar. Para completar el proceso, también tenés que quitarnos los permisos desde la app de MercadoPago.",
    tag: null,
  },
  {
    icon: MoreHorizontal,
    iconClass: "text-primary",
    title: "Paso 1 — Abrí MercadoPago",
    body: 'En la barra de navegación inferior, tocá el botón "Más" (esquina inferior derecha).',
    tag: "Más",
  },
  {
    icon: ShieldCheck,
    iconClass: "text-primary",
    title: "Paso 2 — Ingresá a Seguridad",
    body: 'En el menú que se abre, tocá la opción "Seguridad".',
    tag: "Seguridad",
  },
  {
    icon: LayoutGrid,
    iconClass: "text-primary",
    title: "Paso 3 — Aplicaciones conectadas",
    body: 'Bajá hasta la sección "Aplicaciones conectadas" y tocá para entrar.',
    tag: "Aplicaciones conectadas",
  },
  {
    icon: XCircle,
    iconClass: "text-destructive",
    title: "Paso 4 — Quitá los permisos",
    body: 'Buscá "Recetar" en la lista y tocá "Quitar permisos". ¡Listo!',
    tag: "Quitar permisos",
  },
]

// ─── Imágenes del carousel visual ─────────────────────────────────────────

const IMAGE_STEPS = [
  {
    src: "/mp-unlink-1-mas.jpg",
    caption: 'Paso 1 — Tocá "Más" en la barra inferior derecha, luego tocá "Seguridad".',
  },
  {
    src: "/mp-unlink-2-seguridad.jpg",
    caption: 'Paso 2 — Bajá hasta "Aplicaciones conectadas" y tocá para entrar.',
  },
  {
    src: "/mp-unlink-3-quitar-permisos.jpg",
    caption: 'Paso 3 — Buscá "Recetar" en la lista y tocá "Quitar permisos".',
  },
]

// ─── Dialog con imágenes ───────────────────────────────────────────────────

function ImageGuideDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  function handleSetApi(carouselApi: CarouselApi) {
    setApi(carouselApi)
    carouselApi?.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap())
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex flex-col gap-4 p-0 max-w-sm overflow-hidden rounded-2xl">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Cómo desvincular desde MercadoPago
          </DialogTitle>
        </DialogHeader>

        <Carousel setApi={handleSetApi} className="w-full">
          <CarouselContent>
            {IMAGE_STEPS.map((step, i) => (
              <CarouselItem key={i}>
                <div className="relative w-full" style={{ aspectRatio: "9/16", maxHeight: "60dvh" }}>
                  <Image
                    src={step.src}
                    alt={step.caption}
                    fill
                    className="object-contain"
                    sizes="384px"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Caption + controles */}
        <div className="flex flex-col gap-3 px-5 pb-5">
          <p className="text-sm text-muted-foreground text-center leading-relaxed min-h-[2.5rem]">
            {IMAGE_STEPS[current].caption}
          </p>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => api?.scrollPrev()}
              disabled={current === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1.5">
              {IMAGE_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current
                      ? "w-4 bg-primary"
                      : "w-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => api?.scrollNext()}
              disabled={current === IMAGE_STEPS.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Guía de texto + botón "Ver con imágenes" ─────────────────────────────

function UnlinkGuide() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [showImages, setShowImages] = useState(false)

  function handleSetApi(carouselApi: CarouselApi) {
    setApi(carouselApi)
    carouselApi?.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap())
    })
  }

  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Completá la desvinculación en MercadoPago
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowImages(true)}
        >
          <Images className="h-3.5 w-3.5" />
          Ver con imágenes
        </Button>
      </div>

      <Carousel setApi={handleSetApi} className="w-full">
        <CarouselContent>
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <CarouselItem key={i}>
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                      <Icon className={`h-4 w-4 ${step.iconClass}`} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  {step.tag && (
                    <div className="inline-flex self-start items-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                      {step.tag}
                    </div>
                  )}
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => api?.scrollPrev()}
          disabled={current === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => api?.scrollNext()}
          disabled={current === STEPS.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <ImageGuideDialog open={showImages} onClose={() => setShowImages(false)} />
    </div>
  )
}

// ─── Card principal ────────────────────────────────────────────────────────

export function MercadoPagoCard({ isLinked }: MercadoPagoCardProps) {
  const [isPending, startTransition] = useTransition()
  const [linked, setLinked] = useState(isLinked)
  const [showGuide, setShowGuide] = useState(!isLinked)

  async function handleUnlink() {
    startTransition(async () => {
      const result = await unlinkMpAction()
      if (result.success) {
        setLinked(false)
        setShowGuide(true)
        toast.success("MercadoPago desvinculado")
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
                {isPending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Trash2 className="h-4 w-4" />Desvincular</>}
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

      {showGuide && <UnlinkGuide />}
    </div>
  )
}
