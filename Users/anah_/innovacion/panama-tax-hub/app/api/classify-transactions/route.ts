import { NextRequest, NextResponse } from 'next/server';
import { toUSD } from '@/lib/stripe-mock';

// Mock classification logic — no AI required
function classifyTransaction(tx: any) {
  const country = tx.customer?.address?.country ?? 'US';
  const productType = tx.metadata?.product_type ?? 'service';
  const amountUSD = toUSD(tx.amount, tx.currency);
  const isPanama = country === 'PA';

  const typeMap: Record<string, string> = {
    subscription: 'suscripcion',
    license: 'licencia',
    service: 'servicio',
    digital_product: 'producto_digital',
    api_access: 'api_access',
    consulting: 'consultoria',
  };

  const incomeSource = isPanama ? 'panama' : 'extranjera';
  const taxTreatment = isPanama
    ? 'potencialmente_gravable'
    : 'no_gravable_territorialidad';

  const riskMap: Record<string, string> = {
    service: 'medio',
    consulting: 'alto',
    subscription: 'bajo',
    license: 'bajo',
    digital_product: 'bajo',
    api_access: 'bajo',
  };

  const reasoningMap: Record<string, string> = {
    extranjera: `Ingreso generado por cliente en ${country}. Bajo el principio de territorialidad del ISR panameño (Art. 694 Código Fiscal), los ingresos de fuente extranjera no constituyen renta gravable en Panamá. El servicio se presta fuera del territorio nacional.`,
    panama: `Ingreso generado por cliente en Panamá. Puede estar sujeto a ISR panameño dependiendo de donde se preste el servicio. Requiere análisis del vínculo económico con el territorio nacional.`,
  };

  const hubRecommendationMap: Record<string, string> = {
    subscription: 'La Sociedad de Emprendimiento en Panamá puede recibir pagos de suscripciones internacionales sin ISR durante los primeros 2 años (Ley 186/2020). Ideal para SaaS.',
    license: 'Las licencias de software vendidas a clientes extranjeros califican como ingreso de fuente extranjera. La estructura Panama Hub optimiza el tratamiento fiscal de manera legal.',
    service: 'Los servicios prestados a clientes extranjeros desde una entidad panameña se benefician del principio de territorialidad. Documentar la prestación del servicio fuera de Panamá es clave.',
    digital_product: 'Los productos digitales vendidos a clientes fuera de Panamá no generan ISR bajo la territorialidad. La estructura Panama Hub es ideal para este modelo.',
    api_access: 'El acceso a APIs vendido a clientes internacionales califica como ingreso extranjero bajo la territorialidad panameña.',
    consulting: 'La consultoría a clientes extranjeros puede estructurarse como ingreso de fuente extranjera. Se recomienda documentación detallada del lugar de prestación del servicio.',
  };

  return {
    transaction_id: tx.id,
    income_source: incomeSource,
    income_type: typeMap[productType] ?? 'servicio',
    tax_treatment: taxTreatment,
    jurisdiction_client: country,
    amount_usd: Math.round(amountUSD * 100) / 100,
    risk_level: riskMap[productType] ?? 'medio',
    reasoning: reasoningMap[incomeSource],
    panama_hub_recommendation: hubRecommendationMap[productType] ?? 'Esta transacción puede optimizarse mediante una estructura de Sociedad de Emprendimiento en Panamá.',
  };
}

export async function POST(req: NextRequest) {
  try {
    const { transactions } = await req.json();

    // Simulate processing delay
    await new Promise(r => setTimeout(r, 800));

    const classifications = transactions.map(classifyTransaction);

    return NextResponse.json({ classifications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
