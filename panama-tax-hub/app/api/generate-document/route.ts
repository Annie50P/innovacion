import { NextRequest, NextResponse } from 'next/server';

const DOCUMENT_TEMPLATES: Record<string, (data: any) => string> = {
  'Borrador de Pacto Social': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

PACTO SOCIAL
SOCIEDAD DE EMPRENDIMIENTO
(Ley 186 de 2020, República de Panamá)

En la ciudad de Panamá, República de Panamá, a los [COMPLETAR] días del mes de [COMPLETAR] de 2026, comparece ante Notario Público:

1. DATOS DEL FUNDADOR
   Nombre: ${d.name ?? '[COMPLETAR NOMBRE]'}
   Empresa/Proyecto: ${d.company ?? '[COMPLETAR EMPRESA]'}
   País de residencia: ${d.country ?? '[COMPLETAR PAÍS]'}
   Documento de identidad: [COMPLETAR]
   Dirección: [COMPLETAR]

2. DENOMINACIÓN SOCIAL
   La sociedad se denominará: "${d.company ?? '[NOMBRE DE LA SOCIEDAD]'}" o similar disponible en el Registro Público de Panamá.

3. OBJETO SOCIAL
   La sociedad tendrá como objeto principal:
   - Desarrollo y comercialización de software y productos digitales
   - Prestación de servicios tecnológicos a clientes internacionales
   - Licenciamiento de propiedad intelectual
   - Consultoría en tecnología y transformación digital
   - Cualquier otra actividad lícita de naturaleza comercial o civil

4. CAPITAL SOCIAL
   El capital social inicial será de CIEN BALBOAS (B/.100.00) dividido en cien (100) acciones comunes nominativas de B/.1.00 cada una, con derecho a voto, sin valor nominal declarado.

5. DOMICILIO
   El domicilio principal de la sociedad será en la Ciudad de Panamá, República de Panamá. [COMPLETAR DIRECCIÓN EXACTA]

6. DURACIÓN
   La sociedad tendrá una duración indefinida a partir de la fecha de inscripción en el Registro Público.

7. ADMINISTRACIÓN
   La sociedad será administrada por una Junta Directiva compuesta por:
   - Presidente: ${d.name ?? '[COMPLETAR]'}
   - Secretario: [COMPLETAR]
   - Tesorero: [COMPLETAR]

8. BENEFICIOS LEY 186/2020
   En virtud de la Ley 186 de 2020 y sus reglamentaciones, la sociedad solicita ser reconocida como Sociedad de Emprendimiento, gozando de:
   - Exoneración del Impuesto sobre la Renta (ISR) durante los primeros dos (2) años de operación
   - Exoneración del Impuesto de Dividendos durante los primeros dos (2) años
   - Registro simplificado ante AMPYME

9. PRINCIPIO DE TERRITORIALIDAD
   Los ingresos generados por actividades prestadas fuera del territorio panameño, conforme al Artículo 694 del Código Fiscal de la República de Panamá, no constituirán renta gravable en Panamá.

10. DISPOSICIONES FINALES
    Para todos los efectos legales, la sociedad se regirá por las leyes de la República de Panamá, especialmente:
    - Ley 186 de 2020 (Sociedades de Emprendimiento)
    - Ley 451 de 2024 (Actualización del marco legal)
    - Código Fiscal de Panamá
    - Ley 52 de 1917 (Sociedades Anónimas, aplicable supletoriamente)

[COMPLETAR - Firma del Fundador]

[COMPLETAR - Firma y sello del Notario Público]

NOTA: Este documento es un borrador orientativo. Debe ser revisado y adaptado por un abogado panameño idóneo antes de su protocolización ante Notario Público.`,

  'Checklist KYC': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

CHECKLIST KYC (KNOW YOUR CUSTOMER)
PARA APERTURA DE CUENTA BANCARIA EMPRESARIAL EN PANAMÁ

Cliente: ${d.name ?? '[NOMBRE]'}
Empresa: ${d.company ?? '[EMPRESA]'}
Fecha: ${new Date().toLocaleDateString('es-PA')}

DOCUMENTOS DEL BENEFICIARIO FINAL
☐ Pasaporte vigente (copia notariada y apostillada)
☐ Comprobante de domicilio reciente (máximo 3 meses)
☐ Referencias bancarias (mínimo 2, en inglés o español)
☐ Declaración de origen lícito de fondos
☐ Formulario de Beneficiario Final (SUGEF/SSNF)
☐ CV o hoja de vida profesional
☐ Referencias comerciales (mínimo 2)

DOCUMENTOS DE LA SOCIEDAD
☐ Escritura pública de constitución (original o copia certificada)
☐ Certificado de inscripción del Registro Público (máximo 3 meses)
☐ Certificado de buena salud corporativa
☐ Aviso de Operación (AMPYME)
☐ Registro de Sociedad de Emprendimiento Ley 186/2020
☐ Pacto social completo
☐ Resolución de Junta Directiva autorizando apertura de cuenta
☐ Lista de accionistas con participaciones

DOCUMENTOS OPERATIVOS
☐ Descripción del modelo de negocio (en español e inglés)
☐ Lista de principales clientes (con países)
☐ Proyección de flujo de caja (12 meses)
☐ Contratos de prestación de servicios (muestra)
☐ Facturación de los últimos 6 meses (si aplica)
☐ Capturas de pantalla de pasarelas de pago activas

DEBIDA DILIGENCIA AMPLIADA (si aplica)
☐ Carta de presentación de abogado panameño
☐ Certificado de antecedentes penales (apostillado)
☐ Declaraciones fiscales del país de residencia

País de residencia del beneficiario: ${d.country ?? '[COMPLETAR]'}
Volumen mensual estimado: ${d.volume ?? '[COMPLETAR]'}

BANCOS RECOMENDADOS EN PANAMÁ
- Banco General
- Banistmo
- Multibank
- Global Bank

NOTAS: [COMPLETAR] El banco asignado puede solicitar documentación adicional según su política interna de cumplimiento AML/KYC.`,

  'Reporte de Análisis Fiscal': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

REPORTE DE ANÁLISIS FISCAL
PANAMA TAX INFRASTRUCTURE HUB
Fecha: ${new Date().toLocaleDateString('es-PA')}

DATOS DEL CLIENTE
Nombre: ${d.name ?? '[COMPLETAR]'}
Empresa: ${d.company ?? '[COMPLETAR]'}
País de residencia actual: ${d.country ?? '[COMPLETAR]'}
Volumen mensual estimado: ${d.volume ?? '[COMPLETAR]'}

1. RESUMEN EJECUTIVO
Este reporte analiza la situación fiscal actual del cliente y evalúa el potencial de optimización mediante una estructura corporativa en la República de Panamá, basada en el principio de territorialidad del Impuesto Sobre la Renta (ISR).

2. MARCO LEGAL APLICABLE
2.1 Principio de Territorialidad
   El Artículo 694 del Código Fiscal panameño establece que solo son gravables los ingresos de fuente panameña. Los ingresos generados por servicios prestados fuera del territorio nacional, a clientes en el exterior, NO constituyen renta gravable en Panamá.

2.2 Sociedad de Emprendimiento (Ley 186/2020)
   Beneficios aplicables:
   - Años 1-2: ISR B/.0 (cero balboas)
   - Años 3-5: ISR al 50% de la tasa regular
   - Registro simplificado ante AMPYME
   - Acceso a programas de apoyo gubernamental

2.3 Ley 451 de 2024
   Actualización del marco legal que consolida los beneficios para emprendedores digitales y empresas de servicios tecnológicos.

3. ANÁLISIS DE TRANSACCIONES
   Total transacciones analizadas: ${d.txCount ?? 0}
   Ingresos de fuente extranjera: ~80% (estimado)
   Ingresos de fuente panameña: ~20% (estimado)
   Tratamiento: No gravable bajo territorialidad (ingresos extranjeros)

4. ESTRUCTURA RECOMENDADA
4.1 Entidad Legal: Sociedad de Emprendimiento (SE)
4.2 Registro: AMPYME + Registro Público de Panamá
4.3 Cuenta bancaria: Banco panameño en USD
4.4 Pasarelas de pago: Reconectar Stripe/PayPal bajo entidad SE

5. PROYECCIÓN DE AHORRO FISCAL
   (Ver módulo Simulador para proyección detallada)

6. PRÓXIMOS PASOS
   1. Revisión legal con abogado panameño idóneo
   2. Constitución de Sociedad de Emprendimiento
   3. Registro AMPYME
   4. Apertura de cuenta bancaria
   5. Reconexión de pasarelas de pago

ADVERTENCIA LEGAL: Este análisis es de carácter orientativo y educativo. No constituye asesoría legal individualizada. Los beneficios fiscales específicos para cada cliente dependen de su situación particular y deben ser validados por un profesional autorizado.`,

  default: (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

DOCUMENTO LEGAL
PANAMA TAX INFRASTRUCTURE HUB

Fecha: ${new Date().toLocaleDateString('es-PA')}
Cliente: ${d.name ?? '[COMPLETAR]'}
Empresa: ${d.company ?? '[COMPLETAR]'}
País: ${d.country ?? '[COMPLETAR]'}

Este documento ha sido generado automáticamente como borrador inicial basado en los datos del cliente. Debe ser revisado, completado y validado por un abogado panameño idóneo antes de su uso oficial.

Los campos marcados como [COMPLETAR] requieren información adicional que debe ser provista por el profesional legal correspondiente.

MARCO LEGAL APLICABLE:
- Ley 186 de 2020 (Sociedades de Emprendimiento)
- Ley 451 de 2024 (actualización)
- Código Fiscal de la República de Panamá
- Principio de Territorialidad del ISR

Para más información, contacte a un abogado panameño idóneo registrado en el Colegio Nacional de Abogados de Panamá.

[COMPLETAR - Contenido específico del documento]
[COMPLETAR - Firma y datos del profesional legal]`,
};

export async function POST(req: NextRequest) {
  try {
    const { documentType, tenantProfile } = await req.json();

    // Simulate generation delay
    await new Promise(r => setTimeout(r, 1200));

    const data = {
      name: tenantProfile?.name,
      company: tenantProfile?.companyName,
      country: tenantProfile?.country,
      volume: tenantProfile?.monthlyVolume,
      txCount: 10,
    };

    const templateFn = DOCUMENT_TEMPLATES[documentType] ?? DOCUMENT_TEMPLATES['default'];
    const content = templateFn(data);

    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
