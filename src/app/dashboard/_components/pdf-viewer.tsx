"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, AlertCircle } from "lucide-react"

interface PdfViewerProps {
  file: File
}

// ─── Pinch-zoom + pan ─────────────────────────────────────────────────────────
// transform-origin: 0 0 → la matemática es directa.
// Estado: { scale, tx, ty } — translate primero, scale después.
// Un dedo cuando scale > 1: pan libre. Dos dedos: zoom al midpoint.

function usePinchZoom(outerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = outerRef.current as HTMLDivElement
    if (!el) return
    const inner = el.querySelector<HTMLElement>("[data-zoom-inner]") as HTMLElement
    if (!inner) return

    let scale = 1
    let tx = 0
    let ty = 0

    // Pinch
    let pinchStartDist = 0
    let pinchStartScale = 1
    let pinchStartTx = 0
    let pinchStartTy = 0
    let pinchMidEl = { x: 0, y: 0 }   // midpoint en coords del outer el

    // Pan / scroll (un dedo)
    let panStartX = 0
    let panStartY = 0
    let panStartTx = 0
    let panStartTy = 0
    let panStartScrollTop = 0
    let isPanning = false

    function apply(animated = false) {
      if (animated) inner.style.transition = "transform 0.2s ease"
      inner.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`
      if (animated) requestAnimationFrame(() => { inner.style.transition = "" })
    }

    function clampX() {
      // El contenido a escala `scale` tiene ancho = el.clientWidth * scale
      // tx debe estar entre (el.clientWidth - el.clientWidth*scale) y 0
      const minTx = el.clientWidth * (1 - scale)
      tx = Math.min(0, Math.max(minTx, tx))
    }

    function getTouchDist(t: TouchList) {
      const dx = t[0].clientX - t[1].clientX
      const dy = t[0].clientY - t[1].clientY
      return Math.hypot(dx, dy)
    }

    function getTouchMidEl(t: TouchList) {
      const rect = el.getBoundingClientRect()
      return {
        x: (t[0].clientX + t[1].clientX) / 2 - rect.left,
        y: (t[0].clientY + t[1].clientY) / 2 - rect.top,
      }
    }

    function onTouchStart(e: TouchEvent) {
      // stopPropagation: vaul usa pointer events pero algunos browsers mapean
      // touch→pointer; cortamos la cadena para evitar que el drawer reciba el gesto.
      e.stopPropagation()

      if (e.touches.length === 2) {
        // preventDefault: impide que el browser haga pinch-zoom nativo, lo cual
        // cambia el Visual Viewport y dispara el resize listener de vaul.
        e.preventDefault()
        isPanning = false
        pinchStartDist = getTouchDist(e.touches)
        pinchStartScale = scale
        pinchStartTx = tx
        pinchStartTy = ty
        pinchMidEl = getTouchMidEl(e.touches)
      } else if (e.touches.length === 1) {
        e.preventDefault()
        isPanning = true
        panStartX = e.touches[0].clientX
        panStartY = e.touches[0].clientY
        panStartTx = tx
        panStartTy = ty
        panStartScrollTop = el.scrollTop
      }
    }

    function onTouchMove(e: TouchEvent) {
      e.stopPropagation()

      if (e.touches.length === 2) {
        e.preventDefault()
        const newDist = getTouchDist(e.touches)
        const newMid = getTouchMidEl(e.touches)

        // Escala relativa al inicio del pinch (no al frame anterior — más estable)
        const newScale = Math.min(4, Math.max(1, pinchStartScale * (newDist / pinchStartDist)))

        // Matemática zoom-to-point con transform-origin 0 0:
        // El punto de contenido bajo el midpoint inicial debe seguir bajo el midpoint actual.
        // Punto de contenido (invariante): cx = (pinchMidEl.x - pinchStartTx) / pinchStartScale
        // newTx = newMid.x - cx * newScale
        const cx = (pinchMidEl.x - pinchStartTx) / pinchStartScale
        const cy = (pinchMidEl.y - pinchStartTy) / pinchStartScale

        scale = newScale
        tx = newMid.x - cx * newScale
        ty = newMid.y - cy * newScale

        clampX()
        apply()

      } else if (e.touches.length === 1 && isPanning) {
        e.preventDefault()
        const deltaX = e.touches[0].clientX - panStartX
        const deltaY = e.touches[0].clientY - panStartY

        if (scale > 1) {
          // Con zoom activo: mover el contenido (pan)
          tx = panStartTx + deltaX
          ty = panStartTy + deltaY
          clampX()
          apply()
        } else {
          // Sin zoom: scroll manual del contenedor.
          // touch-action:none bloquea el scroll nativo del browser,
          // así que lo replicamos vía scrollTop para que vaul nunca vea el gesto.
          el.scrollTop = panStartScrollTop - deltaY
        }
      }
    }

    function onTouchEnd(e: TouchEvent) {
      e.stopPropagation()
      if (e.touches.length < 2) {
        if (scale <= 1) {
          scale = 1; tx = 0; ty = 0
          apply(true)
        }
      }
      if (e.touches.length === 0) {
        isPanning = false
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: false })
    el.addEventListener("touchmove",  onTouchMove,  { passive: false })
    el.addEventListener("touchend",   onTouchEnd)

    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove",  onTouchMove)
      el.removeEventListener("touchend",   onTouchEnd)
    }
  }, [outerRef])
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function PdfViewer({ file }: PdfViewerProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")

  usePinchZoom(outerRef)

  useEffect(() => {
    if (!file) return

    let cancelled = false
    const url = URL.createObjectURL(file)

    async function render() {
      try {
        setStatus("loading")

        const pdfjsLib = await import("pdfjs-dist")
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString()

        const pdf = await pdfjsLib.getDocument(url).promise
        if (cancelled) return

        const container = canvasContainerRef.current
        if (!container) return
        container.innerHTML = ""

        const devicePixelRatio = window.devicePixelRatio || 1
        const containerWidth = outerRef.current?.clientWidth ?? 340

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) break
          const page = await pdf.getPage(pageNum)
          const base = page.getViewport({ scale: 1 })
          const scale = (containerWidth / base.width) * devicePixelRatio
          const viewport = page.getViewport({ scale })

          const canvas = document.createElement("canvas")
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width  = `${viewport.width  / devicePixelRatio}px`
          canvas.style.height = `${viewport.height / devicePixelRatio}px`
          canvas.style.display = "block"
          canvas.style.marginBottom = pageNum < pdf.numPages ? "8px" : "0"
          canvas.style.borderRadius = "6px"

          const ctx = canvas.getContext("2d")!
          await page.render({ canvasContext: ctx, viewport, canvas }).promise
          if (!cancelled) container.appendChild(canvas)
        }

        if (!cancelled) setStatus("done")
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : "Error al cargar el PDF")
          setStatus("error")
        }
      } finally {
        URL.revokeObjectURL(url)
      }
    }

    render()
    return () => { cancelled = true; URL.revokeObjectURL(url) }
  }, [file])

  return (
    <div
      ref={outerRef}
      data-vaul-no-drag
      className="relative h-full w-full overflow-y-auto overflow-x-hidden"
      style={{ touchAction: "none" }}
    >
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando PDF...</p>
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
          <AlertCircle className="h-7 w-7 text-destructive" />
          <p className="text-sm text-destructive">{errorMsg}</p>
        </div>
      )}

      <div
        data-zoom-inner
        style={{ transformOrigin: "0 0", willChange: "transform" }}
      >
        <div ref={canvasContainerRef} className="p-2" />
      </div>
    </div>
  )
}
