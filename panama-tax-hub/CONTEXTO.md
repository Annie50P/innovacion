# Panama Tax Infrastructure Hub — Contexto del Proyecto

> Proyecto académico UTP — Innovación Empresarial — Grupo 1GS241
> Fecha de entrega: 19 de junio de 2026
> Integrantes: García Eliel, Rodríguez Angélica, Aparicio Ana, Ríos Gerald, Ferreira Bruno

---

## ¿Qué es este proyecto?

Plataforma SaaS (mockup funcional) que permite a startups globales optimizar legalmente su carga fiscal mediante una estructura operativa en la República de Panamá, aprovechando el **principio de territorialidad del ISR panameño** (Art. 694 del Código Fiscal) y la **Ley 186 de 2020** (Sociedad de Emprendimiento).

Todo funciona **100% offline** con `localStorage`. No hay base de datos real, no hay APIs externas activas.

---

## Stack técnico

| Tecnología | Versión | Notas |
|---|---|---|
| Next.js | 16.2.9 | `npx next dev --webpack` — NO usar turbopack |
| React | 19.2.4 | |
| TypeScript | 5.x | |
| Tailwind CSS | v4 | Usar `@import "tailwindcss"` en CSS, NO las 3 directivas clásicas |
| Zod | 4.4.3 | |
| react-hook-form | 7.79 + @hookform/resolvers 3.10 | |
| sonner | v2 | Toasts |
| recharts | v3.8 | Gráficas del simulador |
| lucide-react | v1.21 | Íconos |
| uuid | v14 | IDs de tenants |

**Dependencias removidas / prohibidas:**
- `framer-motion` — Incompatible con webpack en esta máquina. Removido del `package.json`.
- `stripe` / `@stripe/stripe-js` — Instalados originalmente, nunca usados. Removidos.

**Comando de inicio:** `npx next dev --webpack`
**Puerto:** `3000`

---

## Sistema de diseño

Dark mode exclusivo. Usar siempre **variables CSS** en lugar de colores hardcodeados.

```css
--bg-primary:   #0A0F1E   /* fondo base */
--bg-surface:   #111827   /* cards y paneles */
--bg-elevated:  #1A2236   /* fondo elevado */
--border:       #1F2D45   /* bordes */
--accent-gold:  #E6B44A   /* CTA principal, logo */
--accent-blue:  #3B82F6
--accent-red:   #CF4644
--text-primary: #F1F5F9
--text-secondary: #94A3B8
--text-muted:   #475569
--success:      #22C55E
--warning:      #F59E0B
--error:        #EF4444
```

Logo: `🇵🇦 TAXTECH` (font-mono, color gold)
Animaciones: CSS transitions o `animate-pulse` de Tailwind — **nunca framer-motion**

---

## Arquitectura de datos

Multi-tenancy lógico con **localStorage**. Todas las funciones están en `lib/storage.ts`.

```
taxhub:tenants                          → Tenant[]  (lista maestra)
taxhub:session                          → Session   (sesión activa)
taxhub:tenant_{id}:transactions         → StripeTransaction[]
taxhub:tenant_{id}:classifications      → TransactionClassification[]
taxhub:tenant_{id}:simulation           → SimulationResult
taxhub:tenant_{id}:tracker              → TrackerState { currentState: 0-14, history, notes }
taxhub:tenant_{id}:documents            → GeneratedDocument[]
taxhub:tenant_{id}:profile              → TenantProfile
taxhub:tenant_{id}:compliance           → ComplianceData
```

Funciones de acceso en `lib/storage.ts`:
- `sessionStorage.get/set/clear()`
- `tenantStorage.getAll/add/findByEmail()`
- `transactionStorage.get/set(tenantId)`
- `classificationStorage.get/set(tenantId)`
- `simulationStorage.get/set(tenantId)`
- `trackerStorage.get/set(tenantId)` — estado 0-14 del "pizza tracker"
- `documentStorage.get/set/add(tenantId)`
- `profileStorage.get/set(tenantId)`
- `complianceStorage.get/set(tenantId)`

Tipos TypeScript en `types/index.ts`.

---

## Credenciales de demo

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@taxhub.pa | admin2026 |
| Cliente | Registrarse en `/auth` | libre |

---

## Lo que está implementado actualmente

### Rutas y páginas

| Ruta | Archivo | Descripción |
|---|---|---|
| `/auth` | `app/auth/page.tsx` | Login + registro multi-step |
| `/onboarding` | `app/(platform)/onboarding/page.tsx` | **NUEVO** Bienvenida post-registro con quick steps y plan |
| `/dashboard` | `app/(platform)/dashboard/page.tsx` | KPIs, checklist rápido, marco legal, actividad reciente |
| `/transactions` | `app/(platform)/transactions/page.tsx` | Stripe mock connect + tabla de txs + clasificación IA (3 tabs) |
| `/simulator` | `app/(platform)/simulator/page.tsx` | Simulador fiscal con recharts (línea + torta), inputs parametrizables |
| `/tracker` | `app/(platform)/tracker/page.tsx` | 15 estados (0-14) de implementación estilo pizza tracker |
| `/documents` | `app/(platform)/documents/page.tsx` | 8 tipos de documentos con templates reales |
| `/compliance` | `app/(platform)/compliance/page.tsx` | Score de cumplimiento + alertas + reporte mensual |
| `/profile` | `app/(platform)/profile/page.tsx` | **NUEVO** Perfil del tenant + tiers de pricing del plan de negocios |
| `/admin` | `app/admin/page.tsx` | Vista global de tenants (solo admin) + empty state |
| `404` | `app/not-found.tsx` | **NUEVO** Página 404 personalizada con logo y botón al dashboard |

### Componentes y utilidades

| Archivo | Descripción |
|---|---|
| `components/sidebar.tsx` | Sidebar fijo 240px con navegación, badge de alertas activas en Cumplimiento, enlace a Perfil |
| `app/(platform)/layout.tsx` | Layout de plataforma: check de sesión + sidebar + main |
| `app/(platform)/loading.tsx` | **NUEVO** Skeleton animado con animate-pulse para carga de rutas |
| `lib/storage.ts` | Todas las funciones de localStorage |
| `lib/calculations.ts` | Motor de simulación fiscal y `formatCurrency` |
| `lib/stripe-mock.ts` | Datos mock de transacciones Stripe, flags, labels |

### API Routes (mock — sin integración real)

| Endpoint | Descripción |
|---|---|
| `POST /api/classify-transactions` | Clasifica transacciones por lógica determinística de territorialidad |
| `POST /api/generate-document` | Genera templates de documentos con datos del tenant |
| `POST /api/generate-report` | Genera reporte de cumplimiento mensual |

### Documentos generables (8 tipos)

1. Borrador de Pacto Social
2. Checklist KYC
3. Reporte de Análisis Fiscal
4. Matriz de Beneficiario Final *(antes faltaba template real)*
5. Carta de Instrucción Notarial *(antes faltaba template real)*
6. Checklist Bancario *(antes faltaba template real)*
7. Acuerdo de Confidencialidad (NDA) *(antes faltaba template real)*
8. Descripción de Modelo de Negocio *(antes faltaba template real)*

### Tracker — 15 estados del proceso

| # | Estado | Responsable |
|---|---|---|
| 0 | Registro y validación inicial | Sistema |
| 1 | Conexión de pasarelas de pago | Cliente |
| 2 | Ingesta y normalización | Sistema |
| 3 | Clasificación con IA | Sistema + IA |
| 4 | Simulación de exposición fiscal | Sistema |
| 5 | Revisión profesional | Abogado |
| 6 | Propuesta y aprobación | Cliente |
| 7 | Generación documental automática | Sistema |
| 8 | Revisión legal de documentos | Abogado |
| 9 | Notaría y Registro Público | Notario |
| 10 | Aviso de Operación | AMPYME |
| 11 | Onboarding bancario | Banco |
| 12 | Conexión operativa de pasarelas | Cliente |
| 13 | Activación monitoreo mensual | Sistema |
| 14 | Auditoría y mejora continua | Sistema |

---

## Últimos cambios implementados (sesión 19 jun 2026)

### Bugs corregidos

| Bug | Archivo | Fix |
|---|---|---|
| Barra de progreso de clasificación no animaba | `transactions/page.tsx` | Reemplazado prop `animate` (framer) por `style` con `transition: width 0.4s ease` |
| Toasts mencionaban `ANTHROPIC_API_KEY` | `transactions`, `documents`, `compliance` | Cambiado a mensaje genérico "Error al procesar. Intenta de nuevo." |
| `profileStorage` no se guardaba al registrarse | `auth/page.tsx` | Agregado `profileStorage.set(...)` en `handleRegister` |
| 5 templates de documentos generaban texto genérico | `api/generate-document/route.ts` | Agregados templates completos en español para todos los 8 tipos |
| Error de hidratación SSR en `/auth` | `auth/page.tsx` | Partículas decorativas ahora usan array estático `PARTICLE_POSITIONS` en lugar de `Math.random()` |
| TypeScript errors en `simulator/page.tsx` | `simulator/page.tsx` | `formatter` de recharts casteados con `as any` — `tsc --noEmit` ahora pasa limpio |

### Features nuevas

| Feature | Archivo(s) | Descripción |
|---|---|---|
| Onboarding post-registro | `app/(platform)/onboarding/page.tsx` + `auth/page.tsx` | Pantalla de bienvenida con highlights fiscales, 5 pasos, info del plan. Avanza tracker al estado 1. Registro ahora redirige a `/onboarding` en lugar de `/dashboard` |
| Badge de alertas en sidebar | `components/sidebar.tsx` | Número rojo sobre el ícono de Cumplimiento con count de alertas activas (error + warning) del tenant |
| Enlace "Mi Perfil" en sidebar | `components/sidebar.tsx` | Ícono `User`, apunta a `/profile` |
| Página de perfil | `app/(platform)/profile/page.tsx` | Datos del tenant, estadísticas de implementación, pasarelas, y los 3 tiers de pricing del plan de negocios (Básico/Growth/Premium) |
| Página 404 | `app/not-found.tsx` | 404 personalizada con logo TAXTECH y botón al dashboard |
| Loading skeleton | `app/(platform)/loading.tsx` | Skeleton animado con sidebar simulado y 4 KPI cards para transiciones de ruta |

### Limpieza técnica

- `framer-motion` removido de `package.json` (instalado pero roto en esta config)
- `@stripe/stripe-js` y `stripe` removidos de `package.json` (instalados pero no usados)
- `@types/uuid` movido de `dependencies` a `devDependencies`
- `next-env.d.ts` agregado a `.gitignore`

---

## Lo que falta por implementar

> Ordenado por impacto para la presentación del mockup.

### UX / Funcionalidad

| # | Qué falta | Impacto | Dificultad |
|---|---|---|---|
| 1 | **Responsive mobile** — sidebar colapsa mal en < 1024px. No hay breakpoints para mobile. | Alto | Media |
| 2 | **Página de propuesta (Estado 6)** — El plan describe que el cliente ve setup fee, retainer, pasos de implementación y firma la propuesta. No existe UI para esto, solo el estado en el tracker. | Medio | Media |
| 3 | **Notificaciones en tiempo real** — Las alertas del sidebar se calculan solo al montar. Si el usuario completa un paso, el badge no se actualiza hasta recargar. | Bajo | Baja |
| 4 | **Edición de perfil** — La página `/profile` es solo lectura. En producción debería permitir actualizar país, empresa, pasarelas y volumen. | Bajo | Baja |

### Técnico

| # | Qué falta | Impacto | Dificultad |
|---|---|---|---|
| 1 | **`npm install` después de cambios en `package.json`** — Se removieron `framer-motion`, `stripe`, `@stripe/stripe-js`. El usuario debe correr `npm install` en su máquina para que `node_modules` quede sincronizado. | Crítico para builds | N/A — solo ejecutar |
| 2 | **Sin loading.tsx por ruta** — Solo existe en `(platform)/loading.tsx`. Rutas como `/simulator` o `/tracker` podrían tener skeletons específicos. | Bajo | Baja |
| 3 | **`complianceStorage` poco usado** — El módulo de compliance lee de `localStorage` con `complianceStorage` pero la mayoría del estado se recalcula cada vez. Podría persistir el reporte generado. | Bajo | Baja |

### Lo que NO se implementará (fuera del alcance del mockup)

- Integración real con Stripe API / PayPal API
- Base de datos real (todo es localStorage)
- Autenticación real (JWT, OAuth)
- Envío de emails / notificaciones push
- Firma digital de documentos
- Integración con Registro Público / AMPYME
- Multi-factor authentication
- Infraestructura cloud (AWS/Azure)

---

## Cómo correr el proyecto

```bash
# Instalar dependencias (necesario si se actualizó package.json)
npm install

# Iniciar en modo desarrollo
npx next dev --webpack

# Abrir en: http://localhost:3000
```

**IMPORTANTE:** Siempre usar `--webpack`. Turbopack no es compatible con esta máquina.

---

## Flujo de demo recomendado para presentación

1. Ir a `/auth` → registrar cuenta nueva
2. Ser redirigido a `/onboarding` → ver bienvenida → clic en "Comenzar"
3. En `/transactions` → "Conectar Stripe Test" → ver las 10 transacciones mock
4. Tab "Clasificación IA" → clasificar → ver barra de progreso animada → ver resultados
5. Ir a `/simulator` → ajustar sliders → ver gráfica de proyección 12 meses
6. Ir a `/tracker` → ver los 15 estados → avanzar un estado manualmente
7. Ir a `/documents` → generar "Borrador de Pacto Social" → ver template completo
8. Ir a `/compliance` → ver score + alertas + generar reporte
9. Ir a `/profile` → ver datos del tenant + tiers de pricing
10. Login como admin (`admin@taxhub.pa` / `admin2026`) → ver `/admin` con todos los tenants

---

*Generado por Claude Code — Panama Tax Infrastructure Hub*
