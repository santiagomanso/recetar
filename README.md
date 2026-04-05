# RecetaMed

Plataforma SaaS para médicos argentinos que automatiza el cobro y la entrega de recetas médicas y pedidos de estudios complementarios via MercadoPago + WhatsApp.

---

## El problema que resuelve

Un médico emite una receta en la app gubernamental del Ministerio de Salud (genera un PDF). Hoy tiene que cobrar manualmente, luego acordarse de mandar la receta. Con RecetaMed:

1. El médico sube el PDF + número de WhatsApp del paciente + monto
2. La app genera un link de pago de MercadoPago (vinculado a la cuenta del médico)
3. Envía ese link al paciente por WhatsApp (template aprobado)
4. El paciente paga → MercadoPago dispara un webhook → la app detecta el pago y envía el PDF por WhatsApp automáticamente

El médico solo hace 3 cosas: subir PDF, ingresar teléfono, presionar enviar.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| Estilos | TailwindCSS v4, shadcn/ui, Radix UI |
| Animaciones | Framer Motion |
| Estado cliente | Zustand v5 |
| Auth | AuthJS (email + contraseña, aprobación manual por admin) |
| Base de datos | Prisma 7 + PostgreSQL (Neon) |
| Storage PDFs | Supabase Storage |
| Pagos | MercadoPago Checkout Pro (OAuth por médico) |
| Mensajería | Meta Business API (WhatsApp templates) |
| Deploy | Vercel |
| Package manager | pnpm |

---

## Flujo completo

```
Médico
  ↓ selecciona tipo (Receta / Estudios)
  ↓ sube PDF + teléfono + monto
  ↓ presiona "Enviar Link de Pago"

App
  → sube PDF a Supabase Storage (URL firmada, privada)
  → crea Preferencia en MercadoPago con token OAuth del médico
  → envía template de WhatsApp al paciente con link de pago
  → guarda Envio en DB con status PENDING_PAYMENT

Paciente
  → recibe WhatsApp con link
  → paga en MercadoPago Checkout Pro
  → el dinero va DIRECTO a la cuenta del médico

MercadoPago
  → dispara webhook a /api/webhooks/mercadopago
  → app verifica pago, actualiza status → PAID

App
  → envía PDF por WhatsApp al paciente (template de documento)
  → actualiza status → SENT
```

---

## Modelo de datos (Prisma)

```prisma
model User {
  id               String   @id @default(cuid())
  name             String
  email            String   @unique
  password         String   // bcrypt hash
  specialty        String?
  status           UserStatus @default(PENDING)  // PENDING | APPROVED | REJECTED
  mpAccessToken    String?  // OAuth MercadoPago
  mpRefreshToken   String?
  mpUserId         String?
  config           DoctorConfig?
  envios           Envio[]
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model DoctorConfig {
  id            String  @id @default(cuid())
  doctorId      String  @unique
  doctor        User    @relation(fields: [doctorId], references: [id])
  defaultAmount Float?  // monto sugerido por defecto
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Envio {
  id              String     @id @default(cuid())
  doctorId        String
  doctor          User       @relation(fields: [doctorId], references: [id])
  tipo            EnvioTipo  // RECETA | ESTUDIOS
  pdfUrl          String     // URL de Supabase Storage
  pdfKey          String     // key para eliminación
  patientPhone    String     // formato: 5491112345678
  amount          Float
  status          EnvioStatus @default(PENDING_PAYMENT)
  waChatbotState  WaChatbotState @default(IDLE)
  mpPreferenceId  String?
  mpPaymentId     String?
  createdAt       DateTime   @default(now())
  paidAt          DateTime?
  sentAt          DateTime?
  waMessages      WaMessage[]
}

model WaMessage {
  id          String        @id @default(cuid())
  envioId     String
  envio       Envio         @relation(fields: [envioId], references: [id])
  direction   WaDirection   // INBOUND | OUTBOUND
  content     String
  waMessageId String?
  createdAt   DateTime      @default(now())
}

enum UserStatus       { PENDING APPROVED REJECTED }
enum EnvioTipo        { RECETA ESTUDIOS }
enum EnvioStatus      { PENDING_PAYMENT PAID SENT FAILED }
enum WaChatbotState   { IDLE LINK_SENT PAYMENT_CONFIRMED PDF_SENT }
enum WaDirection      { INBOUND OUTBOUND }
```

---

## Rutas

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Landing page |
| `/login` | Inicio de sesión |
| `/register` | Registro (queda en PENDING hasta aprobación) |

### Privadas — Doctor (requiere sesión + status APPROVED)
| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Panel principal: selector de tipo + formulario + historial reciente |
| `/dashboard/historial` | Historial completo con filtros |
| `/dashboard/configuracion` | Perfil + conectar/desconectar MercadoPago |
| `/onboarding` | Wizard post-aprobación: tutorial + conexión MP |

### Admin (solo el dueño de la plataforma)
| Ruta | Descripción |
|------|-------------|
| `/admin` | Aprobar/rechazar médicos pendientes |

### API
| Ruta | Descripción |
|------|-------------|
| `/api/auth/[...nextauth]` | AuthJS handlers |
| `/api/webhooks/mercadopago` | Webhook de pago (dispara envío de PDF) |
| `/api/mp/oauth/callback` | Callback OAuth de MercadoPago |

---

## Onboarding para médicos

El wizard de onboarding está diseñado para usuarios no técnicos (médicos mayores). Incluye:

1. **Bienvenida** — explica qué es la app en lenguaje simple
2. **Video tutorial** — embed de YouTube con instrucciones grabadas por el dueño
3. **Conectar MercadoPago** — botón OAuth con explicación paso a paso
4. **Listo** — confirmación y acceso al dashboard

---

## Design System

Ver `app/globals.css` para la definición completa de tokens CSS.

### Paleta — Slate Neutro + Amber Accent

| Token Tailwind | Light | Dark | Uso |
|---------------|-------|------|-----|
| `bg-background` | #e2e8f0 (slate-200) | #0b0f1a | Fondo de página |
| `bg-card` | #ffffff | #1e293b | Cards y paneles |
| `bg-muted` | #f1f5f9 (slate-100) | #334155 | Inputs, chips |
| `text-foreground` | #0f172a | #f1f5f9 | Texto principal |
| `text-muted-foreground` | #64748b | #94a3b8 | Texto secundario |
| `bg-primary` | #334155 (slate-700) | #94a3b8 | Botones, íconos activos |
| `bg-accent` | #f59e0b (amber-500) | **#f59e0b** | Accent (igual en ambos modos) |
| `border-border` | #cbd5e1 (slate-300) | #334155 | Bordes de cards e inputs |

### Escala tipográfica (diseñada para legibilidad médica)

| Clase Tailwind | Tamaño | Uso |
|---------------|--------|-----|
| `text-xs` | 12px | Metadata, timestamps, hints |
| `text-sm` | 14px | Labels, nav links, badges |
| `text-lg` | 18px | Títulos de card |
| `text-xl` | 20px | Headings de sección |
| `text-2xl` | 24px | Títulos de página (mobile) |
| `text-3xl` | 30px | Títulos de página (desktop, h1) |

> ⚠ **Nunca usar `text-base`** en este proyecto — resuelve a color, no tamaño (ver CLAUDE.md).

### Border radius

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-md` | 8px | Inputs, botones |
| `rounded-lg` | 10px | Cards pequeñas, badges |
| `rounded-xl` | 14px | Cards principales |

---

## Arquitectura de código

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   ├── _actions/          ← Server Actions (thin wrappers)
│   ├── _components/       ← Componentes del dashboard
│   ├── historial/page.tsx
│   └── configuracion/page.tsx
├── onboarding/
│   └── _components/       ← Wizard de onboarding
├── admin/
│   ├── _actions/
│   └── _components/
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── webhooks/mercadopago/route.ts
    └── mp/oauth/callback/route.ts

services/
├── envios.ts        ← lógica de recetas/estudios
├── payments.ts      ← MercadoPago API
├── whatsapp.ts      ← Meta Business API
├── storage.ts       ← Supabase Storage
└── users.ts         ← gestión de usuarios/auth

types/
├── envio.ts
└── user.ts
```

---

## Variables de entorno necesarias

```env
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# DB
DATABASE_URL=           # Neon PostgreSQL

# Supabase Storage
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_BUCKET=recetas

# MercadoPago
MP_CLIENT_ID=
MP_CLIENT_SECRET=
MP_REDIRECT_URI=        # /api/mp/oauth/callback

# WhatsApp (Meta Business API)
WA_PHONE_NUMBER_ID=
WA_ACCESS_TOKEN=
WA_TEMPLATE_PAYMENT=    # nombre del template de link de pago
WA_TEMPLATE_PDF=        # nombre del template de entrega de PDF

# Admin
ADMIN_EMAIL=            # único email que puede acceder a /admin
```

---

## Git — regla para el agente

El agente **nunca ejecuta comandos git**. Siempre presenta el comando para que el usuario lo ejecute. Esto incluye init, add, commit, push, branch, config y cualquier otro subcomando.

## Correr en desarrollo

```bash
pnpm install
pnpm dev
```

---

## Para el LLM que lea este archivo

Este proyecto tiene una base mock funcional (auth simulado, flujos simulados). La implementación real se hace **módulo por módulo**, nunca toda la app de un tirón. El orden sugerido:

1. Design system (globals.css) ✅
2. Auth real (AuthJS + Prisma)
3. Dashboard real (reemplazar mocks)
4. Supabase Storage (upload PDF)
5. MercadoPago OAuth + Checkout Pro
6. Webhook MercadoPago
7. WhatsApp API (templates)
8. Admin panel
9. Onboarding wizard
10. Historial completo

Antes de tocar cualquier archivo, leer CLAUDE.md para las convenciones del proyecto.
