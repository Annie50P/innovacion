import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { transactions, classifications, trackerState, documentsCount } = await req.json();

    // Simulate generation delay
    await new Promise(r => setTimeout(r, 1000));

    const txCount = transactions?.length ?? 0;
    const noGravable = classifications?.filter((c: any) => c.tax_treatment === 'no_gravable_territorialidad').length ?? 0;
    const gravable = classifications?.filter((c: any) => c.tax_treatment === 'potencialmente_gravable').length ?? 0;
    const totalUSD = classifications?.reduce((s: number, c: any) => s + (c.amount_usd ?? 0), 0) ?? 0;
    const savingsEst = (noGravable / Math.max(txCount, 1)) * totalUSD * 0.25;

    const content = `REPORTE MENSUAL DE CUMPLIMIENTO FISCAL
PANAMA TAX INFRASTRUCTURE HUB
${new Date().toLocaleDateString('es-PA', { year: 'numeric', month: 'long' })}

════════════════════════════════════════════

1. RESUMEN EJECUTIVO

Durante el período analizado, la plataforma procesó ${txCount} transacciones con un volumen total aproximado de $${totalUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD. El ${txCount > 0 ? Math.round((noGravable / txCount) * 100) : 0}% de los ingresos han sido clasificados como de fuente extranjera y por tanto NO gravables bajo el principio de territorialidad del ISR panameño (Art. 694 Código Fiscal).

Estado de implementación: ${trackerState}/14 estados completados.
Documentos generados: ${documentsCount}.

════════════════════════════════════════════

2. ANÁLISIS DE INGRESOS

2.1 Clasificación por tratamiento fiscal:
   • No gravables (fuente extranjera):   ${noGravable} transacciones
   • Potencialmente gravables:            ${gravable} transacciones
   • En análisis profesional:            ${txCount - noGravable - gravable} transacciones

2.2 Ahorro fiscal estimado del mes:
   Bajo el principio de territorialidad, el ahorro potencial estimado es de:
   $${savingsEst.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
   (calculado sobre tasa referencial del 25% sobre ingresos no gravables)

════════════════════════════════════════════

3. ESTADO DE IMPLEMENTACIÓN

Estado actual del proceso: ${trackerState}/14
${trackerState < 5 ? '⚠️  PENDIENTE: Revisión profesional con abogado panameño (Estado 5)' : ''}
${trackerState < 9 ? '⚠️  PENDIENTE: Inscripción en Registro Público y AMPYME (Estados 9-10)' : ''}
${trackerState >= 9 ? '✅ Estructura corporativa en proceso avanzado' : ''}
${documentsCount > 0 ? `✅ ${documentsCount} documento(s) generados — pendiente de revisión legal` : '⚠️  Sin documentos generados aún'}

════════════════════════════════════════════

4. OBLIGACIONES FISCALES PRÓXIMAS

• Clasificación mensual de nuevas transacciones: MENSUAL
• Renovación Aviso de Operación AMPYME: Enero 2027
• Declaración ISR (si aplica fuente local): Marzo 2027
• Reporte de Beneficiario Final: Abril 2027
• Revisión anual de estructura: Diciembre 2026

════════════════════════════════════════════

5. RECOMENDACIONES PARA EL PRÓXIMO MES

${trackerState < 5 ? '1. URGENTE: Agendar sesión con abogado panameño para revisión profesional del análisis fiscal.' : ''}
${trackerState < 9 ? '2. Avanzar el proceso de constitución de la Sociedad de Emprendimiento (Notaría + Registro Público).' : ''}
${documentsCount === 0 ? '3. Generar el Borrador de Pacto Social en el módulo de Documentos.' : ''}
4. Mantener registros detallados de la ubicación de prestación de servicios (para documentar territorialidad).
5. Separar cuentas bancarias: ingresos extranjeros vs. ingresos de fuente panameña.
6. Conservar contratos de servicio con clientes internacionales como respaldo documental.

════════════════════════════════════════════

6. ADVERTENCIA LEGAL

Este reporte es de carácter informativo y orientativo. No constituye asesoría legal individualizada. Los beneficios fiscales aplicables a cada caso específico deben ser validados por un abogado y contador público autorizado en la República de Panamá.

════════════════════════════════════════════
Panama Tax Infrastructure Hub — Proyecto Académico UTP
Generado automáticamente el ${new Date().toLocaleString('es-PA')}`;

    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
