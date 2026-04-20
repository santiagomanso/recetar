import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Recetar - Envío de Recetas Médicas',
  description: 'Plataforma para médicos: envía recetas médicas con cobro previo via MercadoPago',
  icons: {
    icon: '/steto.png',
    apple: '/steto.png',
  },
  openGraph: {
    title: 'Recetar - Envío de Recetas Médicas',
    description: 'Plataforma para médicos: envía recetas médicas con cobro previo via MercadoPago',
    images: [{ url: '/steto.png', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary',
    images: ['/steto.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
