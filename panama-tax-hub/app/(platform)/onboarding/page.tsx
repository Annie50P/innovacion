'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, TrendingUp, Globe, Sparkles } from 'lucide-react';
import { sessionStorage, profileStorage, trackerStorage } from '@/lib/storage';
import { Session } from '@/types';

const STEPS = [
  { label: 'Conectar Stripe y analizar transacciones', href: '/transactions', icon: '🔗' },
  { label: 'Clasificar ingresos con IA fiscal', href: '/transactions', icon: '🤖' },
  { label: 'Simular ahorro con estructura Panamá Hub', href: '/simulator', icon: '📈' },
  { label: 'Revisar el tracker de implementación', href: '/tracker', icon: '🏗️' },
  { label: 'Generar documentos corporativos', href: '/documents', icon: '📄' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) { router.replace('/auth'); return; }
    setSession(s);
    setProfile(profileStorage.get(s.tenantId));

    const tracker = trackerStorage.get(s.tenantId);
    if (tracker.currentState > 0) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleStart = () => {
    if (!session) return;
    const tracker = trackerStorage.get(session.tenantId);
    trackerStorage.set(session.tenantId, { ...tracker, currentState: Math.max(tracker.currentState, 1) });
    router.push('/transactions');
  };

  if (!session) return null;

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen p-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'rgba(230,180,74,0.08)' }}>
            <span className="text-xl">🇵🇦</span>
            <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent-gold)' }}>TAXTECH</span>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            ¡Bienvenido, {session.name?.split(' ')[0]}!
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tu cuenta en <strong style={{ color: 'var(--accent-gold)' }}>{profile?.companyName ?? 'Panama Tax Hub'}</strong> está lista.
            En unos pasos verás cuánto puedes ahorrar usando el principio de territorialidad fiscal panameño.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Shield, label: 'ISR años 1-2', value: 'B/.0', desc: 'Sociedad de Emprendimiento' },
            { icon: TrendingUp, label: 'Ahorro estimado', value: 'hasta 25%', desc: 'de ingresos extranjeros' },
            { icon: Globe, label: 'Territorialidad', value: 'Activa', desc: 'Ingresos extranjeros no gravables' },
          ].map(({ icon: Icon, label, value, desc }) => (
            <div key={label} className="p-4 rounded-lg border text-center" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(230,180,74,0.15)' }}>
                <Icon className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
              </div>
              <p className="font-mono font-bold" style={{ color: 'var(--accent-gold)' }}>{value}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="p-6 rounded-lg border mb-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Tu camino de implementación</h2>
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm" style={{ background: i === 0 ? 'var(--accent-gold)' : 'var(--bg-elevated)', border: `2px solid ${i === 0 ? 'var(--accent-gold)' : 'var(--border)'}` }}>
                  {i === 0 ? <span style={{ color: '#0A0F1E', fontWeight: 700, fontSize: 11 }}>1</span> : <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{i + 1}</span>}
                </div>
                <span className="text-sm" style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {step.icon} {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan info */}
        <div className="flex items-center justify-between p-4 rounded-lg border mb-6" style={{ background: 'rgba(230,180,74,0.06)', borderColor: 'rgba(230,180,74,0.2)' }}>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tu plan actual</p>
            <p className="font-medium" style={{ color: 'var(--accent-gold)' }}>Starter</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>País registrado</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{profile?.country ?? '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Volumen est.</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{profile?.monthlyVolume ?? '—'}</p>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}
        >
          <Sparkles className="w-4 h-4" />
          Comenzar — Conectar Stripe
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          También puedes ir directo al{' '}
          <button onClick={() => router.push('/dashboard')} className="underline" style={{ color: 'var(--accent-gold)' }}>
            dashboard
          </button>
        </p>
      </div>
    </div>
  );
}
