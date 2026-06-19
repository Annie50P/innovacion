'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ArrowLeftRight, Calculator, GitBranch, FileText, ShieldCheck, Settings, LogOut, User, Menu, X } from 'lucide-react';
import { sessionStorage, transactionStorage, classificationStorage, trackerStorage } from '@/lib/storage';
import { Session } from '@/types';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transacciones' },
  { href: '/simulator', icon: Calculator, label: 'Simulador Fiscal' },
  { href: '/tracker', icon: GitBranch, label: 'Implementación' },
  { href: '/documents', icon: FileText, label: 'Documentos' },
  { href: '/compliance', icon: ShieldCheck, label: 'Cumplimiento', badge: true },
  { href: '/profile', icon: User, label: 'Mi Perfil' },
];

interface SidebarProps {
  session: Session | null;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export function Sidebar({ session, isOpen = false, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (!session?.tenantId) return;
    const txCount = transactionStorage.get(session.tenantId).length;
    const clsCount = classificationStorage.get(session.tenantId).length;
    const trackerState = trackerStorage.get(session.tenantId).currentState;
    let count = 0;
    if (txCount === 0) count++;
    if (txCount > 0 && clsCount === 0) count++;
    if (trackerState < 5) count++;
    if (trackerState < 9) count++;
    setAlertCount(count);
  }, [session]);

  const logout = () => {
    sessionStorage.clear();
    router.push('/auth');
  };

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--accent-gold)' }}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

    <aside
      className={`fixed left-0 top-0 h-full flex flex-col border-r z-30 transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
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
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname.startsWith(href);
          const showBadge = badge && alertCount > 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group"
              style={{
                background: active ? 'rgba(230,180,74,0.12)' : 'transparent',
                color: active ? 'var(--accent-gold)' : 'var(--text-secondary)',
              }}
            >
              <div className="relative flex-shrink-0">
                <Icon className="w-4 h-4" />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold" style={{ background: 'var(--error)', fontSize: 9 }}>
                    {alertCount}
                  </span>
                )}
              </div>
              {label}
            </Link>
          );
        })}

        {session?.isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
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
    </>
  );
}
