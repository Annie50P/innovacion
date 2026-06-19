import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Panama Tax Infrastructure Hub',
  description: 'TaxTech SaaS — Optimización fiscal legal para startups globales mediante estructura operativa en Panamá.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {children}
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
