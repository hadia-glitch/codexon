//author:HadiaNoor Purpose:Root layout for Task Management App Date:29-2-26
import type { Metadata } from 'next';
import { Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/authContext';

const syneFont = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'TaskForge — Task Manager',
  description: 'A powerful task management application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syneFont.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}