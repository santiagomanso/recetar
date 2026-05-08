"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  FileText,
  Eye,
  Trash2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FilePlus2,
  Upload,
} from "lucide-react"
import { AsYouType } from "libphonenumber-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDashboardRefresh } from "@/app/dashboard/_components/dashboard-refresh-context"
import {
  useMultiRecetaForm,
  type PdfSlot,
} from "@/app/dashboard/_hooks/use-multi-receta-form"
import { PdfPreviewModal } from "@/app/dashboard/_components/pdf-preview-modal"

// ─── Slot individual — componente aislado para no re-renderizar el padre ───

function PdfSlotItem({
  slot,
  index,
  total,
  onFileSelect,
  onRemove,
  onPreview,
  disabled,
}: {
  slot: PdfSlot
  index: number
  total: number
  onFileSelect: (id: string, file: File) => void
  onRemove: (id: string) => void
  onPreview: (file: File) => void
  disabled: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && (file.type === "application/pdf" || file.name.endsWith(".pdf"))) {
      onFileSelect(slot.id, file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(slot.id, file)
  }

  const canRemove = total > 1 || slot.file !== null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      {slot.file ? (
        /* ── Estado: PDF cargado ── */
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {slot.file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(slot.file.size / 1024).toFixed(0)} KB
              {total > 1 && (
                <span className="ml-2 font-medium text-primary/70">
                  Receta {index + 1}/{total}
                </span>
              )}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <motion.button
              type="button"
              onClick={() => onPreview(slot.file!)}
              whileTap={{ scale: 0.92 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Previsualizar"
            >
              <Eye className="h-4 w-4" />
            </motion.button>
            {canRemove && (
              <motion.button
                type="button"
                onClick={() => onRemove(slot.id)}
                whileTap={{ scale: 0.92 }}
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none"
                title="Quitar receta"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        /* ── Estado: slot vacío — zona de drop ── */
        <motion.button
          type="button"
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          disabled={disabled}
          whileHover={disabled ? {} : { scale: 1.005 }}
          whileTap={disabled ? {} : { scale: 0.995 }}
          className="group flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 px-4 py-6 transition-colors hover:border-primary/40 hover:bg-muted/70 disabled:pointer-events-none disabled:opacity-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
            <Upload className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
            Arrastrá o elegí un PDF
          </span>
        </motion.button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handleChange}
      />
    </motion.div>
  )
}

// ─── Botón para agregar otro slot — abre file picker directamente ─────────

function AddSlotButton({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    // reset para permitir seleccionar el mismo archivo de nuevo
    e.target.value = ""
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 32, delay: 0.05 }}
    >
      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Upload className="h-4 w-4 transition-transform group-hover:scale-110" />
        Agregar otra receta
      </motion.button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handleChange}
      />
    </motion.div>
  )
}

// ─── Formulario principal ─────────────────────────────────────────────────

export function MultiRecetaForm({ initialMonto }: { initialMonto: number }) {
  const { refresh } = useDashboardRefresh()
  const phoneFormatter = useRef(new AsYouType("AR"))
  const [previewFile, setPreviewFile] = useState<File | null>(null)

  const {
    slots,
    addSlotWithFile,
    removeSlot,
    updateSlot,
    telefono,
    setTelefono,
    monto,
    setMonto,
    estado,
    errorMsg,
    puedeEnviar,
    enProceso,
    canAddMore,
    pdfsLoaded,
    handleEnviar,
    reset,
  } = useMultiRecetaForm(initialMonto)

  if (estado === "exito") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="flex flex-col items-center gap-6 py-6 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">
            {pdfsLoaded > 1 ? `${pdfsLoaded} recetas enviadas` : "¡Link enviado!"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            El paciente recibirá{" "}
            {pdfsLoaded > 1 ? "las recetas" : "la receta"} por WhatsApp una
            vez que pague.
          </p>
        </div>
        <Button onClick={() => { reset(); refresh() }} className="w-full" size="lg">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Nueva Receta
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-5">
      {/* ── Slots de PDF ── */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Receta{slots.length > 1 ? "s" : ""} Médica{slots.length > 1 ? "s" : ""} (PDF)
        </Label>

        <motion.div layout className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {slots.map((slot, i) => (
              <PdfSlotItem
                key={slot.id}
                slot={slot}
                index={i}
                total={slots.filter((s) => s.file).length}
                onFileSelect={updateSlot}
                onRemove={removeSlot}
                onPreview={setPreviewFile}
                disabled={enProceso}
              />
            ))}

            {canAddMore && (
              <AddSlotButton key="add-btn" onFile={addSlotWithFile} />
            )}
          </AnimatePresence>
        </motion.div>

        {pdfsLoaded > 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground"
          >
            Se enviarán {pdfsLoaded} mensajes numerados al paciente tras el pago.
          </motion.p>
        )}
      </div>

      {/* ── Teléfono + Monto ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[11fr_9fr] lg:grid-cols-2">
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
              placeholder="9 11 1234-5678"
              value={telefono}
              onChange={(e) => {
                phoneFormatter.current.reset()
                const formatted = phoneFormatter.current.input(
                  e.target.value.replace(/\D/g, "")
                )
                setTelefono(formatted)
              }}
              className="w-full pl-14"
              maxLength={16}
              disabled={enProceso}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Sin el 0 ni el 15. Ej: 9 11 1234-5678
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monto" className="text-sm font-medium text-foreground">
            Monto Total a Cobrar
          </Label>
          <div className="relative w-full">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              ARS $
            </span>
            <Input
              id="monto"
              type="number"
              placeholder="5000"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full pl-[4.5rem]"
              disabled={enProceso}
            />
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      <AnimatePresence>
        {estado === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit ── */}
      <motion.div whileTap={puedeEnviar ? { scale: 0.99 } : {}}>
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
              Enviar link de pago
            </>
          )}
        </Button>
      </motion.div>

      <PdfPreviewModal
        file={previewFile}
        open={previewFile !== null}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  )
}
