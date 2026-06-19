'use client';
import { useEffect, useState } from 'react';
import { User, Building2, Globe, CreditCard, CheckCircle2, TrendingUp } from 'lucide-react';
import { sessionStorage, profileStorage, trackerStorage, transactionStorage, classificationStorage } from '@/lib/storage';
import { Session } from '@/types';

const TIERS = [
  {
    name: 'Básico',
    setup: 'B/.3,000',
    retainer: 'B/.499/mes',
    desc: 'Estructura simple, 1 fundador, documentación estándar',
    color: 'var(--accent-blue)',
  },
  {
    name: 'Growth',
    setup: 'B/.5,000',
    retainer: 'B/.750/mes',
    desc: 'Startups con pasarelas, documentación bancaria y coordinación profesional',
    color: 'var(--accent-gold)',
    current: true,
  },
  {
    name: 'Premium',
    setup: 'B/.10,000',
    retainer: 'B/.1,500/mes',
    desc: 'Casos complejos, múltiples founders, mayor volumen y revisión ampliada',
    color: 'var(--success)',
  },
];

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ txCount: 0, clsCount: 0, trackerState: 0 });

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) return;
    setSession(s);
    setProfile(profileStorage.get(s.tenantId));
    setStats({
      txCount: transactionStorage.get(s.tenantId).length,
      clsCount: classificationStorage.get(s.tenantId).length,
      trackerState: trackerStorage.get(s.tenantId).currentState,
    });
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Mi Perfil</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Información de tu cuenta y plan de servicio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: 'rgba(230,180,74,0.15)', color: 'var(--accent-gold)' }}>
                {session?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{session?.name ?? '—'}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{session?.email ?? '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, label: 'Empresa / Proyecto', value: profile?.companyName ?? '—' },
                { icon: Globe, label: 'País de residencia', value: profile?.country ?? '—' },
                { icon: TrendingUp, label: 'Volumen mensual estimado', value: profile?.monthlyVolume ?? '—' },
                { icon: CreditCard, label: 'Plan actual', value: 'Starter (Mockup)' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Gateways */}
            {profile?.gateways && profile.gateways.length > 0 && (
              <div className="mt-4">
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Pasarelas de pago</p>
                <div className="flex flex-wrap gap-2">
                  {profile.gateways.map((g: string) => (
                    <span key={g} className="px-3 py-1 rounded-md text-xs font-medium border" style={{ background: 'rgba(230,180,74,0.1)', borderColor: 'rgba(230,180,74,0.3)', color: 'var(--accent-gold)' }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progress stats */}
          <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Estado de implementación</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Transacciones', value: stats.txCount, color: 'var(--accent-blue)' },
                { label: 'Clasificadas', value: stats.clsCount, color: 'var(--success)' },
                { label: 'Estado tracker', value: `${stats.trackerState}/14`, color: 'var(--accent-gold)' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-mono text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>Progreso general</span>
                <span>{Math.round((stats.trackerState / 14) * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ background: 'var(--accent-gold)', width: `${(stats.trackerState / 14) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Account info */}
        <div className="space-y-4">
          <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Información de cuenta</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Miembro desde</span>
                <span style={{ color: 'var(--text-secondary)' }}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-PA') : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Último acceso</span>
                <span style={{ color: 'var(--text-secondary)' }}>{session?.loginAt ? new Date(session.loginAt).toLocaleDateString('es-PA') : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Tenant ID</span>
                <span className="font-mono text-xs truncate max-w-24" style={{ color: 'var(--text-muted)' }}>{session?.tenantId?.slice(0, 8)}…</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border" style={{ background: 'rgba(230,180,74,0.05)', borderColor: 'rgba(230,180,74,0.2)' }}>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent-gold)' }}>Proyecto Académico</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Universidad Tecnológica de Panamá (UTP) — Innovación Empresarial — Grupo 1GS241
            </p>
          </div>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="p-6 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Planes de servicio</h2>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Modelo premium híbrido — setup fee único + retainer mensual</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIERS.map(tier => (
            <div
              key={tier.name}
              className="p-4 rounded-lg border relative"
              style={{
                background: tier.current ? `${tier.color}10` : 'var(--bg-elevated)',
                borderColor: tier.current ? tier.color : 'var(--border)',
              }}
            >
              {tier.current && (
                <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded text-xs font-bold" style={{ background: tier.color, color: '#0A0F1E' }}>
                  Tu plan
                </div>
              )}
              <p className="font-semibold mb-3" style={{ color: tier.current ? tier.color : 'var(--text-primary)' }}>{tier.name}</p>
              <p className="font-mono text-xl font-bold mb-0.5" style={{ color: tier.color }}>{tier.setup}</p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>setup fee + {tier.retainer}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tier.desc}</p>
              {tier.current && (
                <div className="flex items-center gap-1 mt-3">
                  <CheckCircle2 className="w-3 h-3" style={{ color: tier.color }} />
                  <span className="text-xs font-medium" style={{ color: tier.color }}>Activo</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
