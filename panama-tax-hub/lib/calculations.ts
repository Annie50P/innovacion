import { SimulationInput, SimulationResult } from '@/types';

export function calculateSimulation(input: SimulationInput): SimulationResult {
  const {
    monthlyRevenueUSD,
    foreignIncomePercentage,
    currentTaxRatePercentage,
    setupFee,
    monthlyRetainer,
    projectionMonths,
    activeClients = 10,
  } = input;

  const annualRevenue = monthlyRevenueUSD * 12;
  const foreignIncomeFraction = foreignIncomePercentage / 100;
  const domesticIncomeFraction = 1 - foreignIncomeFraction;

  // Escenario actual
  const currentTaxableIncome = annualRevenue;
  const currentTax = currentTaxableIncome * (currentTaxRatePercentage / 100);
  const currentNetIncome = annualRevenue - currentTax;

  // Escenario Panama Hub
  const foreignIncome = annualRevenue * foreignIncomeFraction;
  const localIncome = annualRevenue * domesticIncomeFraction;
  const isrYear1_2 = 0; // Exoneración Sociedad de Emprendimiento años 1-2
  const cloudCost = (50 + 25 * activeClients) * 12;
  const retainerTotal = monthlyRetainer * 12;
  const totalStructureCost = setupFee + retainerTotal + cloudCost;
  const panamaNetIncome = annualRevenue - isrYear1_2 - totalStructureCost;

  const netSavings = panamaNetIncome - currentNetIncome;

  // Break-even: cuántos meses hasta que el ahorro cubra el setup
  const monthlySaving = (currentTax / 12) - monthlyRetainer - (50 + 25 * activeClients);
  const breakEvenMonths = monthlySaving > 0 ? Math.ceil(setupFee / monthlySaving) : projectionMonths;

  // Proyección mensual
  const monthlyProjection = Array.from({ length: projectionMonths }, (_, i) => {
    const month = i + 1;
    const currentCum = currentNetIncome * (month / 12);
    const panamaCum = (annualRevenue * (month / 12)) - (setupFee) - (monthlyRetainer * month) - ((50 + 25 * activeClients) * month);
    return {
      month,
      cumulativeSavings: Math.max(0, panamaCum - currentCum),
      currentScenarioCumulative: currentCum,
      panamaHubCumulative: panamaCum,
    };
  });

  return {
    currentScenario: {
      totalIncome: annualRevenue,
      taxableIncome: currentTaxableIncome,
      estimatedTax: currentTax,
      netIncome: currentNetIncome,
    },
    panamaHubScenario: {
      totalIncome: annualRevenue,
      nonTaxableForeignIncome: foreignIncome,
      taxableLocalIncome: localIncome,
      isrYear1_2,
      setupCost: setupFee,
      retainerTotal,
      cloudCost,
      totalStructureCost,
      netIncome: panamaNetIncome,
    },
    netSavings,
    breakEvenMonths: Math.max(1, breakEvenMonths),
    monthlyProjection,
  };
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-PA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const TAX_RATES_BY_COUNTRY: Record<string, number> = {
  US: 21, MX: 30, CO: 35, AR: 30, CL: 27, PE: 29.5, BR: 34,
  ES: 25, DE: 30, FR: 25, GB: 25, CA: 26.5, AU: 30,
  PA: 25, CR: 30, GT: 25, HN: 30, NI: 30, SV: 30, DO: 27,
};
