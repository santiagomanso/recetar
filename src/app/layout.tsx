import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
});

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
    <html lang="en" className={`overflow-x-hidden ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="overflow-x-hidden font-sans antialiased">
        {/* Theme init — runs before React hydrates, prevents FOUC */}
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){try{var t=localStorage.getItem('theme'),d=document.documentElement;if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){d.classList.add('dark')}else{d.classList.remove('dark')}}catch(e){}})();`}</Script>
        <Providers>
          {children}
        </Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
