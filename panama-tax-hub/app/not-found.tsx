import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <p className="font-mono text-xs mb-4" style={{ color: 'var(--text-muted)' }}>🇵🇦 TAXTECH</p>
        <p className="font-mono text-6xl font-bold mb-3" style={{ color: 'var(--accent-gold)' }}>404</p>
        <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Página no encontrada</p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          La ruta que buscas no existe en la plataforma.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 rounded-lg text-sm font-medium"
          style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
