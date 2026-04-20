// src/lib/crop-image.ts
export interface PixelCrop {
  x: number
  y: number
  width: number
  height: number
}

export async function getCroppedImageBlob(
  imageSrc: string,
  pixelCrop: PixelCrop,
  outputSize = 256
): Promise<Blob> {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = outputSize
  canvas.height = outputSize
  const ctx = canvas.getContext("2d")!

  // Draw circular clip
  ctx.beginPath()
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
  ctx.clip()

  // Scale from crop area to output size
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Canvas toBlob failed"))
      },
      "image/jpeg",
      0.9
    )
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.crossOrigin = "anonymous"
    img.src = src
  })
}
