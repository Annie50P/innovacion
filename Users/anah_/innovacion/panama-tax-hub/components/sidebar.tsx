'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Calculator, GitBranch, FileText, ShieldCheck, Settings, LogOut } from 'lucide-react';
import { sessionStorage } from '@/lib/storage';
import { Session } from '@/types';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transacciones' },
  { href: '/simulator', icon: Calculator, label: 'Simulador Fiscal' },
  { href: '/tracker', icon: GitBranch, label: 'Implementación' },
  { href: '/documents', icon: FileText, label: 'Documentos' },
  { href: '/compliance', icon: ShieldCheck, label: 'Cumplimiento' },
];

export function Sidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    sessionStorage.clear();
    router.push('/auth');
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col border-r z-30"
      style={{ width: 240, background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🇵🇦</span>
          <span className="font-mono font-bold text-lg" style={{ color: 'var(--accent-gold)' }}>TAXTECH</span>
        </div>
        <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>Panama Tax Infrastructure</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group"
              style={{
                background: active ? 'rgba(230,180,74,0.12)' : 'transparent',
                color: active ? 'var(--accent-gold)' : 'var(--text-secondary)',
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}

        {session?.isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              background: pathname.startsWith('/admin') ? 'rgba(207,70,68,0.12)' : 'transparent',
              color: pathname.startsWith('/admin') ? 'var(--accent-red)' : 'var(--text-secondary)',
            }}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            Admin Panel
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
        <div className="px-1">
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {session?.name ?? 'Usuario'}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{session?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-red)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
