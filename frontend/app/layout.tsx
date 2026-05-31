import type { Metadata } from 'next'
import '../styles/style.css'
import { AuthProvider } from '@/contexts/AuthContext'
import AntdProvider from '@/components/providers/AntdProvider'

export const metadata: Metadata = {
  title: 'FitConnect Ads',
  description: 'Fitness platform for gym listings and management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AntdProvider>
          <AuthProvider>{children}</AuthProvider>
        </AntdProvider>
      </body>
    </html>
  )
}

