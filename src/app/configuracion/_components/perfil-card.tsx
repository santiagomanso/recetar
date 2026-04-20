"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Command, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { usePerfilForm } from "@/app/configuracion/_hooks/use-perfil-form"
import { AvatarUpload } from "@/app/configuracion/_components/avatar-upload"

const ESPECIALIDADES_MEDICAS = [
  "Alergia e Inmunología","Anatomía Patológica","Anestesiología",
  "Angiología General y Hemodinamia","Cardiología","Cardiólogo Infantil",
  "Cirugía General","Cirugía Cardiovascular","Cirugía de Cabeza y Cuello",
  "Cirugía de Tórax","Cirugía Infantil (Pediátrica)","Cirugía Plástica y Reparadora",
  "Cirugía Vascular Periférica","Clínica Médica","Coloproctología","Dermatología",
  "Diagnóstico por Imágenes","Endocrinología","Endocrinólogo Infantil",
  "Farmacología Clínica","Fisiatría","Gastroenterología","Gastroenterólogo Infantil",
  "Genética Médica","Geriatría","Ginecología","Hematología","Hematólogo Infantil",
  "Hemoterapia e Inmunohematología","Infectología","Infectólogo Infantil",
  "Medicina del Deporte","Medicina General y/o Medicina de Familia","Medicina Legal",
  "Medicina Nuclear","Medicina del Trabajo","Nefrología","Nefrólogo Infantil",
  "Neonatología","Neumonología","Neumonólogo Infantil","Neurocirugía","Neurología",
  "Neurólogo Infantil","Nutrición","Obstetricia","Oftalmología","Oncología",
  "Oncólogo Infantil","Ortopedia y Traumatología","Otorrinolaringología","Pediatría",
  "Psiquiatría","Psiquiatría Infanto Juvenil","Radioterapia o Terapia Radiante",
  "Reumatología","Reumatólogo Infantil","Terapia Intensiva","Terapista Intensivo Infantil",
  "Tocoginecología","Toxicología","Urología",
]

const ESPECIALIDADES_ODONTOLOGICAS = [
  "Cirugía y Traumatología Bucomaxilofacial","Periodoncia","Endodoncia",
  "Odontopediatría","Diagnóstico por Imágenes Bucomaxilofacial","Clínica Bucomaxilofacial",
  "Prótesis Dento Buco Maxilar","Odontología Legal","Ortodoncia y Ortopedia Maxilar",
]

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

interface PerfilCardProps {
  initialSpecialty: string | null
  initialEmail: string
  initialTelephone: string | null
  initialImage: string | null
  userName: string
}

export function PerfilCard({
  initialSpecialty,
  initialEmail,
  initialTelephone,
  initialImage,
  userName,
}: PerfilCardProps) {
  const { specialty, setSpecialty, email, setEmail, telephone, setTelephone, isLoading, handleSave } =
    usePerfilForm({ specialty: initialSpecialty, email: initialEmail, telephone: initialTelephone })
  const [open, setOpen] = useState(false)

  return (
    <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-card-foreground mb-1">Perfil</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Estos datos aparecen en tus recetas y se usan para enviarte reportes.
      </p>

      <div className="space-y-5">
        {/* Avatar */}
        <AvatarUpload
          currentImage={initialImage}
          userName={userName}
          onUpdate={() => {}}
        />

        {/* Specialty */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Especialidad</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="h-10 w-full justify-between font-normal"
              >
                <span className={cn(!specialty && "text-muted-foreground")}>
                  {specialty || "Buscar especialidad…"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command filter={(val, search) => normalize(val).includes(normalize(search)) ? 1 : 0}>
                <CommandInput placeholder="Escribí para buscar…" />
                <CommandList>
                  <CommandEmpty>No se encontró la especialidad.</CommandEmpty>
                  <CommandGroup heading="Médicas">
                    {ESPECIALIDADES_MEDICAS.map((esp) => (
                      <CommandItem key={esp} value={esp} onSelect={(c) => { setSpecialty(c === specialty ? "" : c); setOpen(false) }}>
                        <Check className={cn("mr-2 h-4 w-4", specialty === esp ? "opacity-100" : "opacity-0")} />
                        {esp}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Odontológicas">
                    {ESPECIALIDADES_ODONTOLOGICAS.map((esp) => (
                      <CommandItem key={esp} value={esp} onSelect={(c) => { setSpecialty(c === specialty ? "" : c); setOpen(false) }}>
                        <Check className={cn("mr-2 h-4 w-4", specialty === esp ? "opacity-100" : "opacity-0")} />
                        {esp}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10"
            placeholder="tu@email.com"
          />
        </div>

        {/* Telephone */}
        <div className="space-y-2">
          <Label htmlFor="telephone" className="text-sm font-medium">Teléfono</Label>
          <Input
            id="telephone"
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="h-10"
            placeholder="Ej: 5493794000000"
          />
          <p className="text-xs text-muted-foreground">
            Incluí el código de país. Ej: 5493794000000
          </p>
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando…</> : <><Save className="mr-2 h-4 w-4" />Guardar cambios</>}
        </Button>
      </div>
    </div>
  )
}
