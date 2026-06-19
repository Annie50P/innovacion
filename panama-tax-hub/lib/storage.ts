import { Tenant, Session, TenantProfile, StripeTransaction, TransactionClassification, SimulationResult, TrackerState, GeneratedDocument, ComplianceData } from '@/types';

const PREFIX = 'taxhub';

const isBrowser = typeof window !== 'undefined';

function get<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

// Tenants list (master)
export const tenantStorage = {
  getAll: (): Tenant[] => get<Tenant[]>(`${PREFIX}:tenants`) ?? [],
  save: (tenants: Tenant[]) => set(`${PREFIX}:tenants`, tenants),
  add: (tenant: Tenant) => {
    const all = tenantStorage.getAll();
    tenantStorage.save([...all, tenant]);
  },
  findByEmail: (email: string): Tenant | undefined =>
    tenantStorage.getAll().find(t => t.email === email),
};

// Session
export const sessionStorage = {
  get: (): Session | null => get<Session>(`${PREFIX}:session`),
  set: (session: Session) => set(`${PREFIX}:session`, session),
  clear: () => remove(`${PREFIX}:session`),
};

// Tenant-scoped storage
export function tenantKey(tenantId: string, scope: string) {
  return `${PREFIX}:tenant_${tenantId}:${scope}`;
}

export const profileStorage = {
  get: (id: string): TenantProfile | null => get(tenantKey(id, 'profile')),
  set: (id: string, profile: TenantProfile) => set(tenantKey(id, 'profile'), profile),
};

export const transactionStorage = {
  get: (id: string): StripeTransaction[] => get(tenantKey(id, 'transactions')) ?? [],
  set: (id: string, txs: StripeTransaction[]) => set(tenantKey(id, 'transactions'), txs),
};

export const classificationStorage = {
  get: (id: string): TransactionClassification[] => get(tenantKey(id, 'classifications')) ?? [],
  set: (id: string, c: TransactionClassification[]) => set(tenantKey(id, 'classifications'), c),
};

export const simulationStorage = {
  get: (id: string): SimulationResult | null => get(tenantKey(id, 'simulation')),
  set: (id: string, s: SimulationResult) => set(tenantKey(id, 'simulation'), s),
};

export const trackerStorage = {
  get: (id: string): TrackerState => get(tenantKey(id, 'tracker')) ?? { currentState: 0, history: [], notes: {} },
  set: (id: string, t: TrackerState) => set(tenantKey(id, 'tracker'), t),
};

export const documentStorage = {
  get: (id: string): GeneratedDocument[] => get(tenantKey(id, 'documents')) ?? [],
  set: (id: string, docs: GeneratedDocument[]) => set(tenantKey(id, 'documents'), docs),
  add: (id: string, doc: GeneratedDocument) => {
    const docs = documentStorage.get(id);
    documentStorage.set(id, [...docs, doc]);
  },
};

export const complianceStorage = {
  get: (id: string): ComplianceData | null => get(tenantKey(id, 'compliance')),
  set: (id: string, c: ComplianceData) => set(tenantKey(id, 'compliance'), c),
};
