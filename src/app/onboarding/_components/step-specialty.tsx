"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import { Check, ChevronsUpDown, Stethoscope } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const ESPECIALIDADES_MEDICAS = [
  "Alergia e Inmunología",
  "Anatomía Patológica",
  "Anestesiología",
  "Angiología General y Hemodinamia",
  "Cardiología",
  "Cardiólogo Infantil",
  "Cirugía General",
  "Cirugía Cardiovascular",
  "Cirugía de Cabeza y Cuello",
  "Cirugía de Tórax",
  "Cirugía Infantil (Pediátrica)",
  "Cirugía Plástica y Reparadora",
  "Cirugía Vascular Periférica",
  "Clínica Médica",
  "Coloproctología",
  "Dermatología",
  "Diagnóstico por Imágenes",
  "Endocrinología",
  "Endocrinólogo Infantil",
  "Farmacología Clínica",
  "Fisiatría",
  "Gastroenterología",
  "Gastroenterólogo Infantil",
  "Genética Médica",
  "Geriatría",
  "Ginecología",
  "Hematología",
  "Hematólogo Infantil",
  "Hemoterapia e Inmunohematología",
  "Infectología",
  "Infectólogo Infantil",
  "Medicina del Deporte",
  "Medicina General y/o Medicina de Familia",
  "Medicina Legal",
  "Medicina Nuclear",
  "Medicina del Trabajo",
  "Nefrología",
  "Nefrólogo Infantil",
  "Neonatología",
  "Neumonología",
  "Neumonólogo Infantil",
  "Neurocirugía",
  "Neurología",
  "Neurólogo Infantil",
  "Nutrición",
  "Obstetricia",
  "Oftalmología",
  "Oncología",
  "Oncólogo Infantil",
  "Ortopedia y Traumatología",
  "Otorrinolaringología",
  "Pediatría",
  "Psiquiatría",
  "Psiquiatría Infanto Juvenil",
  "Radioterapia o Terapia Radiante",
  "Reumatología",
  "Reumatólogo Infantil",
  "Terapia Intensiva",
  "Terapista Intensivo Infantil",
  "Tocoginecología",
  "Toxicología",
  "Urología",
]

const ESPECIALIDADES_ODONTOLOGICAS = [
  "Cirugía y Traumatología Bucomaxilofacial",
  "Periodoncia",
  "Endodoncia",
  "Odontopediatría",
  "Diagnóstico por Imágenes Bucomaxilofacial",
  "Clínica Bucomaxilofacial",
  "Prótesis Dento Buco Maxilar",
  "Odontología Legal",
  "Ortodoncia y Ortopedia Maxilar",
]

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
}

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

interface StepSpecialtyProps {
  value: string
  onChange: (value: string) => void
}

export function StepSpecialty({ value, onChange }: StepSpecialtyProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="py-2">
      <motion.div
        custom={0}
        variants={item}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary">
          <Stethoscope className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">Tu especialidad</h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            opcional
          </span>
        </div>
      </motion.div>

      <motion.p
        custom={1}
        variants={item}
        initial="hidden"
        animate="visible"
        className="mt-2 text-sm text-muted-foreground leading-relaxed"
      >
        Aparecerá en tus recetas. Si querés, podés completarlo más tarde desde
        tu perfil.
      </motion.p>

      <motion.div
        custom={2}
        variants={item}
        initial="hidden"
        animate="visible"
        className="mt-6 space-y-2"
      >
        <Label className="text-sm font-medium">Especialidad</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="h-12 w-full justify-between font-normal"
            >
              <span className={cn(!value && "text-muted-foreground")}>
                {value || "Buscar especialidad…"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command
              filter={(val, search) =>
                normalize(val).includes(normalize(search)) ? 1 : 0
              }
            >
              <CommandInput placeholder="Escribí para buscar…" />
              <CommandList>
                <CommandEmpty>No se encontró la especialidad.</CommandEmpty>
                <CommandGroup heading="Médicas">
                  {ESPECIALIDADES_MEDICAS.map((esp) => (
                    <CommandItem
                      key={esp}
                      value={esp}
                      onSelect={(current) => {
                        onChange(current === value ? "" : current)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === esp ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {esp}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Odontológicas">
                  {ESPECIALIDADES_ODONTOLOGICAS.map((esp) => (
                    <CommandItem
                      key={esp}
                      value={esp}
                      onSelect={(current) => {
                        onChange(current === value ? "" : current)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === esp ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {esp}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </motion.div>
    </div>
  )
}
