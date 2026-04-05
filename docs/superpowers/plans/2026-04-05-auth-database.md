# Auth + Database — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el sistema de auth mock por AuthJS v5 real con email+contraseña, Prisma + Neon como base de datos, y protección de rutas por middleware.

**Architecture:** AuthJS v5 (beta) corre sobre Next.js App Router con un `Credentials` provider. Las contraseñas se hashean con bcrypt. La DB usa Prisma 7 + PostgreSQL (Neon). El middleware de Next.js protege todas las rutas privadas. El flujo de aprobación: los médicos se registran con status `PENDING`, el admin los aprueba desde `/admin`, y solo los `APPROVED` pueden acceder al dashboard.

**Tech Stack:** next-auth@beta, @auth/prisma-adapter, prisma@7, @prisma/client, bcryptjs, Neon PostgreSQL, Next.js middleware

---

## Archivos involucrados

| Acción | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Crear | `prisma/schema.prisma` | Schema completo del dominio |
| Crear | `lib/prisma.ts` | Singleton del cliente Prisma |
| Crear | `lib/auth.ts` | Configuración de AuthJS v5 |
| Crear | `app/api/auth/[...nextauth]/route.ts` | Handler de AuthJS |
| Crear | `middleware.ts` | Protección de rutas |
| Crear | `services/users.ts` | Lógica de usuario (registro, búsqueda) |
| Crear | `app/(auth)/register/_actions/register.ts` | Server Action de registro |
| Crear | `components/register-form.tsx` | Form de registro con React Hook Form |
| Crear | `app/(auth)/register/page.tsx` | Página de registro |
| Crear | `app/admin/page.tsx` | Panel de aprobación de médicos |
| Crear | `app/admin/_actions/approve-user.ts` | Server Action de aprobación |
| Crear | `types/user.ts` | Tipos TypeScript del dominio User |
| Modificar | `components/login-form.tsx` | Conectar a AuthJS signIn real |
| Modificar | `lib/auth-context.tsx` | Reemplazar mock por hook de sesión real |
| Modificar | `app/dashboard/page.tsx` | Usar auth real en lugar de mock |
| Modificar | `app/login/page.tsx` | Adaptar si hace falta |
| Modificar | `app/layout.tsx` | Agregar SessionProvider si es necesario |

---

## Task 1: Instalar dependencias y configurar Prisma

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/prisma.ts`
- Modify: `package.json` (via pnpm)

- [ ] **Step 1.1: Instalar dependencias**

```bash
cd /Users/devsanti/Documents/projects/recetar
pnpm add next-auth@beta @auth/prisma-adapter
pnpm add prisma @prisma/client
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

Verificar que no hay errores de peer deps.

- [ ] **Step 1.2: Inicializar Prisma**

```bash
pnpm prisma init --datasource-provider postgresql
```

Esto crea `prisma/schema.prisma` y agrega `DATABASE_URL` al `.env`. Verificar que se crearon.

- [ ] **Step 1.3: Crear el archivo `.env.local`**

Crear `/Users/devsanti/Documents/projects/recetar/.env.local` con:

```env
# Database (Neon)
DATABASE_URL="postgresql://..."   # pegar la connection string de Neon

# AuthJS
AUTH_SECRET=""    # generar con: openssl rand -hex 32
NEXTAUTH_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL="tu@email.com"
```

> ⚠ Nunca commitear `.env.local`. Verificar que está en `.gitignore`.

- [ ] **Step 1.4: Verificar .gitignore**

Confirmar que `.gitignore` contiene:
```
.env
.env.local
.env*.local
```

Si no, agregar esas líneas.

- [ ] **Step 1.5: Escribir el schema de Prisma**

Reemplazar el contenido de `prisma/schema.prisma` con:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String     @id @default(cuid())
  name           String
  email          String     @unique
  password       String
  specialty      String?
  status         UserStatus @default(PENDING)
  mpAccessToken  String?
  mpRefreshToken String?
  mpUserId       String?
  config         DoctorConfig?
  envios         Envio[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  @@map("users")
}

model DoctorConfig {
  id            String   @id @default(cuid())
  doctorId      String   @unique
  doctor        User     @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  defaultAmount Float?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("doctor_configs")
}

model Envio {
  id             String         @id @default(cuid())
  doctorId       String
  doctor         User           @relation(fields: [doctorId], references: [id])
  tipo           EnvioTipo
  pdfUrl         String
  pdfKey         String
  patientPhone   String
  amount         Float
  status         EnvioStatus    @default(PENDING_PAYMENT)
  waChatbotState WaChatbotState @default(IDLE)
  mpPreferenceId String?
  mpPaymentId    String?
  createdAt      DateTime       @default(now())
  paidAt         DateTime?
  sentAt         DateTime?
  waMessages     WaMessage[]

  @@map("envios")
}

model WaMessage {
  id          String      @id @default(cuid())
  envioId     String
  envio       Envio       @relation(fields: [envioId], references: [id])
  direction   WaDirection
  content     String
  waMessageId String?
  createdAt   DateTime    @default(now())

  @@map("wa_messages")
}

enum UserStatus     { PENDING APPROVED REJECTED }
enum EnvioTipo      { RECETA ESTUDIOS }
enum EnvioStatus    { PENDING_PAYMENT PAID SENT FAILED }
enum WaChatbotState { IDLE LINK_SENT PAYMENT_CONFIRMED PDF_SENT }
enum WaDirection    { INBOUND OUTBOUND }
```

- [ ] **Step 1.6: Crear el singleton de Prisma**

Crear `lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
```

- [ ] **Step 1.7: Generar el cliente y hacer la migración**

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

Si la DB está bien configurada, debe crear las tablas sin errores.

- [ ] **Step 1.8: Verificar la migración**

```bash
pnpm prisma studio
```

Debe abrir en `http://localhost:5555` mostrando las tablas: `users`, `envios`, `wa_messages`, `doctor_configs`.

Cerrar Prisma Studio (Ctrl+C).

- [ ] **Step 1.9: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 1.10: Commit**

```bash
git add prisma/ lib/prisma.ts .gitignore
git commit -m "feat: add prisma schema and db client"
```

---

## Task 2: Tipos TypeScript del dominio

**Files:**
- Create: `types/user.ts`

- [ ] **Step 2.1: Crear tipos del dominio**

Crear `types/user.ts`:

```typescript
import type { User, UserStatus } from "@prisma/client"

// Tipo seguro para el usuario en sesión (sin password)
export type SafeUser = Omit<User, "password" | "mpAccessToken" | "mpRefreshToken">

// Tipo para el registro de un nuevo médico
export interface RegisterInput {
  name: string
  email: string
  password: string
  specialty?: string
}

// Reutilizar el enum de Prisma directamente
export type { UserStatus }
```

- [ ] **Step 2.2: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 2.3: Commit**

```bash
git add types/user.ts
git commit -m "feat: add user domain types"
```

---

## Task 3: Servicio de usuarios

**Files:**
- Create: `services/users.ts`

- [ ] **Step 3.1: Crear el servicio**

Crear `services/users.ts`:

```typescript
import { db } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { RegisterInput, SafeUser } from "@/types/user"
import type { UserStatus } from "@prisma/client"

export async function createUser(input: RegisterInput): Promise<SafeUser> {
  const existing = await db.user.findUnique({ where: { email: input.email } })
  if (existing) throw new Error("EMAIL_TAKEN")

  const hashedPassword = await bcrypt.hash(input.password, 12)

  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      password: hashedPassword,
      specialty: input.specialty,
      status: "PENDING",
    },
  })

  const { password, mpAccessToken, mpRefreshToken, ...safeUser } = user
  return safeUser
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email: email.toLowerCase() } })
}

export async function getUserById(id: string) {
  return db.user.findUnique({ where: { id } })
}

export async function getPendingUsers() {
  return db.user.findMany({
    where: { status: "PENDING" },
    select: {
      id: true,
      name: true,
      email: true,
      specialty: true,
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateUserStatus(userId: string, status: UserStatus) {
  return db.user.update({
    where: { id: userId },
    data: { status },
  })
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}
```

- [ ] **Step 3.2: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 3.3: Commit**

```bash
git add services/users.ts
git commit -m "feat: add users service"
```

---

## Task 4: Configurar AuthJS v5

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 4.1: Crear la configuración de AuthJS**

Crear `lib/auth.ts`:

```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail, verifyPassword } from "@/services/users"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await getUserByEmail(credentials.email as string)
        if (!user) return null

        const valid = await verifyPassword(credentials.password as string, user.password)
        if (!valid) return null

        // Solo usuarios aprobados pueden iniciar sesión
        if (user.status !== "APPROVED") {
          throw new Error(user.status === "PENDING" ? "PENDING_APPROVAL" : "ACCOUNT_REJECTED")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.status = (user as any).status
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).status = token.status
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
})
```

- [ ] **Step 4.2: Crear el route handler**

Crear `app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

- [ ] **Step 4.3: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 4.4: Commit**

```bash
git add lib/auth.ts app/api/auth/
git commit -m "feat: configure authjs v5 with credentials provider"
```

---

## Task 5: Middleware de protección de rutas

**Files:**
- Create: `middleware.ts`

- [ ] **Step 5.1: Crear el middleware**

Crear `middleware.ts` en la raíz del proyecto:

```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Rutas que NO requieren autenticación
const PUBLIC_ROUTES = ["/", "/login", "/register"]
const AUTH_ROUTES = ["/login", "/register"] // redirigen al dashboard si ya hay sesión

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session
  const isPublic = PUBLIC_ROUTES.includes(nextUrl.pathname)
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")

  // Si ya está logueado y va a login/register → redirigir al dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Si no está logueado y va a ruta privada → redirigir al login
  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin solo accesible por el email configurado
  if (isAdminRoute && session?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
```

- [ ] **Step 5.2: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 5.3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add route protection middleware"
```

---

## Task 6: Server Action de registro

**Files:**
- Create: `app/(auth)/register/_actions/register.ts`

- [ ] **Step 6.1: Crear el directorio**

```bash
mkdir -p /Users/devsanti/Documents/projects/recetar/app/\(auth\)/register/_actions
```

- [ ] **Step 6.2: Crear la Server Action**

Crear `app/(auth)/register/_actions/register.ts`:

```typescript
"use server"

import { createUser } from "@/services/users"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  specialty: z.string().optional(),
})

export type RegisterResult =
  | { success: true }
  | { success: false; error: string }

export async function registerAction(formData: {
  name: string
  email: string
  password: string
  specialty?: string
}): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  try {
    await createUser(parsed.data)
    return { success: true }
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return { success: false, error: "Ya existe una cuenta con ese email" }
    }
    return { success: false, error: "Ocurrió un error. Intentá de nuevo." }
  }
}
```

- [ ] **Step 6.3: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 6.4: Commit**

```bash
git add "app/(auth)/register/_actions/register.ts"
git commit -m "feat: add register server action with validation"
```

---

## Task 7: Formulario y página de registro

**Files:**
- Create: `components/register-form.tsx`
- Create: `app/(auth)/register/page.tsx`

- [ ] **Step 7.1: Crear el formulario de registro**

Crear `components/register-form.tsx`:

```typescript
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerAction } from "@/app/(auth)/register/_actions/register"
import { Loader2, CheckCircle2 } from "lucide-react"

const schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  specialty: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    const result = await registerAction(data)
    if (result.success) {
      setSuccess(true)
    } else {
      setServerError(result.error)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Registro enviado</h2>
        <p className="text-sm text-muted-foreground">
          Tu cuenta está pendiente de aprobación. Te avisaremos cuando esté lista.
        </p>
        <Link href="/login">
          <Button variant="outline" className="mt-2">
            Volver al inicio de sesión
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input id="name" placeholder="Dr. Juan García" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email profesional</Label>
        <Input id="email" type="email" placeholder="dr.garcia@clinica.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialty">Especialidad (opcional)</Label>
        <Input id="specialty" placeholder="Clínica médica, Pediatría..." {...register("specialty")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" placeholder="Mínimo 8 caracteres" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          "Crear cuenta"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </form>
  )
}
```

- [ ] **Step 7.2: Crear la página de registro**

Crear `app/(auth)/register/page.tsx`:

```typescript
import Link from "next/link"
import { FileText, ArrowLeft } from "lucide-react"
import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side — form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">RecetaMed</h1>
              <p className="text-sm text-muted-foreground">Crear cuenta médico</p>
            </div>
          </div>

          <div className="mt-10">
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Right side — decorative (igual al login) */}
      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 h-[800px] w-[800px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold text-primary-foreground">
                Tu cuenta se aprueba en menos de 24hs
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Verificamos que seas médico matriculado antes de darte acceso. Es por la seguridad de tus pacientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7.3: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 7.4: Commit**

```bash
git add components/register-form.tsx "app/(auth)/register/page.tsx"
git commit -m "feat: add register page and form"
```

---

## Task 8: Conectar el login al auth real

**Files:**
- Modify: `components/login-form.tsx`
- Modify: `lib/auth-context.tsx`

- [ ] **Step 8.1: Actualizar el login-form para usar AuthJS signIn**

Leer `components/login-form.tsx` antes de editar. Reemplazar su contenido con:

```typescript
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
})

type FormValues = z.infer<typeof schema>

const AUTH_ERRORS: Record<string, string> = {
  PENDING_APPROVAL: "Tu cuenta está pendiente de aprobación. Te avisaremos cuando esté lista.",
  ACCOUNT_REJECTED: "Tu cuenta fue rechazada. Contactá al soporte.",
  CredentialsSignin: "Email o contraseña incorrectos.",
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const urlError = searchParams.get("error")

  const [serverError, setServerError] = useState<string | null>(
    urlError ? (AUTH_ERRORS[urlError] ?? "Ocurrió un error. Intentá de nuevo.") : null
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setServerError(AUTH_ERRORS[result.error] ?? "Email o contraseña incorrectos.")
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="dr.garcia@clinica.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" placeholder="Tu contraseña" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Ingresando...
          </>
        ) : (
          "Ingresar"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tenés cuenta?{" "}
        <Link href="/register" className="font-medium text-foreground hover:underline">
          Registrate
        </Link>
      </p>
    </form>
  )
}
```

- [ ] **Step 8.2: Reemplazar auth-context.tsx con hook de sesión real**

Reemplazar `lib/auth-context.tsx` con:

```typescript
"use client"

// Este archivo es un thin wrapper sobre useSession de next-auth/react.
// Mantenemos el mismo hook API (useAuth) para no romper componentes existentes.
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }, [router])

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user ?? null,
    logout,
  }
}

// Re-export para compatibilidad — AuthProvider ahora es SessionProvider de next-auth
export { SessionProvider as AuthProvider } from "next-auth/react"
```

- [ ] **Step 8.3: Actualizar app/layout.tsx para incluir SessionProvider**

Leer `app/layout.tsx` antes de editar. Agregar el SessionProvider al layout:

```typescript
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RecetaMed",
  description: "Enviá recetas con cobro automático via MercadoPago",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
```

> ⚠ Leer el layout actual primero con Read tool antes de editar — puede tener providers adicionales.

- [ ] **Step 8.4: Actualizar dashboard/page.tsx**

Leer `app/dashboard/page.tsx` antes de editar. Reemplazar la verificación de auth mock por la real:

```typescript
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { RecetaForm } from "@/components/receta-form"
import { HistorialMock } from "@/components/historial-mock"
import { FileText, Zap, Shield } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-8 pt-24 pb-14">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Panel de Recetas
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargá y enviá recetas médicas con cobro automático via MercadoPago.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Zap className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-card-foreground">Flujo Automático</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Link de pago + entrega de receta en un solo flujo
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Shield className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-card-foreground">Cobro Garantizado</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                La receta solo se envía después del pago
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-card-foreground">WhatsApp Directo</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Comunicación directa con tus pacientes
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-card-foreground">
                <FileText className="h-5 w-5" />
                Nueva Receta
              </h3>
              <RecetaForm />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                Recetas Recientes
              </h3>
              <HistorialMock />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
```

> Nota: `DashboardPage` pasa a ser `async` porque usa `auth()` server-side — esto es correcto para page.tsx según la convención del proyecto cuando el componente no tiene Suspense wrapping propio.

- [ ] **Step 8.5: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 8.6: Commit**

```bash
git add components/login-form.tsx lib/auth-context.tsx app/layout.tsx app/dashboard/page.tsx
git commit -m "feat: connect login and dashboard to real authjs session"
```

---

## Task 9: Panel de administración de aprobación

**Files:**
- Create: `app/admin/_actions/approve-user.ts`
- Create: `app/admin/page.tsx`

- [ ] **Step 9.1: Crear la Server Action de aprobación**

```bash
mkdir -p /Users/devsanti/Documents/projects/recetar/app/admin/_actions
```

Crear `app/admin/_actions/approve-user.ts`:

```typescript
"use server"

import { auth } from "@/lib/auth"
import { updateUserStatus } from "@/services/users"
import type { UserStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function approveUserAction(userId: string, status: UserStatus) {
  const session = await auth()
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    throw new Error("UNAUTHORIZED")
  }

  await updateUserStatus(userId, status)
  revalidatePath("/admin")
}
```

- [ ] **Step 9.2: Crear la página de admin**

Crear `app/admin/page.tsx`:

```typescript
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPendingUsers } from "@/services/users"
import { AdminUserList } from "./_components/admin-user-list"

export default async function AdminPage() {
  const session = await auth()
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/dashboard")
  }

  const pendingUsers = await getPendingUsers()

  return (
    <main className="mx-auto max-w-6xl px-8 py-12">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Panel de Administración</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Médicos pendientes de aprobación: {pendingUsers.length}
      </p>
      <AdminUserList users={pendingUsers} />
    </main>
  )
}
```

- [ ] **Step 9.3: Crear el componente AdminUserList**

```bash
mkdir -p /Users/devsanti/Documents/projects/recetar/app/admin/_components
```

Crear `app/admin/_components/admin-user-list.tsx`:

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { approveUserAction } from "../_actions/approve-user"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface PendingUser {
  id: string
  name: string
  email: string
  specialty: string | null
  createdAt: Date
  status: string
}

export function AdminUserList({ users }: { users: PendingUser[] }) {
  const [loading, setLoading] = useState<string | null>(null)

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
        No hay médicos pendientes de aprobación.
      </div>
    )
  }

  const handleAction = async (userId: string, action: "APPROVED" | "REJECTED") => {
    setLoading(userId + action)
    await approveUserAction(userId, action)
    setLoading(null)
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between rounded-xl border border-border bg-card p-5"
        >
          <div>
            <p className="font-semibold text-card-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.specialty && (
              <Badge variant="secondary" className="mt-1">{user.specialty}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleAction(user.id, "REJECTED")}
              disabled={!!loading}
            >
              {loading === user.id + "REJECTED" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              Rechazar
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => handleAction(user.id, "APPROVED")}
              disabled={!!loading}
            >
              {loading === user.id + "APPROVED" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Aprobar
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 9.4: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 9.5: Commit**

```bash
git add app/admin/
git commit -m "feat: add admin panel for user approval"
```

---

## Task 10: Verificación end-to-end

- [ ] **Step 10.1: Levantar el servidor de desarrollo**

```bash
pnpm dev
```

Verificar que no hay errores en la consola al arrancar.

- [ ] **Step 10.2: Verificar flujo de registro**

1. Ir a `http://localhost:3000/register`
2. Completar el formulario con nombre, email y contraseña
3. Ver el mensaje "Registro enviado — pendiente de aprobación"

- [ ] **Step 10.3: Verificar que el login rechaza usuarios PENDING**

1. Ir a `http://localhost:3000/login`
2. Intentar login con el usuario recién registrado
3. Debe mostrar el mensaje "Tu cuenta está pendiente de aprobación"

- [ ] **Step 10.4: Aprobar el usuario desde el admin**

1. Ir a `http://localhost:3000/admin` (solo funciona con el email de `ADMIN_EMAIL`)
2. Ver el usuario pendiente
3. Presionar "Aprobar"
4. Verificar que desaparece de la lista

- [ ] **Step 10.5: Verificar login exitoso**

1. Ir a `http://localhost:3000/login`
2. Login con el usuario aprobado
3. Debe redirigir al `/dashboard`
4. El navbar debe mostrar el nombre del médico

- [ ] **Step 10.6: Verificar protección de rutas**

1. Cerrar sesión
2. Intentar acceder a `http://localhost:3000/dashboard` directamente
3. Debe redirigir al `/login`

- [ ] **Step 10.7: Verificar TypeScript y lint finales**

```bash
pnpm tsc --noEmit
pnpm lint
```

Esperado: 0 errores.

- [ ] **Step 10.8: Commit final**

```bash
git add -A
git commit -m "feat: complete auth module — register, login, admin approval, route protection"
```
