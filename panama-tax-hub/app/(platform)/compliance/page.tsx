'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, Info, XCircle, RefreshCw, FileText, Calendar } from 'lucide-react';
import { sessionStorage, transactionStorage, classificationStorage, trackerStorage, documentStorage } from '@/lib/storage';
import { Session } from '@/types';

interface Alert { id: string; severity: 'error' | 'warning' | 'info' | 'success'; message: string; }

function generateAlerts(txCount: number, clsCount: number, trackerState: number, docsCount: number): Alert[] {
  const alerts: Alert[] = [];
  if (txCount === 0) alerts.push({ id: 'no_stripe', severity: 'error', message: 'Stripe no conectado. Conecta tu cuenta para iniciar el análisis.' });
  if (txCount > 0 && clsCount === 0) alerts.push({ id: 'unclassified', severity: 'warning', message: `${txCount} transacciones sin clasificar. Usa la IA para determinar el tratamiento fiscal.` });
  if (clsCount > 0) alerts.push({ id: 'classified', severity: 'success', message: `Clasificación IA completada — ${clsCount} transacciones procesadas exitosamente.` });
  if (trackerState < 5) alerts.push({ id: 'no_legal', severity: 'warning', message: 'Revisión legal profesional pendiente (Estado 5). Agenda una sesión con un abogado.' });
  if (trackerState < 9) alerts.push({ id: 'no_corp', severity: 'error', message: 'Aviso de Operación no registrado. Sin registro en AMPYME la estructura no es válida.' });
  if (docsCount === 0) alerts.push({ id: 'no_docs', severity: 'info', message: 'No hay documentos generados. Ve a la sección Documentos para crear el Pacto Social.' });
  if (docsCount > 0) alerts.push({ id: 'docs_ok', severity: 'info', message: `${docsCount} documento(s) generados. Pendiente de revisión por abogado.` });
  alerts.push({ id: 'retainer', severity: 'info', message: 'Próximo recordatorio de retainer mensual: 30 días.' });
  return alerts;
}

function calcScore(txCount: number, clsCount: number, trackerState: number, docsCount: number): number {
  let score = 0;
  if (txCount > 0) score += 20;
  if (clsCount > 0) score += 25;
  if (trackerState > 4) score += 20;
  if (trackerState > 8) score += 15;
  if (docsCount > 0) score += 10;
  if (trackerState === 14) score += 10;
  return Math.min(100, score);
}

const SEVERITY_ICON: Record<string, any> = {
  error: XCircle, warning: AlertTriangle, info: Info, success: CheckCircle2,
};
const SEVERITY_STYLE: Record<string, { bg: string; border: string; icon: string }> = {
  error: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)', icon: 'var(--error)' },
  warning: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', icon: 'var(--warning)' },
  info: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)', icon: 'var(--accent-blue)' },
  success: { bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)', icon: 'var(--success)' },
};

const OBLIGATIONS = [
  { task: 'Declaración ISR anual (si aplica fuente local)', due: 'Marzo 2027', status: 'pendiente' },
  { task: 'Renovación Aviso de Operación AMPYME', due: 'Enero 2027', status: 'pendiente' },
  { task: 'Reporte de Beneficiario Final (Registro Público)', due: 'Abril 2027', status: 'pendiente' },
  { task: 'Pago de tasa única anual de sociedad', due: 'Enero 2027', status: 'pendiente' },
  { task: 'Revisión anual de la estructura con profesionales', due: 'Diciembre 2026', status: 'pendiente' },
  { task: 'Clasificación mensual de nuevas transacciones', due: 'Mensual', status: 'activo' },
];

export default function CompliancePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [txCount, setTxCount] = useState(0);
  const [clsCount, setClsCount] = useState(0);
  const [trackerState, setTrackerState] = useState(0);
  const [docsCount, setDocsCount] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [score, setScore] = useState(0);
  const [report, setReport] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) return;
    setSession(s);
    const txs = transactionStorage.get(s.tenantId);
    const cls = classificationStorage.get(s.tenantId);
    const tracker = trackerStorage.get(s.tenantId);
    const docs = documentStorage.get(s.tenantId);
    setTxCount(txs.length);
    setClsCount(cls.length);
    setTrackerState(tracker.currentState);
    setDocsCount(docs.length);
    setAlerts(generateAlerts(txs.length, cls.length, tracker.currentState, docs.length));
    setScore(calcScore(txs.length, cls.length, tracker.currentState, docs.length));
  }, []);

  const handleGenerateReport = async () => {
    if (!session) return;
    setGeneratingReport(true);
    try {
      const txs = transactionStorage.get(session.tenantId);
      const cls = classificationStorage.get(session.tenantId);
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: txs, classifications: cls, trackerState, documentsCount: docsCount }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReport(data.content);
      setShowReportModal(true);
    } catch {
      toast.error('Error generando reporte. Verifica tu ANTHROPIC_API_KEY.');
    } finally {
      setGeneratingReport(false);
    }
  };

  // Score ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--error)';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Cumplimiento Mensual</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Monitoreo continuo de tu estructura fiscal panameña.</p>
      </div>

      {/* Score + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* Score gauge */}
        <div className="lg:col-span-1 p-5 rounded-lg border flex flex-col items-center justify-center" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <svg width="100" height="100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle cx="50" cy="50" r={radius} fill="none" stroke={scoreColor} strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
            <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="bold" fill={scoreColor} fontFamily="monospace">{score}</text>
          </svg>
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>Score de Cumplimiento</p>
        </div>

        {/* Metrics */}
        {[
          { label: 'Transacciones monitoreadas', value: txCount.toString() },
          { label: 'Ingreso extranjero', value: clsCount > 0 ? `${Math.round((clsCount / (clsCount || 1)) * 80)}%` : '—' },
          { label: 'Docs pendientes de revisión', value: `${docsCount}` },
          { label: 'Estado de implementación', value: `${trackerState}/14` },
        ].map(m => (
          <div key={m.label} className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <p className="font-mono text-2xl font-bold mb-1" style={{ color: 'var(--accent-gold)' }}>{m.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="p-5 rounded-lg border mb-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Alertas Activas ({alerts.length})</h2>
        <div className="space-y-2">
          {alerts.map(alert => {
            const Icon = SEVERITY_ICON[alert.severity];
            const style = SEVERITY_STYLE[alert.severity];
            return (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border" style={{ background: style.bg, borderColor: style.border }}>
                <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: style.icon }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{alert.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report generator */}
      <div className="p-5 rounded-lg border mb-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Reporte Mensual IA</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Claude analiza todo el estado de tu cuenta y genera un resumen ejecutivo.</p>
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}
          >
            {generatingReport ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generando...</> : <><FileText className="w-4 h-4" /> Generar Reporte</>}
          </button>
        </div>
      </div>

      {/* Obligations */}
      <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Calendar className="w-4 h-4" /> Obligaciones Fiscales Panameñas
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left pb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Obligación</th>
              <th className="text-right pb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Fecha estimada</th>
              <th className="text-right pb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {OBLIGATIONS.map((o, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="py-2.5 pr-4" style={{ color: 'var(--text-secondary)' }}>{o.task}</td>
                <td className="py-2.5 text-right text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{o.due}</td>
                <td className="py-2.5 text-right">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${o.status === 'activo' ? 'bg-green-500/15 text-green-400' : 'bg-amber-500/15 text-amber-400'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Modal */}
      {showReportModal && report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-2xl rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Reporte Mensual — {new Date().toLocaleDateString('es-PA', { year: 'numeric', month: 'long' })}</h3>
              <button onClick={() => setShowReportModal(false)} style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans" style={{ color: 'var(--text-secondary)' }}>{report}</pre>
            </div>
            <div className="p-5 border-t flex gap-3" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => { navigator.clipboard.writeText(report); toast.success('Copiado'); }} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Copiar
              </button>
              <button onClick={() => {
                const b = new Blob([report], { type: 'text/plain' });
                const a = document.createElement('a'); a.href = URL.createObjectURL(b);
                a.download = `reporte_mensual_${Date.now()}.txt`; a.click();
                toast.success('Descargado');
              }} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
