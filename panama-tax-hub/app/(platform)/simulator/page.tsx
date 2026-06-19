'use client';
import { useEffect, useState, useCallback } from 'react';

import { toast } from 'sonner';
import { AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { sessionStorage, classificationStorage, simulationStorage, profileStorage } from '@/lib/storage';
import { SimulationInput, SimulationResult, Session } from '@/types';
import { calculateSimulation, formatCurrency, TAX_RATES_BY_COUNTRY } from '@/lib/calculations';
import { useRouter } from 'next/navigation';

const COUNTRY_TAX_CODES: Record<string, string> = {
  'Estados Unidos': 'US', 'México': 'MX', 'Colombia': 'CO', 'Argentina': 'AR',
  'Chile': 'CL', 'Perú': 'PE', 'Brasil': 'BR', 'España': 'ES', 'Alemania': 'DE',
  'Francia': 'FR', 'Reino Unido': 'GB', 'Canadá': 'CA', 'Panamá': 'PA',
};

export default function SimulatorPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const [input, setInput] = useState<SimulationInput>({
    monthlyRevenueUSD: 10000,
    foreignIncomePercentage: 80,
    currentTaxRatePercentage: 30,
    setupFee: 5000,
    monthlyRetainer: 699,
    projectionMonths: 12,
    activeClients: 10,
  });

  const recalculate = useCallback(() => {
    const res = calculateSimulation(input);
    setResult(res);
  }, [input]);

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) return;
    setSession(s);

    // Pre-populate from classifications
    const cls = classificationStorage.get(s.tenantId);
    if (cls.length > 0) {
      const totalUSD = cls.reduce((sum, c) => sum + c.amount_usd, 0);
      const foreignCount = cls.filter(c => c.income_source === 'extranjera').length;
      const foreignPct = Math.round((foreignCount / cls.length) * 100);
      setInput(prev => ({
        ...prev,
        monthlyRevenueUSD: Math.round(totalUSD / 10),
        foreignIncomePercentage: foreignPct,
      }));
    }

    // Pre-populate tax rate from profile
    const profile = profileStorage.get(s.tenantId);
    if (profile?.country) {
      const code = COUNTRY_TAX_CODES[profile.country];
      if (code && TAX_RATES_BY_COUNTRY[code]) {
        setInput(prev => ({ ...prev, currentTaxRatePercentage: TAX_RATES_BY_COUNTRY[code] }));
      }
    }
  }, []);

  useEffect(() => { recalculate(); }, [recalculate]);

  const handleSave = () => {
    if (!session || !result) return;
    simulationStorage.set(session.tenantId, result);
    toast.success('Simulación guardada');
  };

  const handleStartImplementation = () => {
    if (!session || !result) return;
    simulationStorage.set(session.tenantId, result);
    router.push('/tracker');
  };

  const update = (key: keyof SimulationInput, val: number) =>
    setInput(prev => ({ ...prev, [key]: val }));

  const SETUP_OPTIONS = [
    { label: 'Básico', value: 3000 },
    { label: 'Growth', value: 5000 },
    { label: 'Premium', value: 10000 },
  ];

  const PROJ_OPTIONS = [
    { label: '12 meses', value: 12 },
    { label: '24 meses', value: 24 },
    { label: '36 meses', value: 36 },
  ];

  const pieData = result ? [
    { name: 'No Gravable', value: result.panamaHubScenario.nonTaxableForeignIncome, color: '#22C55E' },
    { name: 'Gravable Local', value: result.panamaHubScenario.taxableLocalIncome, color: '#F59E0B' },
  ] : [];

  const fieldStyle = {
    background: 'var(--bg-elevated)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Simulador Fiscal</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Modela el impacto real de una estructura Panama Hub en tus finanzas.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* LEFT: Inputs */}
        <div className="xl:col-span-2 space-y-5">
          {/* Ingresos */}
          <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <h3 className="font-medium text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Datos de Ingresos</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Ingresos mensuales (USD)</label>
                <input type="number" value={input.monthlyRevenueUSD} onChange={e => update('monthlyRevenueUSD', +e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none font-mono"
                  style={fieldStyle} min={0} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: 'var(--text-secondary)' }}>% Fuente Extranjera</span>
                  <span className="font-mono" style={{ color: 'var(--accent-gold)' }}>{input.foreignIncomePercentage}%</span>
                </div>
                <input type="range" min={0} max={100} value={input.foreignIncomePercentage}
                  onChange={e => update('foreignIncomePercentage', +e.target.value)}
                  className="w-full accent-amber-400 cursor-pointer" />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>Fuente Extranjera: {input.foreignIncomePercentage}%</span>
                  <span>Fuente Panamá: {100 - input.foreignIncomePercentage}%</span>
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Clientes activos estimados</label>
                <input type="number" value={input.activeClients ?? 10} onChange={e => update('activeClients', +e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none font-mono"
                  style={fieldStyle} min={1} />
              </div>
            </div>
          </div>

          {/* Situación actual */}
          <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <h3 className="font-medium text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Situación Actual</h3>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: 'var(--text-secondary)' }}>Tasa impositiva actual (%)</span>
                <span className="font-mono" style={{ color: 'var(--accent-red)' }}>{input.currentTaxRatePercentage}%</span>
              </div>
              <input type="range" min={5} max={55} value={input.currentTaxRatePercentage}
                onChange={e => update('currentTaxRatePercentage', +e.target.value)}
                className="w-full cursor-pointer" style={{ accentColor: 'var(--accent-red)' }} />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Tasa ISR en tu país de residencia actual</p>
            </div>
          </div>

          {/* Estructura Panama Hub */}
          <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <h3 className="font-medium text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Estructura Panama Hub</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-2 block" style={{ color: 'var(--text-secondary)' }}>Setup fee</label>
                <div className="flex gap-2">
                  {SETUP_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => update('setupFee', opt.value)}
                      className="flex-1 py-1.5 rounded text-xs font-medium border transition-all"
                      style={{
                        background: input.setupFee === opt.value ? 'rgba(230,180,74,0.15)' : 'var(--bg-elevated)',
                        borderColor: input.setupFee === opt.value ? 'var(--accent-gold)' : 'var(--border)',
                        color: input.setupFee === opt.value ? 'var(--accent-gold)' : 'var(--text-muted)',
                      }}>
                      {opt.label}<br />
                      <span className="font-mono">B/.{opt.value.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: 'var(--text-secondary)' }}>Retainer mensual</span>
                  <span className="font-mono" style={{ color: 'var(--accent-gold)' }}>B/.{input.monthlyRetainer}/mes</span>
                </div>
                <input type="range" min={499} max={1500} step={50} value={input.monthlyRetainer}
                  onChange={e => update('monthlyRetainer', +e.target.value)}
                  className="w-full accent-amber-400 cursor-pointer" />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>B/.499</span><span>B/.1,500</span>
                </div>
              </div>
              <div className="p-3 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Costo cloud estimado: <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                    B/.{((50 + 25 * (input.activeClients ?? 10))).toFixed(0)}/mes
                  </span>
                </p>
              </div>
              <div>
                <label className="text-xs mb-2 block" style={{ color: 'var(--text-secondary)' }}>Horizonte de proyección</label>
                <div className="flex gap-2">
                  {PROJ_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => update('projectionMonths', opt.value)}
                      className="flex-1 py-1.5 rounded text-xs font-medium border transition-all"
                      style={{
                        background: input.projectionMonths === opt.value ? 'rgba(59,130,246,0.15)' : 'var(--bg-elevated)',
                        borderColor: input.projectionMonths === opt.value ? 'var(--accent-blue)' : 'var(--border)',
                        color: input.projectionMonths === opt.value ? 'var(--accent-blue)' : 'var(--text-muted)',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        {result && (
          <div className="xl:col-span-3 space-y-5">
            {/* Main savings card */}
            <div
              className="p-6 rounded-lg border text-center"
              style={{ background: 'rgba(230,180,74,0.06)', borderColor: 'rgba(230,180,74,0.3)' }}
              key={result.netSavings}
              
              
              
            >
              <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Ahorro Neto Estimado</p>
              <p className="font-mono text-4xl font-bold" style={{ color: result.netSavings > 0 ? 'var(--accent-gold)' : 'var(--accent-red)' }}>
                {result.netSavings > 0 ? '+' : ''}{formatCurrency(result.netSavings)}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>en {input.projectionMonths} meses</p>
              {result.breakEvenMonths <= input.projectionMonths && (
                <p className="text-xs mt-2" style={{ color: 'var(--success)' }}>
                  Break-even en mes {result.breakEvenMonths}
                </p>
              )}
            </div>

            {/* Comparison table */}
            <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-medium text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Situación Actual vs Panama Hub</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left pb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Concepto</th>
                    <th className="text-right pb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Situación Actual</th>
                    <th className="text-right pb-2 font-medium" style={{ color: 'var(--accent-gold)' }}>Con Panama Hub</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    { label: 'Ingresos gravables (anual)', a: formatCurrency(result.currentScenario.taxableIncome), b: formatCurrency(result.panamaHubScenario.taxableLocalIncome) },
                    { label: 'Tasa ISR aplicable', a: `${input.currentTaxRatePercentage}%`, b: '0% (Soc. Emp. Años 1-2)' },
                    { label: 'Impuesto estimado', a: formatCurrency(result.currentScenario.estimatedTax), b: 'B/.0', highlight: true },
                    { label: 'Costos de estructura', a: '—', b: formatCurrency(result.panamaHubScenario.totalStructureCost) },
                  ].map(row => (
                    <tr key={row.label} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-2.5 pr-4" style={{ color: 'var(--text-secondary)' }}>{row.label}</td>
                      <td className="py-2.5 text-right font-mono" style={{ color: row.highlight ? 'var(--error)' : 'var(--text-muted)' }}>{row.a}</td>
                      <td className="py-2.5 text-right font-mono" style={{ color: row.highlight ? 'var(--success)' : 'var(--accent-gold)' }}>{row.b}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-medium" style={{ borderColor: 'var(--accent-gold)' }}>
                    <td className="py-2.5 pr-4" style={{ color: 'var(--text-primary)' }}>Ingreso neto</td>
                    <td className="py-2.5 text-right font-mono" style={{ color: 'var(--text-muted)' }}>{formatCurrency(result.currentScenario.netIncome)}</td>
                    <td className="py-2.5 text-right font-mono font-bold" style={{ color: 'var(--accent-gold)' }}>{formatCurrency(result.panamaHubScenario.netIncome)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Line Chart */}
            <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-medium text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Proyección Acumulada ({input.projectionMonths} meses)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.monthlyProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }}
                    labelStyle={{ color: 'var(--text-secondary)' }}
                    formatter={((v: number) => [`$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, '']) as any}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="currentScenarioCumulative" stroke="var(--accent-red)" name="Situación Actual" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="panamaHubCumulative" stroke="var(--accent-gold)" name="Panama Hub" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart + Actions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <h3 className="font-medium text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Distribución de Ingresos</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={((v: number) => formatCurrency(v)) as any} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="p-5 rounded-lg border flex flex-col justify-between" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="p-3 rounded-lg flex items-start gap-2 mb-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Simulación orientativa. Requiere validación por abogado y contador público autorizado.
                  </p>
                </div>
                <div className="space-y-2">
                  <button onClick={handleSave} className="w-full py-2 rounded-lg text-sm font-medium border transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    Guardar simulación
                  </button>
                  <button onClick={handleStartImplementation} className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2" style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}>
                    Iniciar implementación <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
