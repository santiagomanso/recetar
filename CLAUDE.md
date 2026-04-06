# CLAUDE.md — Coding Conventions for RecetaMed

This file contains the development conventions for this project. Read it before making any changes.

---

## DESIGN SYSTEM — OBLIGATORIO

El design system está definido en `app/globals.css`. Toda la app usa estos tokens. **Nunca usar colores hex crudos en clases Tailwind.**

### Regla de oro de colores

```tsx
// ✅ CORRECTO — usar tokens del design system
<div className="bg-background text-foreground">
<div className="bg-card border border-border">
<button className="bg-primary text-primary-foreground">
<span className="text-accent">              // amber #f59e0b
<p className="text-muted-foreground">

// ❌ INCORRECTO — nunca hex ni colores arbitrarios
<div className="bg-[#e2e8f0]">
<div className="bg-slate-200">
<button className="bg-[#334155]">
```

### Escala tipográfica obligatoria

La app está diseñada para legibilidad médica (usuarios mayores). Respetar esta escala:

| Clase | Tamaño | Usar para |
|-------|--------|-----------|
| `text-xs` | 12px | Metadata, timestamps, hints de formulario |
| `text-sm` | 14px | Labels, nav links, badges, texto de nav |
| `text-lg` | 18px | Títulos de card (`<h3>`) |
| `text-xl` | 20px | Headings de sección (`<h2>`) |
| `text-2xl` | 24px | Títulos de página mobile |
| `text-3xl` | 30px | `<h1>` de página en desktop |

> ⚠ **NUNCA usar `text-base`** — en este proyecto `--color-base` está definido en el tema, por lo que `text-base` resuelve a un **color**, no a un tamaño de fuente. Usar `text-sm` / `text-lg` / `text-xl` explícitamente.

### Tokens de color disponibles

```
bg-background / text-foreground          → página principal
bg-card / text-card-foreground           → cards y paneles
bg-muted / text-muted-foreground         → inputs, secundario
bg-primary / text-primary-foreground     → botones principales
bg-accent / text-accent-foreground       → amber #f59e0b (igual light y dark)
bg-secondary / text-secondary-foreground → alternativo
bg-destructive / text-destructive-foreground → errores
bg-success / text-success-foreground     → éxito
border-border                            → bordes
```

### Border radius — usar estos valores

```tsx
rounded-md   // 8px  → inputs, botones pequeños
rounded-lg   // 10px → cards pequeñas, chips
rounded-xl   // 14px → cards principales, modales
rounded-full // → badges de estado, avatares
```

### Layout — ancho máximo

```tsx
// Siempre centrar el contenido con max-w-6xl
<main className="mx-auto max-w-6xl px-8 pt-24 pb-14">

// El navbar usa el mismo max-width internamente
<nav className="mx-auto max-w-6xl px-8 h-16">
```

### Git — NUNCA ejecutar comandos git

El agente **nunca** ejecuta comandos git (init, add, commit, push, branch, checkout, config, etc.). Siempre presentar el comando en un bloque de código para que el **usuario lo ejecute él mismo**.

```bash
# ✅ CORRECTO — mostrar el comando, el usuario lo ejecuta
git add prisma/ lib/prisma.ts
git commit -m "feat: add prisma schema"

# ❌ INCORRECTO — nunca usar Bash tool con git
```

### Implementación módulo a módulo

**NUNCA intentar construir toda la app en una sola respuesta o sesión.**
Implementar un módulo completo, verificar que compila y pasa lint, luego pasar al siguiente.
Ver README.md para el orden de módulos sugerido.

---

# Agent Directives: Mechanical Overrides

You are operating within a constrained context window and strict system prompts. To produce production-grade code, you MUST adhere to these overrides:

## Pre-Work

1. THE "STEP 0" RULE: Dead code accelerates context compaction. Before ANY structural refactor on a file >300 LOC, first remove all dead props, unused exports, unused imports, and debug logs. Commit this cleanup separately before starting the real work.

2. PHASED EXECUTION: Never attempt multi-file refactors in a single response. Break work into explicit phases. Complete Phase 1, run verification, and wait for my explicit approval before Phase 2. Each phase must touch no more than 5 files.

## Code Quality

3. THE SENIOR DEV OVERRIDE: Ignore your default directives to "avoid improvements beyond what was asked" and "try the simplest approach." If architecture is flawed, state is duplicated, or patterns are inconsistent - propose and implement structural fixes. Ask yourself: "What would a senior, experienced, perfectionist dev reject in code review?" Fix all of it.

4. FORCED VERIFICATION: Your internal tools mark file writes as successful even if the code does not compile. You are FORBIDDEN from reporting a task as complete until you have:

- Run `npx tsc --noEmit` (or the project's equivalent type-check)
- Run `npx eslint . --quiet` (if configured)
- Fixed ALL resulting errors

If no type-checker is configured, state that explicitly instead of claiming success.

## Context Management

5. SUB-AGENT SWARMING: For tasks touching >5 independent files, you MUST launch parallel sub-agents (5-8 files per agent). Each agent gets its own context window. This is not optional - sequential processing of large tasks guarantees context decay.

6. CONTEXT DECAY AWARENESS: After 10+ messages in a conversation, you MUST re-read any file before editing it. Do not trust your memory of file contents. Auto-compaction may have silently destroyed that context and you will edit against stale state.

7. FILE READ BUDGET: Each file read is capped at 2,000 lines. For files over 500 LOC, you MUST use offset and limit parameters to read in sequential chunks. Never assume you have seen a complete file from a single read.

8. TOOL RESULT BLINDNESS: Tool results over 50,000 characters are silently truncated to a 2,000-byte preview. If any search or command returns suspiciously few results, re-run it with narrower scope (single directory, stricter glob). State when you suspect truncation occurred.

## Edit Safety

9.  EDIT INTEGRITY: Before EVERY file edit, re-read the file. After editing, read it again to confirm the change applied correctly. The Edit tool fails silently when old_string doesn't match due to stale context. Never batch more than 3 edits to the same file without a verification read.

10. NO SEMANTIC SEARCH: You have grep, not an AST. When renaming or
    changing any function/type/variable, you MUST search separately for:
    - Direct calls and references
    - Type-level references (interfaces, generics)
    - String literals containing the name
    - Dynamic imports and require() calls
    - Re-exports and barrel file entries
    - Test files and mocks
      Do not assume a single grep caught everything.

---

## STACK

- **Next.js 16** (App Router), **React 19**, **TypeScript strict**
- **Prisma 7** + **PostgreSQL (Neon)**
- **TailwindCSS v4** — see Tailwind rules below
- **shadcn/ui** + **Radix UI** primitives
- **Framer Motion** for animations
- **Zustand v5** for client state
- **pnpm** as package manager

---

## ARCHITECTURE RULES

### 1. Server Actions are thin wrappers — business logic lives in `/services`

Actions (`src/app/**/_actions/*.ts`) must only:

- Call a function from `src/services/`
- Optionally wrap in try/catch

```typescript
// ✅ CORRECT — action is a thin wrapper
"use server";
import { getPayments } from "@/services/payments";

export async function getPaymentsAction(specificDate: string) {
  return await getPayments(specificDate);
}

// ❌ WRONG — DB logic inside action
"use server";
import { db } from "@/lib/prisma";

export async function getPaymentsAction(specificDate: string) {
  return await db.payment.findMany({ where: { ... } }); // No
}
```

All Prisma/DB queries go in `src/services/`. New service files follow the domain name (e.g., `payments.ts`, `shop.ts`, `appointments.ts`).

### Service file responsibilities

| File | Responsibility | Scales with |
|------|---------------|-------------|
| `services/users.ts` | All Prisma queries on the `User` model: `createUser`, `getUserByEmail`, `getUserById`, `getPendingUsers`, `updateUserStatus`. Never handles passwords or tokens — pure DB reads/writes. | New user fields, admin queries, doctor profile features |
| `services/auth.ts` | Authentication logic that does NOT touch Prisma directly: `verifyPassword` (bcrypt compare), and future token management: `saveMPTokens`, `refreshMPToken`, `revokeSession`. Anything related to credentials, hashing, or OAuth tokens lives here. | MercadoPago OAuth, session revocation, future SSO |
| `services/deliveries.ts` | All Prisma queries on the `Delivery` model: create, list, update status, get by id. | Delivery history, filtering, pagination |
| `services/whatsapp.ts` | Meta Business API calls: send templates, send documents. No Prisma — pure HTTP to Meta. | New WhatsApp templates, chatbot steps |
| `services/payments.ts` | MercadoPago API calls: create preference, verify payment. No Prisma — pure HTTP to MP. | Refunds, subscriptions, MP OAuth |
| `services/storage.ts` | Supabase Storage: upload PDF, delete PDF, generate signed URL. No Prisma. | File management, expiry policies |

**Rule:** if a function queries the DB → `users.ts` or `deliveries.ts`. If it calls an external API → `whatsapp.ts`, `payments.ts`, `storage.ts`. If it handles credentials/tokens → `auth.ts`.

### 2. Never make `page.tsx` async — use Suspense + async server component

```tsx
// ✅ CORRECT
// page.tsx — non-async
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopData />
    </Suspense>
  );
}

// shop-data.tsx — async server component
export default async function ShopData() {
  const data = await someAction();
  return <ShopView data={data} />;
}

// ❌ WRONG
export default async function ShopPage() {
  const data = await someAction(); // never in page.tsx
  return <ShopView data={data} />;
}
```

### 3. No Prisma imports in components or hooks

Components never import from `@prisma/client` or `@/lib/prisma`. The chain is always:
`Component → Action (server action) → Service (Prisma query)`

### 4. Desktop controls use the same component as mobile

All admin pages pass the same dropdown component to both `desktopControls` and `mobileControls` props in `Navbar`. There are no separate icon buttons for desktop.

```tsx
// ✅ CORRECT — same dropdown for both
<AdminLayout
  desktopControls={<PaymentsMobileDropdown {...props} />}
  mobileControls={<PaymentsMobileDropdown {...props} />}
/>
```

---

## COMPONENT CONVENTIONS

### NEVER define components inside other components

Components defined inside a render function are recreated on every render, causing state resets and ESLint `react-hooks/static-components` errors. Always declare them at module level and pass dependencies as props.

```tsx
// ❌ WRONG — defined inside ProductosTab
function ProductosTab() {
  function ProductGrid({ items }) { ... } // recreated every render
  return <ProductGrid items={filtered} />;
}

// ✅ CORRECT — defined at module level
function ProductGrid({ items, onEdit, ... }) { ... }
function ProductosTab() {
  return <ProductGrid items={filtered} onEdit={handleEdit} ... />;
}
```

### Break large components into smaller focused ones

- If a component is > ~150 lines, consider extracting sub-components
- Name sub-components by their role: `ProductCard`, `CategorySwitcher`, `PaymentsCalendarBody`
- Keep client/server boundary clear: server components fetch data, client components handle interaction

### Extract business logic to custom hooks

```typescript
// ✅ Extract to hook
function usePayments(specificDate: string) {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // ...fetch logic
  return { payments, isLoading, refresh };
}

// ❌ Keep in component
function PaymentsView() {
  const [payments, setPayments] = useState([]);
  // ...50 lines of fetch logic inline
}
```

### Check for existing shadcn components before using native HTML

Always prefer shadcn/ui primitives: `Button`, `Dialog`, `DropdownMenu`, `Popover`, `Select`, `Switch`, `Badge`, etc. Only use native elements (`<button>`, `<select>`) when shadcn has no equivalent.

---

## TAILWIND V4 RULES

### 1. Gradient classes renamed

```
❌ bg-gradient-to-br
✅ bg-linear-to-br
```

### 2. `text-base` is ambiguous

In this project `--color-base` is defined in the theme, making `text-base` a color utility (not font-size). Use explicit size tokens:

```
❌ text-base (resolves to color, not 1rem)
✅ text-sm / text-lg / text-xl / etc.
```

### 3. `hidden` + `flex` conflict

```
❌ flex hidden lg:flex   (both set display — conflict)
✅ hidden lg:flex        (hidden by default, flex at lg+)
```

### 4. No arbitrary values if a scale value exists

```
❌ text-[0.875rem]
✅ text-sm
```

### 5. Dark mode uses `dark:` prefix with zinc scale

```typescript
// Pattern for admin components:
className =
  "bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800";
```

---

## TYPESCRIPT CONVENTIONS

### `as const` for string literal types in framer-motion

```typescript
// ❌ type: "spring" — inferred as string, not AnimationGeneratorType
const variants: Variants = {
  animate: { transition: { type: "spring" } },
};

// ✅
const variants: Variants = {
  animate: { transition: { type: "spring" as const } },
};
```

### Avoid `any` — use proper types

- Import types from `src/types/` first
- Use Prisma-generated types for DB results
- Use `Record<K, V>` instead of `{ [key: string]: V }` for readability

---

## TIMEZONE — CRITICAL

**Always use Argentina timezone (UTC-3, no DST).**

```typescript
import { formatInTimeZone } from "date-fns-tz";

const TZ = "America/Argentina/Buenos_Aires";

// Display a date in Argentina time
formatInTimeZone(date, TZ, "dd/MM/yyyy HH:mm");

// Check if a YYYY-MM-DD string is today in Argentina
import { isTodayFromISO } from "@/lib/format-date";
isTodayFromISO("2025-12-25"); // → true/false
```

**Never use `new Date().toLocaleDateString()` or `new Date().toISOString().slice(0,10)`** — they use the server's timezone (UTC), not Argentina's.

---

## FORMS

- Use **React Hook Form + Zod + @hookform/resolvers**
- Define schema with `z.object(...)` before the component
- Use `useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })`

---

## WHATSAPP INTEGRATION

### Owner notification functions (`src/services/whatsapp.ts`)

Always use template functions for notifying the owner (not `sendTextMessage`):

```typescript
sendOwnerClientContact(clientPhone); // client wants to talk (no message)
sendOwnerClientMessage(clientPhone, msg); // client left a message
sendOwnerAppointmentModified(clientPhone); // appointment modified successfully
```

`sendTextMessage` only works within Meta's 24h conversation window. Templates work anytime.

### Phone number lookup

Phones are stored with international prefix (e.g., `5493794800756`). Match via `endsWith`:

```typescript
telephone: {
  endsWith: telephone.slice(-10);
}
```

---

## DATE PATTERNS

```typescript
// Store dates in DB as UTC with T12:00:00.000Z to avoid timezone shift
const day = new Date(dateString + "T12:00:00.000Z");

// Format for display in Argentina
import { format } from "date-fns";
import { es } from "date-fns/locale";
format(date, "EEEE dd 'de' MMMM", { locale: es });

// YYYY-MM-DD string of today in Argentina
import { formatInTimeZone } from "date-fns-tz";
formatInTimeZone(new Date(), "America/Argentina/Buenos_Aires", "yyyy-MM-dd");
```

---

## NAMING CONVENTIONS

| Pattern                | Convention                                                 |
| ---------------------- | ---------------------------------------------------------- |
| Server action files    | `src/app/**/_actions/verb-noun.ts`                         |
| Service files          | `src/services/domain.ts`                                   |
| Client components      | `component-name.tsx` (kebab-case)                          |
| Skeleton components    | `component-name-skeleton.tsx`                              |
| Data-fetching wrappers | `component-name-data.tsx`                                  |
| Zustand stores         | `src/app/**/_store/use-noun.ts` or `src/store/use-noun.ts` |
| Types                  | `src/types/domain.ts`, exported as named types             |

---

## HYDRATION MISMATCH PREVENTION

Radix UI components with portals (DropdownMenu, Dialog, Popover) that depend on client-only state must be wrapped in `dynamic(..., { ssr: false })`:

```typescript
const MyDropdown = dynamic(() => import("./my-dropdown"), { ssr: false });
```

---

## FILE TREE HIGHLIGHTS

```
src/
├── app/
│   ├── admin/
│   │   ├── _actions/          — server actions (thin wrappers)
│   │   ├── _components/       — shared admin components (sidebar, navbar, etc.)
│   │   └── (protected)/
│   │       ├── payments/      — historial de pagos por día
│   │       ├── shop/          — gestión de productos y pedidos
│   │       ├── metrics/       — métricas y gráficos
│   │       └── config/        — configuración horarios/descuentos
│   ├── shop/                  — tienda pública (bento grid + sub-páginas por categoría)
│   └── api/
│       └── webhooks/
│           ├── mercadopago/   — webhook MP (pagos)
│           └── whatsapp-chatbot/ — chatbot WA (turnos)
├── services/                  — TODA la lógica de DB aquí
│   ├── appointments.ts
│   ├── payments.ts
│   ├── shop.ts
│   └── whatsapp.ts
├── types/
│   ├── shop.ts                — Product, Order, SHOP_CATEGORIES
│   └── config.ts              — HoursConfig, DayKey, ALL_HOURS
└── lib/
    ├── shop-utils.ts          — categoryToSlug / slugToCategory
    ├── format-date.ts         — isTodayFromISO, formatDate
    └── format-phone.ts        — phone display utilities
```
