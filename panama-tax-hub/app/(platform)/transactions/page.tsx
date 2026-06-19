'use client';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { Zap, CheckCircle2, RefreshCw, Brain, TrendingUp, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { sessionStorage, transactionStorage, classificationStorage } from '@/lib/storage';
import { StripeTransaction, TransactionClassification, Session } from '@/types';
import { MOCK_TRANSACTIONS, formatAmount, toUSD, COUNTRY_FLAGS, PRODUCT_TYPE_LABELS, PRODUCT_TYPE_COLORS } from '@/lib/stripe-mock';

type Tab = 'connect' | 'transactions' | 'classify';
type SortKey = 'description' | 'amount' | 'created' | 'country';

const ITEMS_PER_PAGE = 10;

const TAX_TREATMENT_STYLE: Record<string, string> = {
  no_gravable_territorialidad: 'bg-green-500/15 text-green-400',
  potencialmente_gravable: 'bg-red-500/15 text-red-400',
  requiere_analisis_profesional: 'bg-amber-500/15 text-amber-400',
};

const TAX_TREATMENT_LABEL: Record<string, string> = {
  no_gravable_territorialidad: 'No Gravable',
  potencialmente_gravable: 'Potenc. Gravable',
  requiere_analisis_profesional: 'Requiere Análisis',
};

const RISK_STYLE: Record<string, string> = {
  bajo: 'text-green-400', medio: 'text-amber-400', alto: 'text-red-400',
};

export default function TransactionsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>('connect');
  const [transactions, setTransactions] = useState<StripeTransaction[]>([]);
  const [classifications, setClassifications] = useState<TransactionClassification[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connectStep, setConnectStep] = useState(0);
  const [classifying, setClassifying] = useState(false);
  const [classifyProgress, setClassifyProgress] = useState(0);

  // Table state
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('created');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) return;
    setSession(s);
    const txs = transactionStorage.get(s.tenantId);
    const cls = classificationStorage.get(s.tenantId);
    setTransactions(txs);
    setClassifications(cls);
    if (txs.length > 0) setTab('transactions');
    if (cls.length > 0) setTab('classify');
  }, []);

  const connectSteps = [
    'Validando credenciales...',
    'Solicitando permisos de lectura...',
    'Sincronizando últimas 30 transacciones...',
    '✓ Conectado exitosamente',
  ];

  const handleConnect = async () => {
    setConnecting(true);
    for (let i = 0; i < connectSteps.length; i++) {
      setConnectStep(i);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
    }
    if (!session) return;
    transactionStorage.set(session.tenantId, MOCK_TRANSACTIONS);
    setTransactions(MOCK_TRANSACTIONS);
    setConnecting(false);
    toast.success('Stripe conectado — 10 transacciones sincronizadas');
    setTab('transactions');
  };

  const handleClassify = async () => {
    if (!session) return;
    setClassifying(true);
    setClassifyProgress(0);

    try {
      const res = await fetch('/api/classify-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });

      if (!res.ok) throw new Error('Error en la clasificación');

      // Simulate progress while waiting
      const progressInterval = setInterval(() => {
        setClassifyProgress(p => Math.min(p + 8, 90));
      }, 400);

      const data = await res.json();
      clearInterval(progressInterval);
      setClassifyProgress(100);

      await new Promise(r => setTimeout(r, 400));
      classificationStorage.set(session.tenantId, data.classifications);
      setClassifications(data.classifications);
      toast.success('¡Clasificación completada con IA!');
      setTab('classify');
    } catch (err) {
      toast.error('Error al clasificar transacciones. Intenta de nuevo.');
    } finally {
      setClassifying(false);
      setClassifyProgress(0);
    }
  };

  // Filtered + sorted transactions
  const uniqueTypes = [...new Set(transactions.map(t => t.metadata.product_type))];
  const uniqueCountries = [...new Set(transactions.map(t => t.customer.address.country))];

  const filtered = transactions
    .filter(tx => (!filterType || tx.metadata.product_type === filterType))
    .filter(tx => (!filterCountry || tx.customer.address.country === filterCountry))
    .filter(tx => (!search || tx.description.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'description') cmp = a.description.localeCompare(b.description);
      else if (sortKey === 'amount') cmp = toUSD(a.amount, a.currency) - toUSD(b.amount, b.currency);
      else if (sortKey === 'created') cmp = a.created - b.created;
      else if (sortKey === 'country') cmp = a.customer.address.country.localeCompare(b.customer.address.country);
      return sortAsc ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalUSD = filtered.reduce((s, tx) => s + toUSD(tx.amount, tx.currency), 0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortAsc ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />) : null;

  // Classification stats
  const noGravable = classifications.filter(c => c.tax_treatment === 'no_gravable_territorialidad').length;
  const gravable = classifications.filter(c => c.tax_treatment === 'potencialmente_gravable').length;
  const analisis = classifications.filter(c => c.tax_treatment === 'requiere_analisis_profesional').length;
  const totalSavings = classifications
    .filter(c => c.tax_treatment === 'no_gravable_territorialidad')
    .reduce((s, c) => s + c.amount_usd * 0.25, 0);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'connect', label: 'Stripe Connect' },
    { key: 'transactions', label: 'Transacciones' },
    { key: 'classify', label: 'Clasificación IA' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Transacciones</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Conecta Stripe, analiza tus ingresos y clasifícalos con IA.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ background: 'var(--bg-surface)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              background: tab === t.key ? 'var(--accent-gold)' : 'transparent',
              color: tab === t.key ? '#0A0F1E' : 'var(--text-secondary)',
            }}
          >
            {t.label}
            {t.key === 'transactions' && transactions.length > 0 && (
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: tab === t.key ? 'rgba(0,0,0,0.2)' : 'var(--bg-elevated)' }}>
                {transactions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      
        {/* CONNECT TAB */}
        {tab === 'connect' && (
          <div key="connect"   >
            {transactions.length > 0 ? (
              <div className="p-6 rounded-lg border text-center" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--success)' }} />
                <p className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Stripe Test Conectado</p>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{transactions.length} transacciones sincronizadas</p>
                <button onClick={() => setTab('transactions')} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}>
                  Ver transacciones
                </button>
              </div>
            ) : (
              <div className="max-w-lg mx-auto">
                <div className="p-8 rounded-lg border text-center" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(99,91,255,0.15)' }}>
                    <Zap className="w-8 h-8" style={{ color: '#6359FF' }} />
                  </div>
                  <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Conectar Stripe Test</h2>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Sincroniza tus transacciones de Stripe en modo test para analizar el tratamiento fiscal de cada ingreso según la territorialidad panameña.
                  </p>

                  <div className="text-left text-xs mb-6 p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                    <p className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Permisos solicitados (solo lectura):</p>
                    {['Ver balance de cuenta', 'Listar transacciones recientes', 'Acceder a datos de clientes', 'Ver metadata de productos'].map(p => (
                      <p key={p} className="flex items-center gap-2 mb-1" style={{ color: 'var(--text-muted)' }}>
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--success)' }} /> {p}
                      </p>
                    ))}
                  </div>

                  {connecting ? (
                    <div className="space-y-3">
                      {connectSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${i <= connectStep ? 'opacity-100' : 'opacity-30'}`}
                            style={{ background: i < connectStep ? 'var(--success)' : i === connectStep ? 'var(--accent-gold)' : 'var(--border)' }}>
                            {i < connectStep && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <p className="text-sm" style={{ color: i <= connectStep ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <button onClick={handleConnect} className="w-full py-2.5 rounded-lg font-medium text-sm" style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}>
                      Conectar Stripe Test
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {tab === 'transactions' && (
          <div key="transactions"   >
            {transactions.length === 0 ? (
              <div className="p-8 rounded-lg border text-center" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No hay transacciones. <button onClick={() => setTab('connect')} className="underline" style={{ color: 'var(--accent-gold)' }}>Conecta Stripe primero.</button></p>
              </div>
            ) : (
              <>
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <input
                    value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Buscar descripción..."
                    className="px-3 py-2 rounded-lg text-sm border outline-none flex-1 min-w-48"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm border outline-none" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Todos los tipos</option>
                    {uniqueTypes.map(t => <option key={t} value={t}>{PRODUCT_TYPE_LABELS[t] ?? t}</option>)}
                  </select>
                  <select value={filterCountry} onChange={e => { setFilterCountry(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm border outline-none" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Todos los países</option>
                    {uniqueCountries.map(c => <option key={c} value={c}>{COUNTRY_FLAGS[c] ?? ''} {c}</option>)}
                  </select>
                </div>

                {/* Table */}
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead style={{ background: 'var(--bg-elevated)' }}>
                      <tr>
                        {[
                          { key: 'description' as SortKey, label: 'Descripción' },
                          { key: 'amount' as SortKey, label: 'Monto' },
                          { key: 'country' as SortKey, label: 'País' },
                          { label: 'Tipo', noSort: true },
                          { key: 'created' as SortKey, label: 'Fecha' },
                          { label: 'Estado', noSort: true },
                        ].map(col => (
                          <th
                            key={col.label}
                            className="px-4 py-3 text-left font-medium cursor-pointer select-none"
                            style={{ color: 'var(--text-muted)' }}
                            onClick={() => !col.noSort && col.key && handleSort(col.key as SortKey)}
                          >
                            {col.label} {col.key && <SortIcon k={col.key as SortKey} />}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((tx, i) => (
                        <tr key={tx.id} className="border-t transition-colors" style={{ borderColor: 'var(--border)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td className="px-4 py-3">
                            <p style={{ color: 'var(--text-primary)' }}>{tx.description}</p>
                            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{tx.id}</p>
                          </td>
                          <td className="px-4 py-3 font-mono whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                            {formatAmount(tx.amount, tx.currency)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                            {COUNTRY_FLAGS[tx.customer.address.country] ?? ''} {tx.customer.address.country}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRODUCT_TYPE_COLORS[tx.metadata.product_type] ?? ''}`}>
                              {PRODUCT_TYPE_LABELS[tx.metadata.product_type] ?? tx.metadata.product_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                            {new Date(tx.created * 1000).toLocaleDateString('es-PA')}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/15 text-green-400">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot style={{ background: 'var(--bg-elevated)' }}>
                      <tr className="border-t" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Total ({filtered.length} txs)</td>
                        <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--accent-gold)' }}>
                          ~${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
                        </td>
                        <td colSpan={4} />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className="w-8 h-8 rounded text-sm font-medium transition-all"
                        style={{
                          background: p === page ? 'var(--accent-gold)' : 'var(--bg-surface)',
                          color: p === page ? '#0A0F1E' : 'var(--text-secondary)',
                          border: `1px solid ${p === page ? 'transparent' : 'var(--border)'}`,
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* CLASSIFY TAB */}
        {tab === 'classify' && (
          <div key="classify"   >
            {classifications.length === 0 ? (
              <div className="max-w-lg mx-auto">
                <div className="p-8 rounded-lg border text-center" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                  <Brain className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-gold)' }} />
                  <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Clasificación con IA</h2>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Claude analizará cada transacción y determinará su tratamiento fiscal bajo el principio de territorialidad del ISR panameño.
                  </p>

                  {classifying ? (
                    <div className="space-y-4">
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ background: 'var(--accent-gold)', width: `${classifyProgress}%`, transition: 'width 0.4s ease' }}
                          
                        />
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Analizando transacciones con IA... {classifyProgress}%
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleClassify}
                      disabled={transactions.length === 0}
                      className="w-full py-2.5 rounded-lg font-medium text-sm disabled:opacity-40"
                      style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}
                    >
                      {transactions.length === 0 ? 'Conecta Stripe primero' : `Clasificar ${transactions.length} transacciones con IA`}
                    </button>
                  )}

                  <div className="mt-4 p-3 rounded-lg flex items-start gap-2 text-left" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Análisis automático basado en país del cliente, tipo de producto y principio de territorialidad panameño.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'No Gravable', value: noGravable, color: 'var(--success)', pct: Math.round(noGravable / classifications.length * 100) },
                    { label: 'Potenc. Gravable', value: gravable, color: 'var(--error)', pct: Math.round(gravable / classifications.length * 100) },
                    { label: 'Requiere Análisis', value: analisis, color: 'var(--warning)', pct: Math.round(analisis / classifications.length * 100) },
                    { label: 'Ahorro Potencial', value: `$${totalSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, color: 'var(--accent-gold)', pct: null },
                  ].map(stat => (
                    <div key={stat.label} className="p-4 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                      <p className="font-mono text-xl font-bold mb-1" style={{ color: stat.color }}>
                        {stat.value}{stat.pct !== null ? ` (${stat.pct}%)` : ''}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Classifications table */}
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead style={{ background: 'var(--bg-elevated)' }}>
                      <tr>
                        {['Transacción', 'Fuente', 'Tipo', 'Tratamiento Fiscal', 'Riesgo', 'Monto USD'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {classifications.map((cls, i) => {
                        const tx = transactions.find(t => t.id === cls.transaction_id);
                        return (
                          <tr key={cls.transaction_id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                            <td className="px-4 py-3">
                              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{cls.transaction_id}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{tx?.description?.slice(0, 30)}...</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls.income_source === 'extranjera' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                {cls.income_source}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{cls.income_type}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${TAX_TREATMENT_STYLE[cls.tax_treatment]}`}>
                                {TAX_TREATMENT_LABEL[cls.tax_treatment]}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-xs" style={{ color: RISK_STYLE[cls.risk_level] ?? 'inherit' }}>
                              {cls.risk_level}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--accent-gold)' }}>
                              ${cls.amount_usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleClassify}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  >
                    <RefreshCw className="w-4 h-4" /> Reclasificar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      
    </div>
  );
}
