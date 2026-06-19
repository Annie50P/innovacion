'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStorage } from '@/lib/storage';
import { Session } from '@/types';
import { Sidebar } from '@/components/sidebar';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) {
      router.replace('/auth');
    } else {
      setSession(s);
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <p className="font-mono text-sm" style={{ color: 'var(--accent-gold)' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        session={session}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="flex-1 overflow-auto lg:ml-60">
        {children}
      </main>
    </div>
  );
}
