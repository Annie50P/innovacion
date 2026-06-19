'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStorage } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const session = sessionStorage.get();
    if (session) {
      router.replace(session.isAdmin ? '/admin' : '/dashboard');
    } else {
      router.replace('/auth');
    }
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <p className="font-mono text-2xl" style={{ color: 'var(--accent-gold)' }}>TAXTECH</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
      </div>
    </div>
  );
}
