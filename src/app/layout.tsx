import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PLuMS Home',
  description: 'PLuMS (Personalized Learning Management System) is your customizable platform for organizing, exploring, and mastering diverse topics. Empower your learning journey by creating, discovering, and completing topics tailored to your interests. Start your educational adventure with PLuMS today.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
