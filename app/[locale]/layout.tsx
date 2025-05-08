import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const messages = await getMessages({ locale })
  return {
    title: messages.common.ticketManagementSystem,
    description: "채팅 지원이 통합된 티켓 관리 시스템",
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <main className="min-h-screen bg-background">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
