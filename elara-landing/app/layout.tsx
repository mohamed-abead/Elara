import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elara - Smart Islamic Wealth Management Platform',
  description: 'Elara helps you track wealth, calculate zakat, budget smartly, and invest wisely according to Islamic principles. Join thousands managing their wealth journey.',
  keywords: 'Islamic finance, wealth management, zakat calculator, halal investments, financial planning',
  openGraph: {
    title: 'Elara - Smart Islamic Wealth Management Platform',
    description: 'Track wealth, calculate zakat, and invest wisely with Elara',
    images: ['/images/og-image.png'],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elara - Smart Islamic Wealth Management Platform',
    description: 'Track wealth, calculate zakat, and invest wisely with Elara',
    images: ['/images/og-image.png'],
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#004d40',
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