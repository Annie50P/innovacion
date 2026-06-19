'use client';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { FileText, Download, Copy, X, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { sessionStorage, profileStorage, simulationStorage, classificationStorage, documentStorage } from '@/lib/storage';
import { Session, GeneratedDocument } from '@/types';

const DOCUMENT_CATALOG = [
  { type: 'pacto_social', title: 'Borrador de Pacto Social', desc: 'Sociedad de Emprendimiento Ley 186/2020', icon: '🏛️', color: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.3)' },
  { type: 'checklist_kyc', title: 'Checklist KYC', desc: 'Know Your Customer para bancos panameños', icon: '✅', color: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)' },
  { type: 'beneficiario_final', title: 'Matriz de Beneficiario Final', desc: 'Formulario de beneficiario real', icon: '👤', color: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.25)' },
  { type: 'carta_notarial', title: 'Carta de Instrucción Notarial', desc: 'Para notaría en Panamá', icon: '📜', color: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.25)' },
  { type: 'reporte_fiscal', title: 'Reporte de Análisis Fiscal', desc: 'Resumen del diagnóstico de la plataforma', icon: '📊', color: 'rgba(230,180,74,0.1)', borderColor: 'rgba(230,180,74,0.25)' },
  { type: 'checklist_bancario', title: 'Checklist Bancario', desc: 'Documentos para apertura de cuenta', icon: '🏦', color: 'rgba(20,184,166,0.1)', borderColor: 'rgba(20,184,166,0.25)' },
  { type: 'nda', title: 'Acuerdo de Confidencialidad (NDA)', desc: 'Para aliados profesionales', icon: '🔒', color: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)' },
  { type: 'modelo_negocio', title: 'Descripción de Modelo de Negocio', desc: 'Para due diligence bancario', icon: '💼', color: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.25)' },
];

export default function DocumentsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [savedDocs, setSavedDocs] = useState<GeneratedDocument[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<typeof DOCUMENT_CATALOG[0] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [tenantProfile, setTenantProfile] = useState<any>(null);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [classificationData, setClassificationData] = useState<any[]>([]);

  useEffect(() => {
    const s = sessionStorage.get();
    if (!s) return;
    setSession(s);
    const docs = documentStorage.get(s.tenantId);
    setSavedDocs(docs);
    setTenantProfile(profileStorage.get(s.tenantId));
    setSimulationData(simulationStorage.get(s.tenantId));
    setClassificationData(classificationStorage.get(s.tenantId));
  }, []);

  const handleGenerate = async (docType: string) => {
    setGenerating(true);
    setGeneratedContent('');
    try {
      const res = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: DOCUMENT_CATALOG.find(d => d.type === docType)?.title, tenantProfile, simulationData, classificationData }),
      });
      if (!res.ok) throw new Error('Error generando documento');
      const data = await res.json();
      setGeneratedContent(data.content);
    } catch {
      toast.error('Error al generar documento. Intenta de nuevo.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDoc = () => {
    if (!session || !selectedCatalog || !generatedContent) return;
    const doc: GeneratedDocument = {
      id: `doc_${Date.now()}`,
      type: selectedCatalog.type,
      title: selectedCatalog.title,
      content: generatedContent,
      createdAt: new Date().toISOString(),
    };
    documentStorage.add(session.tenantId, doc);
    setSavedDocs(documentStorage.get(session.tenantId));
    toast.success('Documento guardado');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Copiado al portapapeles');
  };

  const handleDownload = () => {
    if (!selectedCatalog) return;
    const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCatalog.type}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Documento descargado');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Documentos</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Genera documentos corporativos panameños con IA. {savedDocs.length > 0 && `${savedDocs.length} documentos guardados.`}</p>
      </div>

      {/* Catalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {DOCUMENT_CATALOG.map(doc => {
          const saved = savedDocs.find(s => s.type === doc.type);
          return (
            <button
              key={doc.type}
              onClick={() => { setSelectedCatalog(doc); setGeneratedContent(''); }}
              
              
              className="p-4 rounded-lg border text-left transition-all relative"
              style={{
                background: selectedCatalog?.type === doc.type ? doc.color : 'var(--bg-surface)',
                borderColor: selectedCatalog?.type === doc.type ? doc.borderColor : 'var(--border)',
              }}
            >
              {saved && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />
                </div>
              )}
              <div className="text-2xl mb-3">{doc.icon}</div>
              <p className="text-sm font-medium mb-1 leading-tight" style={{ color: 'var(--text-primary)' }}>{doc.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{doc.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Generator panel */}
      
        {selectedCatalog && (
          <div
            
            
            
            className="rounded-lg border"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedCatalog.icon}</span>
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{selectedCatalog.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selectedCatalog.desc}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedCatalog(null); setGeneratedContent(''); }} style={{ color: 'var(--text-muted)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {/* Pre-populated data preview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Nombre', value: tenantProfile?.name ?? session?.name ?? '—' },
                  { label: 'Empresa', value: tenantProfile?.companyName ?? '—' },
                  { label: 'País', value: tenantProfile?.country ?? '—' },
                  { label: 'Transacciones', value: `${classificationData.length} clasificadas` },
                ].map(field => (
                  <div key={field.label} className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{field.label}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{field.value}</p>
                  </div>
                ))}
              </div>

              {!generatedContent && !generating && (
                <button
                  onClick={() => handleGenerate(selectedCatalog.type)}
                  className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}
                >
                  <Sparkles className="w-4 h-4" /> Generar con IA
                </button>
              )}

              {generating && (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Generando documento con Claude...</p>
                </div>
              )}

              {generatedContent && (
                <div className="space-y-4">
                  <textarea
                    value={generatedContent}
                    onChange={e => setGeneratedContent(e.target.value)}
                    rows={16}
                    className="w-full px-4 py-3 rounded-lg text-xs border outline-none resize-y font-mono leading-relaxed"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />

                  {/* Disclaimer */}
                  <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Este documento es un borrador preliminar. Debe ser revisado por un abogado panameño idóneo antes de su uso. No constituye asesoría legal individualizada.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                      <Copy className="w-4 h-4" /> Copiar
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                      <Download className="w-4 h-4" /> Descargar .txt
                    </button>
                    <button onClick={handleSaveDoc} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ml-auto" style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}>
                      <CheckCircle2 className="w-4 h-4" /> Guardar en cuenta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      

      {/* Saved docs */}
      {savedDocs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Documentos Guardados</h2>
          <div className="space-y-2">
            {savedDocs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{doc.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(doc.createdAt).toLocaleDateString('es-PA')}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const cat = DOCUMENT_CATALOG.find(c => c.type === doc.type);
                    if (cat) setSelectedCatalog(cat);
                    setGeneratedContent(doc.content);
                  }}
                  className="text-xs px-3 py-1.5 rounded border transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
