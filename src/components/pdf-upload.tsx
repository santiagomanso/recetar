"use client"

import { useCallback, useState } from "react"
import { FileText, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PDFUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

export function PDFUpload({ onFileSelect, selectedFile }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type === "application/pdf") {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.type === "application/pdf") {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const removeFile = useCallback(() => {
    onFileSelect(null)
  }, [onFileSelect])

  if (selectedFile) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-card-foreground">{selectedFile.name}</p>
          <p className="text-sm text-muted-foreground">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </p>
        </div>
        <button
          onClick={removeFile}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors sm:p-8",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Upload className="h-6 w-6 text-primary" />
      </div>
      <p className="mt-4 text-center font-medium text-foreground">
        Arrastrá el PDF de la receta aquí
      </p>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        o hacé clic para seleccionar
      </p>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileInput}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </div>
  )
}
