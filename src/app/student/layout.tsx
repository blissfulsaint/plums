import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Student'
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    children
  )
}
