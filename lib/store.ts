// Tipos para la aplicación
export interface Receta {
  id: string
  pdfFile: File | null
  pdfName: string
  telefono: string
  monto: number
  estado: 'pendiente' | 'link_enviado' | 'pagado' | 'receta_enviada'
  fechaCreacion: Date
  linkPago?: string
}

// Simular base de datos en memoria (mock)
let recetas: Receta[] = []

export function crearReceta(data: {
  pdfFile: File
  telefono: string
  monto: number
}): Receta {
  const receta: Receta = {
    id: `REC-${Date.now()}`,
    pdfFile: data.pdfFile,
    pdfName: data.pdfFile.name,
    telefono: data.telefono,
    monto: data.monto,
    estado: 'pendiente',
    fechaCreacion: new Date(),
  }
  recetas.push(receta)
  return receta
}

export function obtenerRecetas(): Receta[] {
  return recetas
}

export function obtenerReceta(id: string): Receta | undefined {
  return recetas.find(r => r.id === id)
}

export function actualizarEstadoReceta(
  id: string,
  estado: Receta['estado'],
  linkPago?: string
): Receta | undefined {
  const receta = recetas.find(r => r.id === id)
  if (receta) {
    receta.estado = estado
    if (linkPago) receta.linkPago = linkPago
  }
  return receta
}

export function resetRecetas(): void {
  recetas = []
}
