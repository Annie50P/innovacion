'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { CheckCircle2, FileText, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { sessionStorage, profileStorage, simulationStorage, trackerStorage } from '@/lib/storage';
import { TenantProfile, SimulationResult, TrackerState, Session } from '@/types';

const PLANS = [
  {
    name: 'Básico',
    setup: 3000,
    retainer: 499,
    features: ['Constitución de SE', 'KYC bancario', 'Aviso de Operación AMPYME', 'Soporte por email'],
  },
  {
    name: 'Growth',
    setup: 5000,
    retainer: 799,
    features: ['Todo lo de Básico', 'Cuenta bancaria empresarial', 'Clasificación IA mensual', 'Dashboard de compliance', 'Soporte prioritario'],
  },
  {
    name: 'Premium',
    setup: 10000,
    retainer: 1500,
    features: ['Todo lo de Growth', 'Abogado dedicado', 'Auditoría trimestral', 'Reconexión de pasarelas', 'SLA 24h'],
  },
];

const TIMELINE = [
  { weeks: '1–2', title: 'Análisis fiscal y propuesta', done: true },
  { weeks: '3–4', title: 'Generación documental con IA', done: false },
  { weeks: '5–6', title: 'Revisión legal y notaría', done: false },
  { weeks: '7–8', title: 'Registro Público de Panamá', done: false },
  { weeks: '9–10', title: 'AMPYME y cuenta bancaria', done: false },
  { weeks: '11–12', title: 'Activación operativa y monitoreo', done: false },
];

export default function ProposalPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [tracker, setTracker] = useState<TrackerState | null>(null);
  const [signed, setSigned] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) { router.replace('/auth'); return; }
    setSession(s);
    setProfile(profileStorage.get(s.tenantId));
    setSimulation(simulationStorage.get(s.tenantId));
    const t = trackerStorage.get(s.tenantId);
    setTracker(t);
    if (t.currentState >= 6) setSigned(true);
  }, [router]);

  const handleSign = () => {
    if (!session || !tracker) return;
    setSigning(true);
    setTimeout(() => {
      const updated: TrackerState = {
        ...tracker,
        currentState: Math.max(tracker.currentState, 6),
        history: [
          ...tracker.history,
          { state: 5, completedAt: new Date().toISOString() },
        ],
      };
      trackerStorage.set(session.tenantId, updated);
      setTracker(updated);
      setSigned(true);
      setSigning(false);
      toast.success('¡Propuesta aprobada! Avanzando al Estado 6.');
    }, 1500);
  };

  const selectedPlan = PLANS.find(
    p => p.name.toLowerCase() === profile?.plan?.toLowerCase()
  ) ?? PLANS[1];

  const today = new Date().toLocaleDateString('es-PA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/tracker"
        className="inline-flex items-center gap-1.5 text-xs mb-6 transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-gold)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver al Tracker
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
            Estado 6 — Propuesta y aprobación
          </span>
          {signed && (
            <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
              ✓ Aprobada
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Propuesta Panama Hub
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Estructuración fiscal para{' '}
          <span style={{ color: 'var(--text-primary)' }}>{profile?.companyName ?? 'tu empresa'}</span>
          {' '}· {today}
        </p>
      </div>

      {/* Fiscal summary — only if simulation exists */}
      {simulation ? (
        <div className="p-5 rounded-lg border mb-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Resumen del análisis fiscal
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Ingresos mensuales', value: `$${simulation.currentScenario.totalIncome.toLocaleString()}`, color: 'var(--text-primary)' },
              { label: 'Impuesto actual / año', value: `$${(simulation.currentScenario.estimatedTax * 12).toLocaleString()}`, color: 'var(--accent-red)' },
              { label: 'Ahorro proyectado', value: `$${simulation.netSavings.toLocaleString()}`, color: 'var(--accent-gold)' },
              { label: 'Break-even', value: `Mes ${simulation.breakEvenMonths}`, color: 'var(--success)' },
            ].map(card => (
              <div key={card.label} className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
                <p className="text-base font-semibold" style={{ color: card.color }}>{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg border mb-6 flex items-center gap-3 text-sm" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          <FileText className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          <span>No hay simulación guardada. <Link href="/simulator" className="underline" style={{ color: 'var(--accent-gold)' }}>Ejecuta el simulador</Link> para ver el análisis aquí.</span>
        </div>
      )}

      {/* Plan cards */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Plan propuesto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(plan => {
            const isSelected = plan.name === selectedPlan.name;
            return (
              <div
                key={plan.name}
                className="p-5 rounded-lg border"
                style={{
                  background: isSelected ? 'rgba(230,180,74,0.06)' : 'var(--bg-surface)',
                  borderColor: isSelected ? 'var(--accent-gold)' : 'var(--border)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm" style={{ color: isSelected ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                    {plan.name}
                  </h3>
                  {isSelected && (
                    <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: 'rgba(230,180,74,0.15)', color: 'var(--accent-gold)' }}>
                      Propuesto
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    B/. {plan.setup.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    setup + B/. {plan.retainer}/mes retainer
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="p-5 rounded-lg border mb-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Calendar className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
          Cronograma estimado — 12 semanas
        </h2>
        <div className="space-y-2.5">
          {TIMELINE.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-14 text-right text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                Sem {item.weeks}
              </span>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: item.done ? 'var(--success)' : 'var(--border)' }}
              />
              <span className="text-xs" style={{ color: item.done ? 'var(--success)' : 'var(--text-secondary)' }}>
                {item.title}
              </span>
              {item.done && (
                <span className="text-xs ml-auto flex-shrink-0" style={{ color: 'var(--success)' }}>
                  ✓ Completado
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Signature / approval section */}
      <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        {signed ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--success)' }} />
            <p className="font-semibold mb-1" style={{ color: 'var(--success)' }}>¡Propuesta aprobada!</p>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
              El cliente aprobó la propuesta. El sistema avanzó al Estado 6 — Propuesta y aprobación.
            </p>
            <Link
              href="/tracker"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}
            >
              Ver tracker <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Aprobación de la propuesta
            </h2>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Al firmar, el cliente confirma que ha revisado la propuesta, comprende los honorarios y da su conformidad para iniciar la estructuración bajo la Ley 186 de 2020 (Sociedad de Emprendimiento).
            </p>
            <div
              className="flex items-start gap-2.5 p-3 rounded-lg mb-5 text-xs"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
            >
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              Mockup académico — en producción esta sección utilizaría firma digital certificada (ej. DocuSign, FirmaEC).
            </div>
            <button
              onClick={handleSign}
              disabled={signing}
              className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              style={{
                background: signing ? 'var(--bg-elevated)' : 'var(--accent-gold)',
                color: signing ? 'var(--text-muted)' : '#0A0F1E',
                cursor: signing ? 'not-allowed' : 'pointer',
              }}
            >
              {signing ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'var(--border)', borderTopColor: 'var(--text-muted)' }}
                  />
                  Procesando...
                </>
              ) : (
                '✍️  Firmar y aprobar propuesta'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
