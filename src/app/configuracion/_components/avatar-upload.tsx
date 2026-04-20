// src/app/configuracion/_components/avatar-upload.tsx
"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Cropper from "react-easy-crop"
import type { Area } from "react-easy-crop"
import { Loader2, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { getCroppedImageBlob } from "@/lib/crop-image"
import { updateAvatarAction } from "@/app/configuracion/_actions/update-avatar"

interface AvatarUploadProps {
  currentImage: string | null
  userName: string
  onUpdate: (url: string) => void
}

export function AvatarUpload({ currentImage, userName, onUpdate }: AvatarUploadProps) {
  const router = useRouter()
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
    // Reset input so same file can be selected again
    e.target.value = ""
  }

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  async function handleConfirm() {
    if (!imageSrc || !croppedAreaPixels) return
    setIsUploading(true)
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels)
      const formData = new FormData()
      formData.append("avatar", blob, "avatar.jpg")
      const result = await updateAvatarAction(formData)
      if (result.success) {
        setPreviewImage(result.url)
        onUpdate(result.url)
        toast.success("Foto de perfil actualizada")
        setImageSrc(null)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Error procesando la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-20 w-20 overflow-hidden rounded-full border-2 border-border bg-muted transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Cambiar foto de perfil"
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt={userName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-muted-foreground">
              {initials}
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-5 w-5 text-white" />
          </div>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Cambiar foto
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Dialog open={!!imageSrc} onOpenChange={(open) => !open && setImageSrc(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Ajustar foto de perfil</DialogTitle>
          </DialogHeader>

          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Zoom</p>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImageSrc(null)} disabled={isUploading}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={isUploading}>
              {isUploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Subiendo…</>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
