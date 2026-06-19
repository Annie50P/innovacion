'use client';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { CheckCircle2, Clock, ChevronRight, FileText, User, Zap } from 'lucide-react';
import { sessionStorage, trackerStorage, transactionStorage, classificationStorage } from '@/lib/storage';
import { TrackerState, Session } from '@/types';

const STATES = [
  { id: 0, title: 'Registro y validación inicial', desc: 'El sistema valida la información del tenant, verifica los datos de registro y crea el perfil fiscal base.', responsible: 'Sistema', icon: '👤', criteria: 'Perfil completo y verificado', docs: ['Formulario de registro completado', 'Verificación de email'] },
  { id: 1, title: 'Conexión de pasarelas de pago', desc: 'El cliente conecta sus pasarelas de pago (Stripe, PayPal, Wise) para sincronizar el historial de transacciones.', responsible: 'Cliente', icon: '🔗', criteria: 'Al menos una pasarela conectada con transacciones', docs: ['API Key de Stripe configurada', 'Historial sincronizado'] },
  { id: 2, title: 'Ingesta y normalización', desc: 'El sistema importa y normaliza los datos de transacciones, convirtiendo todas las monedas a USD y estandarizando el formato.', responsible: 'Sistema', icon: '📊', criteria: 'Transacciones importadas y normalizadas', docs: ['Reporte de transacciones normalizadas'] },
  { id: 3, title: 'Clasificación con IA', desc: 'La IA analiza cada transacción y la clasifica según el principio de territorialidad del ISR panameño.', responsible: 'Sistema + IA', icon: '🤖', criteria: 'Todas las transacciones clasificadas', docs: ['Reporte de clasificación fiscal IA', 'Matriz de ingresos por fuente'] },
  { id: 4, title: 'Simulación de exposición fiscal', desc: 'El simulador calcula el ahorro potencial comparando la situación actual con la estructura Panama Hub.', responsible: 'Sistema', icon: '📈', criteria: 'Simulación completada y guardada', docs: ['Reporte de simulación fiscal', 'Comparativa de escenarios'] },
  { id: 5, title: 'Revisión profesional', desc: 'Un abogado panameño idóneo revisa el análisis fiscal y valida la viabilidad de la estructura para el cliente específico.', responsible: 'Abogado', icon: '⚖️', criteria: 'Revisión legal completada y firmada', docs: ['Dictamen legal preliminar', 'Informe de viabilidad'] },
  { id: 6, title: 'Propuesta y aprobación', desc: 'El cliente revisa la propuesta completa de estructura Panama Hub y da su aprobación formal para proceder.', responsible: 'Cliente', icon: '✅', criteria: 'Propuesta aceptada por el cliente', docs: ['Propuesta firmada', 'Carta de instrucción inicial'] },
  { id: 7, title: 'Generación documental automática', desc: 'El sistema genera automáticamente todos los borradores de documentos corporativos necesarios usando IA.', responsible: 'Sistema', icon: '📄', criteria: 'Todos los documentos borrador generados', docs: ['Borrador de Pacto Social', 'Checklist KYC', 'Carta de instrucción notarial', 'Descripción del modelo de negocio'] },
  { id: 8, title: 'Revisión legal de documentos', desc: 'El abogado panameño revisa y corrije todos los documentos generados para asegurar su validez legal.', responsible: 'Abogado', icon: '🔍', criteria: 'Documentos revisados y aprobados por abogado', docs: ['Pacto Social definitivo', 'Documentos KYC revisados'] },
  { id: 9, title: 'Notaría y Registro Público', desc: 'Los documentos se protocolizan ante notaría pública y se inscriben en el Registro Público de Panamá.', responsible: 'Notario', icon: '🏛️', criteria: 'Sociedad inscrita en Registro Público', docs: ['Escritura pública protocolizada', 'Certificado de Registro Público', 'Ficha de la sociedad'] },
  { id: 10, title: 'Aviso de Operación', desc: 'Se obtiene el Aviso de Operación ante AMPYME (Autoridad de la Micro, Pequeña y Mediana Empresa).', responsible: 'AMPYME', icon: '📜', criteria: 'Aviso de Operación emitido', docs: ['Aviso de Operación AMPYME', 'Registro como Sociedad de Emprendimiento'] },
  { id: 11, title: 'Onboarding bancario', desc: 'Se abre cuenta bancaria empresarial en un banco panameño. Proceso de KYC/AML con el banco seleccionado.', responsible: 'Banco', icon: '🏦', criteria: 'Cuenta bancaria abierta y operativa', docs: ['Checklist bancario completado', 'Cuenta bancaria activa', 'Tarjeta empresarial'] },
  { id: 12, title: 'Conexión operativa de pasarelas', desc: 'El cliente reconecta sus pasarelas de pago (Stripe, PayPal) bajo la nueva entidad panameña.', responsible: 'Cliente', icon: '💳', criteria: 'Pasarelas operando bajo entidad panameña', docs: ['Stripe account actualizado', 'PayPal verificado', 'Flujos de pago reconectados'] },
  { id: 13, title: 'Activación monitoreo mensual', desc: 'Se activa el sistema de monitoreo continuo: clasificación mensual de transacciones, alertas de cumplimiento y reportes automáticos.', responsible: 'Sistema', icon: '👁️', criteria: 'Sistema de monitoreo activo', docs: ['Primer reporte mensual generado', 'Alertas configuradas'] },
  { id: 14, title: 'Auditoría y mejora continua', desc: 'El sistema realiza auditorías trimestrales automáticas y el equipo profesional revisa la estructura anualmente.', responsible: 'Sistema', icon: '🔄', criteria: 'Primera auditoría completada', docs: ['Reporte de auditoría Q1', 'Plan de mejora continua'] },
];

export default function TrackerPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [tracker, setTracker] = useState<TrackerState>({ currentState: 0, history: [], notes: {} });
  const [selected, setSelected] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) return;
    setSession(s);

    const t = trackerStorage.get(s.tenantId);
    const txs = transactionStorage.get(s.tenantId);
    const cls = classificationStorage.get(s.tenantId);

    // Auto-complete first 4 states if data exists
    let autoState = 0;
    if (txs.length > 0) autoState = Math.max(autoState, 2);
    if (cls.length > 0) autoState = Math.max(autoState, 4);

    const updated = { ...t, currentState: Math.max(t.currentState, autoState) };
    setTracker(updated);
    setSelected(updated.currentState);
    setNoteText(updated.notes[updated.currentState] ?? '');
  }, []);

  const saveNote = () => {
    if (!session) return;
    const updated = { ...tracker, notes: { ...tracker.notes, [selected]: noteText } };
    setTracker(updated);
    trackerStorage.set(session.tenantId, updated);
    toast.success('Nota guardada');
  };

  const advanceState = () => {
    if (!session || tracker.currentState >= 14) return;
    const nextState = tracker.currentState + 1;
    const updated: TrackerState = {
      currentState: nextState,
      history: [...tracker.history, { state: tracker.currentState, completedAt: new Date().toISOString() }],
      notes: tracker.notes,
    };
    setTracker(updated);
    trackerStorage.set(session.tenantId, updated);
    setSelected(nextState);
    setNoteText(updated.notes[nextState] ?? '');
    setConfirming(false);
    toast.success(`Estado ${nextState}: ${STATES[nextState].title}`);
  };

  const getStateVariant = (stateId: number) => {
    if (stateId < tracker.currentState) return 'completed';
    if (stateId === tracker.currentState) return 'active';
    return 'pending';
  };

  const selectedState = STATES[selected];
  const historyEntry = tracker.history.find(h => h.state === selected);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Tracker de Implementación</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Estado {tracker.currentState}/14 — {STATES[tracker.currentState]?.title}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
          <span>Progreso general</span>
          <span>{Math.round((tracker.currentState / 14) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ background: 'var(--accent-gold)', width: `${(tracker.currentState / 14) * 100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="xl:col-span-1 space-y-1 overflow-y-auto" style={{ maxHeight: '75vh' }}>
          {STATES.map(state => {
            const variant = getStateVariant(state.id);
            return (
              <button
                key={state.id}
                onClick={() => { setSelected(state.id); setNoteText(tracker.notes[state.id] ?? ''); }}
                className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all"
                style={{
                  background: selected === state.id ? 'rgba(230,180,74,0.1)' : 'transparent',
                  border: `1px solid ${selected === state.id ? 'rgba(230,180,74,0.3)' : 'transparent'}`,
                }}
              >
                {/* Status dot */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${variant === 'active' ? 'pulse-gold' : ''}`}
                  style={{
                    background: variant === 'completed' ? 'var(--success)' : variant === 'active' ? 'var(--accent-gold)' : 'var(--bg-elevated)',
                    border: `2px solid ${variant === 'completed' ? 'var(--success)' : variant === 'active' ? 'var(--accent-gold)' : 'var(--border)'}`,
                  }}>
                  {variant === 'completed' ? '✓' : state.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{
                    color: variant === 'completed' ? 'var(--text-muted)' : variant === 'active' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  }}>
                    {state.icon} {state.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{state.responsible}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="xl:col-span-2 space-y-5">
          
            <div key={selected}   >
              {/* State header */}
              <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{selectedState.icon}</span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                        Estado {selected}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        getStateVariant(selected) === 'completed' ? 'bg-green-500/15 text-green-400' :
                        getStateVariant(selected) === 'active' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-gray-500/15 text-gray-400'
                      }`}>
                        {getStateVariant(selected) === 'completed' ? 'Completado' :
                         getStateVariant(selected) === 'active' ? 'En progreso' : 'Pendiente'}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedState.title}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                    <User className="w-3 h-3" />
                    {selectedState.responsible}
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{selectedState.desc}</p>
                <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--bg-elevated)' }}>
                  <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Criterio de completado: </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedState.criteria}</span>
                </div>
                {historyEntry && (
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    Completado: {new Date(historyEntry.completedAt).toLocaleDateString('es-PA')}
                  </p>
                )}
              </div>

              {/* Documents */}
              <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FileText className="w-4 h-4" /> Documentos de este estado
                </h3>
                <div className="space-y-2">
                  {selectedState.docs.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: getStateVariant(selected) === 'completed' ? 'var(--success)' : 'var(--border)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Notas del caso</h3>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={4}
                  placeholder="Agrega notas sobre este estado de implementación..."
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none resize-none"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button onClick={saveNote} className="mt-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  Guardar nota
                </button>
              </div>

              {/* Advance button */}
              {selected === tracker.currentState && tracker.currentState < 14 && (
                <div className="p-5 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                  {!confirming ? (
                    <button
                      onClick={() => setConfirming(true)}
                      className="w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                      style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}
                    >
                      Marcar como completado y avanzar al Estado {selected + 1}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="text-center space-y-3">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        ¿Confirmas que el Estado {selected} está completado?
                      </p>
                      <div className="flex gap-3">
                        <button onClick={() => setConfirming(false)} className="flex-1 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                          Cancelar
                        </button>
                        <button onClick={advanceState} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--success)', color: '#fff' }}>
                          Confirmar avance
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tracker.currentState === 14 && (
                <div className="p-5 rounded-lg border text-center" style={{ background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.3)' }}>
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--success)' }} />
                  <p className="font-semibold" style={{ color: 'var(--success)' }}>¡Implementación completa!</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Tu estructura Panama Hub está operativa.</p>
                </div>
              )}
            </div>
          
        </div>
      </div>
    </div>
  );
}
