'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStorage, tenantStorage, transactionStorage, classificationStorage, trackerStorage, documentStorage } from '@/lib/storage';
import { Tenant, Session } from '@/types';
import { Users, DollarSign, TrendingUp, FileText, LogOut, X } from 'lucide-react';
import { toUSD } from '@/lib/stripe-mock';
import { formatCurrency } from '@/lib/calculations';

interface TenantStats {
  tenant: Tenant;
  txCount: number;
  totalVolume: number;
  clsCount: number;
  trackerState: number;
  docsCount: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [tenantsStats, setTenantsStats] = useState<TenantStats[]>([]);
  const [selected, setSelected] = useState<TenantStats | null>(null);

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s?.isAdmin) { router.replace('/auth'); return; }
    setSession(s);

    const tenants = tenantStorage.getAll().filter(t => t.email !== 'admin@taxhub.pa');
    const stats: TenantStats[] = tenants.map(t => {
      const txs = transactionStorage.get(t.id);
      const cls = classificationStorage.get(t.id);
      const tracker = trackerStorage.get(t.id);
      const docs = documentStorage.get(t.id);
      return {
        tenant: t,
        txCount: txs.length,
        totalVolume: txs.reduce((s, tx) => s + toUSD(tx.amount, tx.currency), 0),
        clsCount: cls.length,
        trackerState: tracker.currentState,
        docsCount: docs.length,
      };
    });
    setTenantsStats(stats);
  }, [router]);

  const logout = () => { sessionStorage.clear(); router.push('/auth'); };

  const totalVolume = tenantsStats.reduce((s, t) => s + t.totalVolume, 0);
  const totalTxs = tenantsStats.reduce((s, t) => s + t.txCount, 0);
  const estimatedSavings = totalVolume * 0.8 * 0.25;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Admin header */}
      <div className="border-b px-8 py-4 flex items-center justify-between" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-lg" style={{ color: 'var(--accent-gold)' }}>TAXTECH</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(207,70,68,0.15)', color: 'var(--accent-red)' }}>Admin Panel</span>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Panel de Administración</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Vista global de todos los tenants de la plataforma.</p>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tenants registrados', value: tenantsStats.length.toString(), icon: Users, color: 'var(--accent-blue)' },
            { label: 'Transacciones procesadas', value: totalTxs.toString(), icon: TrendingUp, color: 'var(--success)' },
            { label: 'Volumen total analizado', value: formatCurrency(totalVolume), icon: DollarSign, color: 'var(--accent-gold)' },
            { label: 'Ahorro fiscal colectivo est.', value: formatCurrency(estimatedSavings), icon: FileText, color: 'var(--accent-gold)', highlight: true },
          ].map(kpi => (
            <div key={kpi.label} className="p-4 rounded-lg border" style={{ background: kpi.highlight ? 'rgba(230,180,74,0.06)' : 'var(--bg-surface)', borderColor: kpi.highlight ? 'rgba(230,180,74,0.3)' : 'var(--border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${kpi.color}20` }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <p className="font-mono text-xl font-bold mb-1" style={{ color: kpi.highlight ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Tenants table */}
        {tenantsStats.length === 0 ? (
          <div className="p-12 rounded-lg border text-center" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No hay tenants registrados aún.</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Los tenants aparecerán aquí cuando se registren en la plataforma.</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-sm">
              <thead style={{ background: 'var(--bg-elevated)' }}>
                <tr>
                  {['Tenant', 'Email', 'País', 'Plan', 'Registro', 'Txs', 'Tracker', 'Docs', 'Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenantsStats.map(({ tenant, txCount, trackerState, docsCount, totalVolume: vol }) => (
                  <tr key={tenant.id} className="border-t" style={{ borderColor: 'var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{tenant.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tenant.companyName}</p>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{tenant.email}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{tenant.country}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/15 text-blue-400">{tenant.plan}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(tenant.createdAt).toLocaleDateString('es-PA')}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{txCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 rounded-full" style={{ background: 'var(--border)' }}>
                          <div className="h-full rounded-full" style={{ background: 'var(--accent-gold)', width: `${(trackerState / 14) * 100}%` }} />
                        </div>
                        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{trackerState}/14</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{docsCount}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(tenantsStats.find(t => t.tenant.id === tenant.id) ?? null)}
                        className="text-xs px-2 py-1 rounded border transition-all"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tenant detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Detalle: {selected.tenant.name}</h3>
              <button onClick={() => setSelected(null)} style={{ color: 'var(--text-muted)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Empresa', value: selected.tenant.companyName },
                  { label: 'Email', value: selected.tenant.email },
                  { label: 'País', value: selected.tenant.country },
                  { label: 'Volumen mensual', value: selected.tenant.monthlyVolume },
                  { label: 'Plan', value: selected.tenant.plan },
                  { label: 'Registro', value: new Date(selected.tenant.createdAt).toLocaleDateString('es-PA') },
                  { label: 'Transacciones', value: selected.txCount.toString() },
                  { label: 'Volumen total', value: formatCurrency(selected.totalVolume) },
                  { label: 'Clasificadas', value: selected.clsCount.toString() },
                  { label: 'Docs generados', value: selected.docsCount.toString() },
                  { label: 'Estado tracker', value: `${selected.trackerState}/14` },
                  { label: 'Pasarelas', value: selected.tenant.gateways.join(', ') || '—' },
                ].map(f => (
                  <div key={f.label} className="p-3 rounded" style={{ background: 'var(--bg-elevated)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{f.label}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
