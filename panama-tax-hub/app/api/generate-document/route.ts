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
FORMULARIO DE DECLARACIÓN DE BENEFICIARIO REAL
República de Panamá — Ley 23 de 2015 y sus modificaciones

Fecha: ${new Date().toLocaleDateString('es-PA')}
Empresa declarante: ${d.company ?? '[COMPLETAR]'}

SECCIÓN A — DATOS DE LA PERSONA JURÍDICA
Denominación social: ${d.company ?? '[COMPLETAR]'}
Número de folio (Registro Público): [COMPLETAR]
Fecha de inscripción: [COMPLETAR]
País de constitución: República de Panamá
Tipo de persona jurídica: Sociedad de Emprendimiento (Ley 186/2020)
Actividad económica principal: Servicios tecnológicos / software

SECCIÓN B — BENEFICIARIO(S) FINAL(ES)
(Completar para cada persona natural que posea directa o indirectamente el 25% o más del capital)

BENEFICIARIO 1
Nombre completo: ${d.name ?? '[COMPLETAR]'}
Número de pasaporte / cédula: [COMPLETAR]
País de emisión del documento: ${d.country ?? '[COMPLETAR]'}
Fecha de nacimiento: [COMPLETAR]
Nacionalidad: [COMPLETAR]
País de residencia fiscal: ${d.country ?? '[COMPLETAR]'}
Porcentaje de participación: _____%
Dirección completa: [COMPLETAR]
Teléfono de contacto: [COMPLETAR]
Correo electrónico: [COMPLETAR]
Persona Expuesta Políticamente (PEP): ☐ Sí  ☐ No

SECCIÓN C — ESTRUCTURA DE PROPIEDAD
Describa brevemente la cadena de titularidad del beneficiario final:
[COMPLETAR — Ej: Persona natural → SE → beneficiario directo al 100%]

SECCIÓN D — ORIGEN DE FONDOS
Fuente principal de ingresos del beneficiario final:
☐ Actividad empresarial propia
☐ Ingresos de inversiones
☐ Ingresos laborales
☐ Otro: [COMPLETAR]

País(es) de origen de los fondos: ${d.country ?? '[COMPLETAR]'}
Moneda principal de operación: USD

SECCIÓN E — DECLARACIÓN JURADA
El/La suscrito/a, bajo juramento, declara que la información proporcionada es veraz y completa, y que notificará cualquier cambio dentro de los 30 días hábiles siguientes a que este ocurra.

Firma del Beneficiario Final: ________________________
Nombre: ${d.name ?? '[COMPLETAR]'}
Fecha: ____/____/________
Documento de identidad: [COMPLETAR]

NOTA LEGAL: La falsedad en la declaración de beneficiario final es sancionable conforme a las leyes panameñas AML/CFT. Esta información debe mantenerse actualizada y presentarse ante las autoridades competentes cuando sea requerido.`,

  'Carta de Instrucción Notarial': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

CARTA DE INSTRUCCIÓN NOTARIAL
Para constitución de Sociedad de Emprendimiento
Ley 186 de 2020, República de Panamá

Ciudad de Panamá, ${new Date().toLocaleDateString('es-PA')}

Señor(a) Notario(a) Público(a):

Yo, ${d.name ?? '[NOMBRE DEL CLIENTE]'}, de nacionalidad [COMPLETAR], con pasaporte/cédula número [COMPLETAR], actuando en calidad de futuro fundador de la sociedad que se describirá, por medio de la presente instruyo a usted para que proceda a la elaboración del Pacto Social y demás documentos necesarios para la constitución de la siguiente persona jurídica:

1. TIPO DE ENTIDAD
   Sociedad de Emprendimiento acogida a la Ley 186 de 2020 de la República de Panamá.

2. DENOMINACIÓN PROPUESTA
   "${d.company ?? '[NOMBRE DE LA SOCIEDAD]'}" — sujeta a disponibilidad en el Registro Público de Panamá.
   Nombre alternativo 1: "[COMPLETAR]"
   Nombre alternativo 2: "[COMPLETAR]"

3. CAPITAL SOCIAL
   Capital autorizado: CIEN BALBOAS (B/.100.00)
   Acciones: 100 acciones comunes nominativas de B/.1.00 cada una

4. OBJETO SOCIAL
   Prestación de servicios tecnológicos y digitales a nivel internacional; desarrollo de software; licenciamiento de propiedad intelectual; consultoría en transformación digital; y cualquier actividad lícita conexa.

5. JUNTA DIRECTIVA PROPUESTA
   Presidente: ${d.name ?? '[COMPLETAR]'}
   Secretario: [COMPLETAR — puede ser el agente residente]
   Tesorero: [COMPLETAR — puede ser el agente residente]

6. AGENTE RESIDENTE
   [COMPLETAR — Nombre y RUC del bufete de abogados que actuará como agente residente]

7. DOMICILIO
   Ciudad de Panamá, República de Panamá.
   Dirección exacta: [COMPLETAR — generalmente la del agente residente]

8. SOLICITUDES ADICIONALES
   ☐ Solicitar exoneración ISR Ley 186/2020 (años 1-2)
   ☐ Iniciar trámite de registro AMPYME
   ☐ Apostilla de documentos para uso internacional
   ☐ Traducción oficial (si aplica)

9. DATOS PARA FACTURACIÓN
   Nombre del cliente: ${d.name ?? '[COMPLETAR]'}
   Email: [COMPLETAR]
   País de facturación: ${d.country ?? '[COMPLETAR]'}

Quedo a su disposición para proveer cualquier información adicional que requiera.

Atentamente,

___________________________
${d.name ?? '[NOMBRE]'}
[COMPLETAR — Cargo / Calidad en que actúa]
[COMPLETAR — Teléfono / Email]

NOTA: Esta carta es un borrador orientativo. El notario puede solicitar información adicional o modificar el formato según su práctica habitual.`,

  'Checklist Bancario': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

CHECKLIST DE APERTURA DE CUENTA BANCARIA EMPRESARIAL
SOCIEDAD DE EMPRENDIMIENTO — PANAMÁ
Cliente: ${d.name ?? '[COMPLETAR]'} | Empresa: ${d.company ?? '[COMPLETAR]'}
Fecha de preparación: ${new Date().toLocaleDateString('es-PA')}

═══════════════════════════════════════════════
FASE 1 — DOCUMENTOS CORPORATIVOS (Empresa)
═══════════════════════════════════════════════
☐ Escritura pública de constitución (original o copia certificada por notario)
☐ Certificado de inscripción del Registro Público (máximo 3 meses de vigencia)
☐ Certificado de buena salud corporativa / vigencia
☐ Pacto social completo
☐ Resolución de Junta Directiva autorizando apertura de cuenta y nombrando firmantes
☐ Aviso de Operación emitido por AMPYME
☐ Registro como Sociedad de Emprendimiento (Ley 186/2020)
☐ RUC (Registro Único del Contribuyente) de la DGI — si aplica
☐ Lista de accionistas con porcentajes de participación

═══════════════════════════════════════════════
FASE 2 — DOCUMENTOS DEL BENEFICIARIO FINAL
═══════════════════════════════════════════════
☐ Pasaporte vigente (copia notariada y apostillada)
☐ Comprobante de domicilio (máximo 3 meses — factura de servicios o estado de cuenta)
☐ Formulario de Beneficiario Final firmado (Ley 23/2015)
☐ Declaración de origen lícito de fondos (formato del banco)
☐ CV o hoja de vida profesional actualizada
☐ Referencias bancarias personales (mínimo 2, en inglés o español)
☐ Referencias comerciales / profesionales (mínimo 2)
☐ Certificado de antecedentes penales apostillado (algunos bancos lo requieren)

═══════════════════════════════════════════════
FASE 3 — DOCUMENTOS DEL NEGOCIO
═══════════════════════════════════════════════
☐ Descripción del modelo de negocio (1-2 páginas, en español e inglés)
☐ Lista de principales clientes (nombre, país, tipo de servicio)
☐ Contratos de prestación de servicios (muestra — al menos 1-2)
☐ Proyección de ingresos y flujo de caja (12 meses)
☐ Historial de facturación / estados de cuenta pasarelas de pago (últimos 6 meses)
☐ Capturas de pantalla de cuentas activas (Stripe, PayPal, Wise, etc.)
☐ Sitio web o portafolio de la empresa (URL: ${d.volume ? '[confirmar]' : '[COMPLETAR]'})

═══════════════════════════════════════════════
FASE 4 — DEBIDA DILIGENCIA AMPLIADA (si PEP o alto volumen)
═══════════════════════════════════════════════
☐ Carta de presentación de abogado panameño (en papel membretado)
☐ Declaraciones fiscales del país de residencia (últimos 2 años)
☐ Estados financieros auditados (si los tiene)
☐ Formulario PEP completado (si aplica)

═══════════════════════════════════════════════
BANCOS RECOMENDADOS EN PANAMÁ
═══════════════════════════════════════════════
1. Banco General — Privado local, buen perfil para empresas tech
2. Banistmo (HSBC) — Banco internacional, acepta clientes extranjeros
3. Multibank — Flexible para negocios digitales
4. Global Bank — Buena atención a pymes y emprendedores

País de residencia del beneficiario: ${d.country ?? '[COMPLETAR]'}
Volumen mensual estimado: ${d.volume ?? '[COMPLETAR]'}

IMPORTANTE: Cada banco puede solicitar documentación adicional. Este checklist cubre los requisitos típicos pero no es exhaustivo. Se recomienda contactar al banco elegido antes de preparar el expediente.`,

  'Acuerdo de Confidencialidad (NDA)': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN
(NDA — Non-Disclosure Agreement)

Ciudad de Panamá, República de Panamá
Fecha: ${new Date().toLocaleDateString('es-PA')}

PARTES:

PARTE DIVULGANTE:
Nombre / Razón Social: ${d.company ?? '[NOMBRE DE LA EMPRESA]'}
Representante legal: ${d.name ?? '[NOMBRE DEL REPRESENTANTE]'}
País de operación: Panamá / ${d.country ?? '[COMPLETAR]'}
(en adelante, "la Empresa")

PARTE RECEPTORA:
Nombre / Razón Social: [COMPLETAR — nombre del aliado, consultor, proveedor]
Representante: [COMPLETAR]
País: [COMPLETAR]
(en adelante, "el Receptor")

CONSIDERANDOS:

Que la Empresa desea compartir con el Receptor información confidencial con el propósito de:
[COMPLETAR — Ej: "evaluar una posible colaboración comercial", "prestación de servicios de consultoría", "desarrollo de software conjunto", etc.]

Las partes acuerdan los siguientes términos:

CLÁUSULA 1 — DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL
Se considera "Información Confidencial" toda información técnica, comercial, financiera, legal o estratégica divulgada por la Empresa al Receptor, ya sea de forma oral, escrita, electrónica o visual, incluyendo sin limitación: código fuente, algoritmos, datos de clientes, proyecciones financieras, estructura corporativa, estrategias de negocio y cualquier información designada como confidencial.

CLÁUSULA 2 — OBLIGACIONES DEL RECEPTOR
El Receptor se compromete a:
a) Mantener la Información Confidencial en estricta reserva
b) No divulgar la información a terceros sin consentimiento previo y por escrito de la Empresa
c) Usar la información exclusivamente para los fines establecidos en este acuerdo
d) Limitar el acceso a la información a sus empleados o colaboradores que la necesiten estrictamente
e) Proteger la información con al menos el mismo nivel de cuidado que usa para su propia información confidencial

CLÁUSULA 3 — EXCEPCIONES
Las obligaciones de confidencialidad no aplican a información que:
a) Sea o se vuelva de dominio público sin incumplimiento de este acuerdo
b) El Receptor ya conocía antes de recibirla de la Empresa
c) Sea divulgada por mandato legal o judicial (previa notificación a la Empresa)
d) Sea desarrollada independientemente por el Receptor sin uso de la información recibida

CLÁUSULA 4 — VIGENCIA
Este acuerdo tendrá vigencia de [COMPLETAR — Ej: DOS (2) AÑOS] a partir de la fecha de firma, y las obligaciones de confidencialidad se mantendrán por [COMPLETAR — Ej: CINCO (5) AÑOS] adicionales respecto a la información divulgada durante la vigencia.

CLÁUSULA 5 — PROPIEDAD INTELECTUAL
Nada en este acuerdo otorga al Receptor ningún derecho de propiedad intelectual sobre la Información Confidencial. Toda la información divulgada permanece como propiedad exclusiva de la Empresa.

CLÁUSULA 6 — DEVOLUCIÓN DE INFORMACIÓN
A solicitud de la Empresa, el Receptor deberá devolver o destruir toda la Información Confidencial recibida, certificando por escrito dicha destrucción si así se solicita.

CLÁUSULA 7 — LEY APLICABLE Y JURISDICCIÓN
Este acuerdo se regirá por las leyes de la República de Panamá. Para cualquier controversia, las partes se someten a la jurisdicción de los tribunales competentes de la Ciudad de Panamá, renunciando a cualquier otro fuero.

CLÁUSULA 8 — DAÑOS Y PERJUICIOS
El incumplimiento de este acuerdo dará derecho a la Empresa a reclamar los daños y perjuicios correspondientes, sin perjuicio de otras acciones legales disponibles.

EN FE DE LO CUAL, las partes suscriben el presente acuerdo en dos (2) ejemplares de igual valor.

___________________________        ___________________________
${d.name ?? '[NOMBRE]'}                    [NOMBRE DEL RECEPTOR]
${d.company ?? '[EMPRESA]'}                [EMPRESA RECEPTORA]
Parte Divulgante                   Parte Receptora
Fecha: ____/____/________          Fecha: ____/____/________

NOTA: Este NDA es un borrador orientativo para uso en Panamá. Para jurisdicciones múltiples o situaciones complejas, consulte con un abogado especializado.`,

  'Descripción de Modelo de Negocio': (d) => `BORRADOR PRELIMINAR - Requiere revisión de abogado panameño idóneo

DESCRIPCIÓN DEL MODELO DE NEGOCIO
Para Debida Diligencia Bancaria y Corporativa
Sociedad de Emprendimiento — Ley 186/2020

Fecha: ${new Date().toLocaleDateString('es-PA')}
Empresa: ${d.company ?? '[COMPLETAR]'}
Representante: ${d.name ?? '[COMPLETAR]'}
País del Beneficiario Final: ${d.country ?? '[COMPLETAR]'}

═══════════════════════════════════════════════
SECCIÓN 1 — RESUMEN EJECUTIVO
═══════════════════════════════════════════════
[COMPLETAR — Breve descripción de la empresa en 2-3 oraciones. Ejemplo:]
"${d.company ?? '[EMPRESA]'} es una empresa tecnológica de base panameña que desarrolla y comercializa [productos/servicios] para clientes en [mercados]. La empresa opera bajo el principio de territorialidad del ISR panameño, generando ingresos principalmente de fuentes extranjeras."

═══════════════════════════════════════════════
SECCIÓN 2 — PRODUCTOS Y SERVICIOS
═══════════════════════════════════════════════
Describa los productos o servicios que ofrece la empresa:

☐ Software como Servicio (SaaS)
☐ Desarrollo de software a medida
☐ Consultoría tecnológica
☐ Licenciamiento de propiedad intelectual
☐ Otro: [COMPLETAR]

Descripción detallada: [COMPLETAR]

Precio promedio por cliente: [COMPLETAR]
Modelo de cobro: ☐ Mensual recurrente  ☐ Por proyecto  ☐ Licencia anual  ☐ Otro

═══════════════════════════════════════════════
SECCIÓN 3 — MERCADO OBJETIVO Y CLIENTES
═══════════════════════════════════════════════
Mercados geográficos servidos:
☐ Norteamérica (EEUU, Canadá)
☐ Europa
☐ Latinoamérica (excl. Panamá)
☐ Asia-Pacífico
☐ Clientes en Panamá: [COMPLETAR % aproximado]

Tipo de clientes:
☐ Empresas (B2B)
☐ Consumidores finales (B2C)
☐ Gobierno / sector público

Número estimado de clientes activos: [COMPLETAR]

Principales clientes (sin datos confidenciales si prefiere):
1. [COMPLETAR — País / Industria / Volumen aproximado]
2. [COMPLETAR]
3. [COMPLETAR]

═══════════════════════════════════════════════
SECCIÓN 4 — FLUJOS DE INGRESOS
═══════════════════════════════════════════════
Volumen mensual promedio: ${d.volume ?? '[COMPLETAR]'}
Moneda principal: USD
Pasarelas de pago utilizadas: [COMPLETAR — Stripe, PayPal, Wise, etc.]
Porcentaje de ingresos de fuente extranjera: ~[COMPLETAR]%
Porcentaje de ingresos de fuente panameña: ~[COMPLETAR]%

Justificación de territorialidad: Los servicios son prestados fuera del territorio panameño a clientes ubicados en el exterior, por lo que los ingresos correspondientes no constituyen renta gravable en Panamá conforme al Artículo 694 del Código Fiscal.

═══════════════════════════════════════════════
SECCIÓN 5 — ESTRUCTURA OPERATIVA
═══════════════════════════════════════════════
País de incorporación: República de Panamá
País de operación principal: [COMPLETAR — donde trabaja el equipo]
Número de empleados / colaboradores: [COMPLETAR]
Modalidad: ☐ 100% remoto  ☐ Oficina física  ☐ Híbrido

Herramientas y plataformas principales:
[COMPLETAR — Ej: GitHub, AWS, Stripe, Slack, Google Workspace]

═══════════════════════════════════════════════
SECCIÓN 6 — CUMPLIMIENTO Y REGULACIÓN
═══════════════════════════════════════════════
☐ Registrada como Sociedad de Emprendimiento (Ley 186/2020)
☐ Inscrita en AMPYME
☐ RUC activo en DGI
☐ Cuenta bancaria empresarial en Panamá: [COMPLETAR — banco]
☐ Declaraciones fiscales al día
☐ Certificado de paz y salvo (DGI)

═══════════════════════════════════════════════
DECLARACIÓN
═══════════════════════════════════════════════
Yo, ${d.name ?? '[NOMBRE]'}, en calidad de representante legal de ${d.company ?? '[EMPRESA]'}, declaro bajo juramento que la información contenida en este documento es veraz y completa, y me comprometo a notificar cualquier cambio material en el modelo de negocio dentro de los 30 días hábiles siguientes.

Firma: ________________________
Nombre: ${d.name ?? '[COMPLETAR]'}
Cargo: [COMPLETAR]
Fecha: ____/____/________
Documento de identidad: [COMPLETAR]`,

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
