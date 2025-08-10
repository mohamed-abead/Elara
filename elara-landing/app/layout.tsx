import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Gold-Backed Bank Account | Modern Banking Anchored to Gold',
  description: 'A modern bank account backed by physical gold. Spend in USD while your wealth is anchored to the stability of gold. Join the waitlist for transparent, secure banking.',
  keywords: 'gold-backed banking, digital gold, secure banking, transparent pricing, modern banking',
  openGraph: {
    title: 'Gold-Backed Bank Account | Modern Banking Anchored to Gold',
    description: 'A modern bank account backed by physical gold. Spend in USD while your wealth is anchored to the stability of gold.',
    images: ['/images/og-image.png'],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gold-Backed Bank Account | Modern Banking Anchored to Gold',
    description: 'A modern bank account backed by physical gold. Spend in USD while your wealth is anchored to the stability of gold.',
    images: ['/images/og-image.png'],
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}