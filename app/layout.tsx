import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lucid Cash Point | Restaurant Point of Sale',
  description: 'Lucid Cash Point is a restaurant Point of Sale (POS) and management system prototype.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
