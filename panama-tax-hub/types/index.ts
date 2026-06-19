export interface Tenant {
  id: string;
  name: string;
  email: string;
  password: string;
  companyName: string;
  country: string;
  monthlyVolume: string;
  gateways: string[];
  plan: 'starter' | 'growth' | 'premium';
  createdAt: string;
}

export interface Session {
  tenantId: string;
  email: string;
  name: string;
  loginAt: string;
  isAdmin?: boolean;
}

export interface TenantProfile {
  id: string;
  name: string;
  email: string;
  companyName: string;
  country: string;
  monthlyVolume: string;
  gateways: string[];
  plan: string;
  createdAt: string;
}

export interface StripeTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created: number;
  customer: {
    email: string;
    address: { country: string };
  };
  metadata: {
    product_type: string;
    billing_cycle?: string;
  };
}

export interface TransactionClassification {
  transaction_id: string;
  income_source: 'extranjera' | 'panama' | 'mixta';
  income_type: 'suscripcion' | 'licencia' | 'servicio' | 'producto_digital' | 'api_access' | 'consultoria';
  tax_treatment: 'no_gravable_territorialidad' | 'potencialmente_gravable' | 'requiere_analisis_profesional';
  jurisdiction_client: string;
  amount_usd: number;
  risk_level: 'bajo' | 'medio' | 'alto';
  reasoning: string;
  panama_hub_recommendation: string;
}

export interface SimulationInput {
  monthlyRevenueUSD: number;
  foreignIncomePercentage: number;
  currentTaxRatePercentage: number;
  setupFee: number;
  monthlyRetainer: number;
  projectionMonths: number;
  activeClients?: number;
}

export interface MonthlyProjection {
  month: number;
  cumulativeSavings: number;
  currentScenarioCumulative: number;
  panamaHubCumulative: number;
}

export interface SimulationResult {
  currentScenario: {
    totalIncome: number;
    taxableIncome: number;
    estimatedTax: number;
    netIncome: number;
  };
  panamaHubScenario: {
    totalIncome: number;
    nonTaxableForeignIncome: number;
    taxableLocalIncome: number;
    isrYear1_2: number;
    setupCost: number;
    retainerTotal: number;
    cloudCost: number;
    totalStructureCost: number;
    netIncome: number;
  };
  netSavings: number;
  breakEvenMonths: number;
  monthlyProjection: MonthlyProjection[];
}

export interface TrackerState {
  currentState: number;
  history: Array<{ state: number; completedAt: string }>;
  notes: Record<number, string>;
}

export interface GeneratedDocument {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface ComplianceAlert {
  id: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
  createdAt: string;
}

export interface ComplianceData {
  alerts: ComplianceAlert[];
  lastCheck: string;
  status: string;
  score: number;
}
