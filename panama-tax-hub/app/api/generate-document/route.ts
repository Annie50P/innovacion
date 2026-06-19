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

  'Matriz de Beneficiario Final': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

MATRIZ DE BENEFICIARIO FINAL
DECLARACIÓN DE BENEFICIARIO REAL / ULTIMATE BENEFICIAL OWNER (UBO)
República de Panamá — Ley 23 de 2015 y modificaciones

Fecha: ${new Date().toLocaleDateString('es-PA')}
Empresa declarante: ${d.company ?? '[COMPLETAR]'}

1. DATOS DEL BENEFICIARIO FINAL
   Nombre completo: ${d.name ?? '[COMPLETAR]'}
   Tipo de documento: [  ] Cédula  [  ] Pasaporte  [  ] Otro
   Número de documento: [COMPLETAR]
   País emisor: ${d.country ?? '[COMPLETAR]'}
   Fecha de vencimiento: [COMPLETAR]
   Fecha de nacimiento: [COMPLETAR]
   Nacionalidad: [COMPLETAR]
   País de residencia: ${d.country ?? '[COMPLETAR]'}
   Dirección de residencia: [COMPLETAR]
   PEP (Persona Expuesta Políticamente): [  ] Sí  [  ] No
   FATCA/CRS aplicable: [  ] Sí  [  ] No

2. PORCENTAJE DE PARTICIPACIÓN
   Porcentaje accionario: 100% (fundador único)
   Tipo de control: [  ] Directo  [  ] Indirecto  [  ] Otro
   Naturaleza del control: Control total sobre la sociedad

3. ESTRUCTURA CORPORATIVA
   Tipo de entidad: Sociedad de Emprendimiento (Ley 186/2020)
   Jurisdicción: República de Panamá
   Registro: [COMPLETAR — Número de Ficha del Registro Público]

4. ORIGEN DE FONDOS Y PATRIMONIO
   Fuente principal de ingresos: Servicios tecnológicos / Software / Consultoría digital
   País de origen de fondos: Clientes internacionales (ingresos de fuente extranjera)
   Volumen mensual estimado: ${d.volume ?? '[COMPLETAR]'}
   Justificación del patrimonio: Ingresos por prestación de servicios digitales a clientes en el exterior

5. DECLARACIÓN JURADA
   Yo, ${d.name ?? '[NOMBRE COMPLETO]'}, en mi condición de beneficiario final de la sociedad ${d.company ?? '[EMPRESA]'}, declaro bajo juramento que:
   a) La información suministrada es verdadera y completa.
   b) Los fondos utilizados provienen de actividades lícitas.
   c) No soy PEP ni tengo relación con actividades ilícitas.
   d) Me comprometo a notificar cualquier cambio en un plazo de 30 días.

Firma del Beneficiario Final: ________________________
Nombre: ${d.name ?? '[COMPLETAR]'}
Fecha: ${new Date().toLocaleDateString('es-PA')}

[COMPLETAR - Firma y sello del Notario Público o funcionario autorizado]

NOTA: Este formulario debe ser completado, firmado y entregado al banco o entidad financiera correspondiente junto con copia notariada del documento de identidad.`,

  'Carta de Instrucción Notarial': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

CARTA DE INSTRUCCIÓN NOTARIAL
PANAMA TAX INFRASTRUCTURE HUB

${new Date().toLocaleDateString('es-PA')}

Señor(a) Notario(a) Público(a)
[NOMBRE DEL DESPACHO NOTARIAL]
Ciudad de Panamá, República de Panamá

Estimado(a) Notario(a):

Por medio de la presente, yo, ${d.name ?? '[NOMBRE COMPLETO]'}, portador(a) de [TIPO Y NÚMERO DE DOCUMENTO], en mi condición de fundador(a) y representante legal de la sociedad ${d.company ?? '[NOMBRE DE LA SOCIEDAD]'}, me dirijo a usted para impartir las siguientes instrucciones:

1. OBJETO DE LA INSTRUCCIÓN
   Solicito que proceda con la protocolización del Pacto Social adjunto para la constitución de una Sociedad de Emprendimiento al amparo de la Ley 186 de 2020 y sus modificaciones, en la República de Panamá.

2. DATOS DE LA SOCIEDAD A CONSTITUIR
   Denominación social propuesta: ${d.company ?? '[NOMBRE]'} S.E. (sujeto a disponibilidad en Registro Público)
   Tipo de entidad: Sociedad de Emprendimiento
   Capital social: B/.100.00 (Cien Balboas)
   Objeto social: Servicios tecnológicos, desarrollo de software y consultoría digital

3. INSTRUCCIONES ESPECÍFICAS
   a) Verificar la disponibilidad del nombre en el Registro Público de Panamá antes de proceder.
   b) Protocolizar el Pacto Social en su integridad, sin modificaciones no autorizadas.
   c) Gestionar la inscripción en el Registro Público de Panamá.
   d) Una vez inscrita, emitir certificación de la ficha de la sociedad.
   e) Notificar a Panama Tax Infrastructure Hub la fecha y número de inscripción.

4. HONORARIOS Y COSTOS
   Los honorarios notariales y costos de inscripción serán cubiertos por el cliente según tarifa acordada.
   [COMPLETAR — Monto acordado]

5. DOCUMENTOS ADJUNTOS
   ☐ Borrador de Pacto Social
   ☐ Copia de documento de identidad del fundador
   ☐ Formulario de información del beneficiario final

Quedo a su disposición para cualquier consulta adicional.

Atentamente,

${d.name ?? '[NOMBRE COMPLETO]'}
Fundador(a) — ${d.company ?? '[EMPRESA]'}
País de residencia: ${d.country ?? '[PAÍS]'}
[COMPLETAR — Contacto]

NOTA: Esta carta es un borrador orientativo. Debe ser adaptada y validada por el abogado panameño asignado al caso antes de su envío a la notaría.`,

  'Checklist Bancario': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

CHECKLIST DE APERTURA DE CUENTA BANCARIA EMPRESARIAL
PANAMÁ — SOCIEDAD DE EMPRENDIMIENTO
Fecha: ${new Date().toLocaleDateString('es-PA')}

Cliente: ${d.name ?? '[NOMBRE]'}
Empresa: ${d.company ?? '[EMPRESA]'}
País de residencia: ${d.country ?? '[PAÍS]'}
Volumen mensual estimado: ${d.volume ?? '[COMPLETAR]'}

═══════════════════════════════════════════════
FASE 1: DOCUMENTOS CORPORATIVOS
═══════════════════════════════════════════════
☐ Escritura pública de constitución (original notariado)
☐ Certificado de inscripción del Registro Público (máx. 3 meses)
☐ Certificado de buena salud / vigencia de la sociedad
☐ Aviso de Operación emitido por AMPYME
☐ Resolución de Junta Directiva autorizando apertura de cuenta
☐ Lista actualizada de accionistas y porcentajes
☐ Pacto social completo (copia)

═══════════════════════════════════════════════
FASE 2: DOCUMENTOS DEL BENEFICIARIO FINAL
═══════════════════════════════════════════════
☐ Pasaporte vigente (copia notariada y apostillada)
☐ Comprobante de domicilio reciente (máx. 3 meses)
☐ 2 referencias bancarias personales o comerciales
☐ Formulario UBO/Beneficiario Final firmado
☐ Declaración de origen de fondos
☐ CV profesional o perfil empresarial
☐ Declaración de no ser PEP

═══════════════════════════════════════════════
FASE 3: DOCUMENTOS OPERATIVOS DEL NEGOCIO
═══════════════════════════════════════════════
☐ Descripción del modelo de negocio (1-2 páginas)
☐ Lista de principales clientes con países
☐ Proyección de flujo de caja (12 meses)
☐ Capturas de Stripe/PayPal con historial de transacciones
☐ Muestra de contrato de servicios (cliente/proveedor)
☐ Facturación o extractos bancarios de los últimos 6 meses

═══════════════════════════════════════════════
FASE 4: DUE DILIGENCE AMPLIADO (si el banco lo solicita)
═══════════════════════════════════════════════
☐ Carta de presentación de abogado panameño idóneo
☐ Antecedentes penales apostillados (del país de residencia)
☐ Declaraciones de impuestos del país de residencia
☐ Estados financieros o proyecciones (si tiene historial)
☐ Carta de referencia de profesional aliado (abogado/contador)

═══════════════════════════════════════════════
BANCOS RECOMENDADOS EN PANAMÁ
═══════════════════════════════════════════════
1. Banco General — Alta aceptación de no residentes
2. Banistmo (HSBC) — Fuerte en banca digital y trade
3. Multibank — Apertura ágil para startups
4. Global Bank — Buena experiencia con SEMEs

NOTA: Los requisitos pueden variar por banco y por el perfil de riesgo del cliente. Panama Tax Infrastructure Hub coordinará la documentación con el banco seleccionado.

Estado del proceso: [  ] Pendiente  [  ] En revisión  [  ] Presentado  [  ] Aprobado`,

  'Acuerdo de Confidencialidad (NDA)': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN
(NON-DISCLOSURE AGREEMENT — NDA)
República de Panamá

Ciudad de Panamá, ${new Date().toLocaleDateString('es-PA')}

PARTES

PARTE DIVULGADORA:
${d.company ?? '[NOMBRE DE LA EMPRESA]'}
Representada por: ${d.name ?? '[NOMBRE DEL REPRESENTANTE]'}
País de constitución: República de Panamá

PARTE RECEPTORA:
[NOMBRE DEL PROFESIONAL / ALIADO / INSTITUCIÓN]
[TIPO DE ENTIDAD Y JURISDICCIÓN]
Representada por: [NOMBRE]
En su condición de: [ABOGADO / CONTADOR / ASESOR / BANCO]

ANTECEDENTES

Las partes desean intercambiar información confidencial con el propósito de: [COMPLETAR — ej. revisión legal de la estructura corporativa / apertura de cuenta bancaria / asesoría fiscal].

CLÁUSULAS

1. DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL
   Se considera confidencial: información financiera, datos de transacciones, composición accionaria, estrategia fiscal, datos de clientes, documentos corporativos, modelos de negocio, proyecciones, y cualquier otra información marcada como confidencial.

2. OBLIGACIONES DE CONFIDENCIALIDAD
   La Parte Receptora se obliga a:
   a) Mantener la información en estricta confidencialidad.
   b) No divulgar a terceros sin consentimiento previo por escrito.
   c) Usar la información exclusivamente para el propósito acordado.
   d) Proteger la información con medidas de seguridad razonables.

3. EXCEPCIONES
   Las obligaciones no aplican a información que:
   a) Sea de dominio público sin culpa de la Parte Receptora.
   b) Deba divulgarse por orden judicial o regulatoria.
   c) Sea conocida previamente de forma legítima.

4. VIGENCIA
   Este acuerdo tendrá vigencia de [2/3/5] años a partir de la firma, o hasta que la información pierda su carácter confidencial.

5. PENALIDADES
   El incumplimiento generará responsabilidad civil y podrá ser reclamado ante los tribunales competentes de la República de Panamá.

6. LEY APLICABLE
   Este acuerdo se rige por las leyes de la República de Panamá.

FIRMAS

___________________________          ___________________________
${d.name ?? '[PARTE DIVULGADORA]'}        [PARTE RECEPTORA]
${d.company ?? '[EMPRESA]'}              [EMPRESA/INSTITUCIÓN]
Fecha: ${new Date().toLocaleDateString('es-PA')}           Fecha: _______________

NOTA: Este NDA es un borrador orientativo. Debe ser revisado por un abogado panameño antes de su firma.`,

  'Descripción de Modelo de Negocio': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

DESCRIPCIÓN DEL MODELO DE NEGOCIO
Para Due Diligence Bancario y Apertura de Cuenta
Panama Tax Infrastructure Hub

Fecha: ${new Date().toLocaleDateString('es-PA')}

DATOS DE LA EMPRESA
Nombre: ${d.company ?? '[COMPLETAR]'}
Tipo: Sociedad de Emprendimiento (Ley 186/2020, República de Panamá)
Representante Legal: ${d.name ?? '[COMPLETAR]'}
País de residencia del fundador: ${d.country ?? '[COMPLETAR]'}
Sitio web: [COMPLETAR]
Correo de contacto: [COMPLETAR]

1. DESCRIPCIÓN GENERAL DEL NEGOCIO
   ${d.company ?? 'La empresa'} es una empresa de servicios digitales que desarrolla y comercializa [DESCRIBIR: software / plataformas SaaS / servicios de consultoría / productos digitales] a clientes ubicados principalmente en [PAÍSES DE CLIENTES].

   El modelo de negocio se basa en:
   [  ] Suscripción mensual / recurrente (SaaS)
   [  ] Proyectos por contrato
   [  ] Licenciamiento de software
   [  ] Consultoría y servicios profesionales
   [  ] Marketplace o comisiones
   [  ] Otro: [COMPLETAR]

2. CLIENTES Y MERCADO OBJETIVO
   Perfil de cliente: [COMPLETAR — ej. startups tecnológicas, empresas SaaS, agencias digitales]
   Países principales de clientes: [COMPLETAR — ej. Estados Unidos, España, México, Colombia]
   Número de clientes activos: [COMPLETAR]
   Contrato promedio: [COMPLETAR]
   Pasarelas de pago utilizadas: Stripe / PayPal / Wise / [OTRAS]

3. ESTRUCTURA DE INGRESOS
   Volumen mensual estimado: ${d.volume ?? '[COMPLETAR]'}
   Moneda principal: USD
   Ciclo de facturación: [  ] Mensual  [  ] Anual  [  ] Por proyecto
   % ingresos de fuente extranjera: ~[COMPLETAR]%
   % ingresos de fuente panameña: ~[COMPLETAR]%

4. PRINCIPIO DE TERRITORIALIDAD FISCAL
   Conforme al Artículo 694 del Código Fiscal panameño, los ingresos generados por servicios prestados a clientes en el exterior no constituyen renta gravable en Panamá. La empresa opera bajo este principio de territorialidad.

5. EQUIPO Y OPERACIÓN
   Fundadores: ${d.name ?? '[COMPLETAR]'} y [OTROS SOCIOS SI APLICA]
   Modalidad: Operación 100% remota / digital
   Empleados en Panamá: [COMPLETAR]
   Proveedores en Panamá: [Abogados, contadores, servicios cloud locales]

6. FLUJO DE FONDOS
   Origen: Pagos de clientes internacionales vía Stripe/PayPal/Wise
   Destino: Cuenta bancaria empresarial en Panamá + gastos operativos
   Uso de fondos: Desarrollo de producto, operaciones, servicios profesionales

7. REFERENCIAS PROFESIONALES
   Abogado responsable: [NOMBRE Y COLEGIATURA]
   Contador: [NOMBRE Y REGISTRO]
   Banco de referencia personal: [BANCO Y PAÍS]

DECLARACIÓN
Yo, ${d.name ?? '[NOMBRE]'}, declaro que la información contenida en este documento es verídica y completa, y que el modelo de negocio descrito opera dentro del marco legal aplicable.

Firma: ________________________
Nombre: ${d.name ?? '[COMPLETAR]'}
Fecha: ${new Date().toLocaleDateString('es-PA')}

NOTA: Este documento debe ser adaptado con información real antes de presentarlo al banco. Panama Tax Infrastructure Hub asistirá en la revisión con los profesionales aliados.`,

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
