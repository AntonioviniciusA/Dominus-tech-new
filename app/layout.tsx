import type React from "react"
import type { Metadata } from "next"
import { Geist, Cinzel } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { StoreProvider } from "@/lib/store-context"
import { CookieConsent } from "@/components/cookie-consent"
import { Toaster } from "@/components/ui/sonner"

const _geist = Geist({ subsets: ["latin"] })
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "Dominus Tech - Sua loja de tecnologia de confiança",
  description: "Bem-vindo à Dominus Tech",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${_geist.className} ${cinzel.variable} font-sans antialiased`}>
        <StoreProvider>
          {children}
          <CookieConsent />
        </StoreProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
