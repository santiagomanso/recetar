"use client"

import { X, FileText } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer"
import { PdfViewer } from "@/app/dashboard/_components/pdf-viewer"

interface PdfPreviewModalProps {
  file: File | null
  open: boolean
  onClose: () => void
}

export function PdfPreviewModal({ file, open, onClose }: PdfPreviewModalProps) {
  const isMobile = useIsMobile()

  if (!file) return null

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(v) => !v && onClose()} dismissible={false}>
        <DrawerContent className="flex h-[96dvh] flex-col" style={{ userSelect: "none" }}>
          {/* handle oculto — el drawer no se puede arrastrar para cerrar */}
          <div className="sr-only" data-vaul-no-drag />
          <DrawerTitle className="sr-only">{file.name}</DrawerTitle>
          <div className="flex shrink-0 flex-row items-center justify-between border-b border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate text-sm font-medium text-foreground">
                {file.name}
              </span>
            </div>
            <DrawerClose asChild>
              <button
                onClick={onClose}
                className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </DrawerClose>
          </div>
          <div className="min-h-0 flex-1">
            <PdfViewer file={file} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex h-[85dvh] max-w-3xl flex-col gap-0 p-0">
        <DialogHeader className="flex shrink-0 flex-row items-center gap-2 border-b border-border px-5 py-3">
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <DialogTitle className="truncate text-sm font-medium text-foreground">
            {file.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Vista previa de {file.name}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1">
          <PdfViewer file={file} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
