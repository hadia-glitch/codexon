// //Author:HadiaNoor Purpose:app/layout.tsx Date:27-2-26
import type { Metadata } from 'next'
import { AuthProvider } from '../context/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'Task Manager built with Next.js and Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-bg text-primary min-h-screen antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}