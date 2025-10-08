import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { DocumentProvider } from "@/contexts/document-context"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Document Management System",
  description: "Professional document management and workflow system",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Wrapped children with AuthProvider, NotificationProvider, and DocumentProvider */}
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <NotificationProvider>
              <DocumentProvider>{children}</DocumentProvider>
            </NotificationProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
