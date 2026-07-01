import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Interactive Cosmic Explorer',
  description: 'Explore the universe in interactive 3D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
