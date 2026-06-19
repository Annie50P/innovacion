export default function PlatformLoading() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar skeleton */}
      <div className="fixed left-0 top-0 h-full border-r" style={{ width: 240, background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div className="px-5 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="h-6 w-24 rounded animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
        </div>
        <div className="py-4 px-3 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg animate-pulse" style={{ background: 'var(--bg-elevated)', opacity: 1 - i * 0.1 }} />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <main className="flex-1 p-8" style={{ marginLeft: 240 }}>
        <div className="max-w-7xl mx-auto">
          <div className="h-7 w-48 rounded mb-2 animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
          <div className="h-4 w-72 rounded mb-8 animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 rounded-lg border animate-pulse" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', height: 100 }} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
