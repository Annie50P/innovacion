'use client';
import { useEffect, useState } from 'react';

import { TrendingUp, DollarSign, Globe, Sparkles, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { sessionStorage, transactionStorage, classificationStorage, simulationStorage, trackerStorage, documentStorage } from '@/lib/storage';
import { Session, StripeTransaction, TransactionClassification } from '@/types';
import { toUSD, formatAmount } from '@/lib/stripe-mock';
import { formatCurrency } from '@/lib/calculations';
import Link from 'next/link';

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<StripeTransaction[]>([]);
  const [classifications, setClassifications] = useState<TransactionClassification[]>([]);
  const [hasSimulation, setHasSimulation] = useState(false);
  const [trackerState, setTrackerState] = useState(0);
  const [docsCount, setDocsCount] = useState(0);

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) return;
    setSession(s);
    const txs = transactionStorage.get(s.tenantId);
    const cls = classificationStorage.get(s.tenantId);
    const sim = simulationStorage.get(s.tenantId);
    const tracker = trackerStorage.get(s.tenantId);
    const docs = documentStorage.get(s.tenantId);
    setTransactions(txs);
    setClassifications(cls);
    setHasSimulation(!!sim);
    setTrackerState(tracker.currentState);
    setDocsCount(docs.length);
  }, []);

  const totalVolume = transactions.reduce((sum, tx) => sum + toUSD(tx.amount, tx.currency), 0);
  const foreignPct = classifications.length > 0
    ? Math.round((classifications.filter(c => c.income_source === 'extranjera').length / classifications.length) * 100)
    : 0;
  const estimatedSavings = classifications.reduce((sum, c) => {
    if (c.tax_treatment === 'no_gravable_territorialidad') return sum + c.amount_usd * 0.25;
    return sum;
  }, 0);

  const quickSteps = [
    { label: 'Conectar Stripe', done: transactions.length > 0, href: '/transactions' },
    { label: 'Clasificar con IA', done: classifications.length > 0, href: '/transactions' },
    { label: 'Simular exposición fiscal', done: hasSimulation, href: '/simulator' },
    { label: 'Revisar implementación', done: trackerState > 4, href: '/tracker' },
    { label: 'Generar documentos', done: docsCount > 0, href: '/documents' },
  ];

  const legalFramework = [
    { item: 'Territorialidad fiscal activa', status: '✅ Activo' },
    { item: 'Sociedad de Emprendimiento (Ley 186/2020)', status: '✅ Disponible' },
    { item: 'ISR años 1-2', status: '✅ B/.0 Exonerado' },
    { item: 'Ley 451 de 2024 actualización', status: '✅ Aplicable' },
    { item: 'AMPYME registro', status: '⚠️ Pendiente' },
    { item: 'Aviso de Operación', status: '⚠️ Pendiente' },
  ];

  const kpis = [
    { label: 'Transacciones Analizadas', value: transactions.length.toString(), icon: TrendingUp, color: 'var(--accent-blue)' },
    { label: 'Volumen Total Procesado', value: formatCurrency(totalVolume), icon: DollarSign, color: 'var(--success)' },
    { label: 'Ingreso Fuente Extranjera', value: `${foreignPct}%`, icon: Globe, color: 'var(--accent-gold)' },
    { label: 'Ahorro Fiscal Estimado', value: formatCurrency(estimatedSavings), icon: Sparkles, color: 'var(--accent-gold)', highlight: true },
  ];

  const recentActivity = [
    ...transactions.slice(-5).reverse().map(tx => ({
      text: tx.description,
      sub: formatAmount(tx.amount, tx.currency),
      time: new Date(tx.created * 1000).toLocaleDateString('es-PA'),
    })),
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('es-PA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Bienvenido, {session?.name?.split(' ')[0] ?? 'Usuario'} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Aquí está el resumen de tu estructura fiscal panameña.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            
            
            
            className="p-5 rounded-lg border"
            style={{
              background: kpi.highlight ? 'rgba(230,180,74,0.08)' : 'var(--bg-surface)',
              borderColor: kpi.highlight ? 'rgba(230,180,74,0.3)' : 'var(--border)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}20` }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </div>
            <p className="font-mono text-2xl font-bold mb-1" style={{ color: kpi.highlight ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
              {kpi.value}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Quick Start */}
        <div className="xl:col-span-1 p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Inicio Rápido</h2>
          <div className="space-y-3">
            {quickSteps.map((step, i) => (
              <Link key={step.label} href={step.href} className="flex items-center gap-3 group">
                {step.done
                  ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} />
                  : <Circle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                }
                <span className="text-sm flex-1" style={{ color: step.done ? 'var(--text-muted)' : 'var(--text-secondary)', textDecoration: step.done ? 'line-through' : 'none' }}>
                  {i + 1}. {step.label}
                </span>
                {!step.done && <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-gold)' }} />}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
              <span>Progreso</span>
              <span>{quickSteps.filter(s => s.done).length}/{quickSteps.length}</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ background: 'var(--accent-gold)', width: `${(quickSteps.filter(s => s.done).length / quickSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Legal Framework */}
        <div className="xl:col-span-2 p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Marco Legal Panameño</h2>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="text-left pb-2 font-medium">Principio</th>
                <th className="text-right pb-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {legalFramework.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2.5 pr-4" style={{ color: 'var(--text-secondary)' }}>{row.item}</td>
                  <td className="py-2.5 text-right font-mono text-xs whitespace-nowrap">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Actividad Reciente</h2>
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a.text}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.time}</p>
                </div>
                <span className="font-mono text-sm" style={{ color: 'var(--accent-gold)' }}>{a.sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
