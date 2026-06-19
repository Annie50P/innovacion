# Panama Tax Infrastructure Hub

**TaxTech/LegalTech SaaS** — Proyecto académico Universidad Tecnológica de Panamá (UTP)

Plataforma que permite a startups globales optimizar legalmente su carga fiscal mediante una estructura operativa basada en la República de Panamá, aprovechando el principio de territorialidad del ISR panameño.

---

## Stack Tecnológico

- **Next.js 14+** con App Router y TypeScript
- **Tailwind CSS v4** — dark mode exclusivo, paleta inspirada en la bandera de Panamá
- **Anthropic SDK** — clasificación de transacciones y generación de documentos con IA
- **Stripe** — integración en modo test
- **localStorage** — multi-tenancy lógico sin base de datos
- **recharts** — gráficas del simulador fiscal
- **framer-motion** — animaciones suaves
- **sonner** — notificaciones toast
- **react-hook-form + zod** — validación de formularios

---

## Configuración

### 1. Variables de entorno

Copia `.env.example` a `.env.local` y agrega tus API keys:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
# Obtén tu API key en: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-...

# Obtén tus keys en: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Sin ANTHROPIC_API_KEY**: La plataforma funciona normalmente, pero las funciones de IA (clasificación, generación de documentos, reporte mensual) mostrarán un error amigable.

### 2. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Acceso

| Tipo | Email | Password |
|------|-------|----------|
| Admin | `admin@taxhub.pa` | `admin2026` |
| Cliente | Registrarse en `/auth` | — |

---

## Módulos

| Ruta | Descripción |
|------|-------------|
| `/auth` | Login y registro de tenants |
| `/dashboard` | KPIs, checklist de inicio rápido, marco legal panameño |
| `/transactions` | Conexión Stripe (mock), tabla de transacciones, clasificación IA |
| `/simulator` | Simulador fiscal en tiempo real con gráficas |
| `/tracker` | Pizza Tracker — 15 estados de implementación |
| `/documents` | Generación de documentos corporativos con IA |
| `/compliance` | Score de cumplimiento, alertas, reporte mensual IA |
| `/admin` | Vista de todos los tenants (solo admin) |

---

## Arquitectura Multi-Tenant

Todos los datos se almacenan en `localStorage` con aislamiento por tenant:

```
taxhub:tenants                     → Lista maestra de tenants
taxhub:session                     → Sesión activa
taxhub:tenant_{id}:profile         → Perfil del cliente
taxhub:tenant_{id}:transactions    → Transacciones Stripe
taxhub:tenant_{id}:classifications → Clasificaciones IA
taxhub:tenant_{id}:simulation      → Resultado del simulador
taxhub:tenant_{id}:tracker         → Estado de implementación
taxhub:tenant_{id}:documents       → Documentos generados
taxhub:tenant_{id}:compliance      → Alertas y estado de cumplimiento
```

---

## Marco Legal

- **Principio de Territorialidad**: Los ingresos de fuente extranjera no son gravables en Panamá
- **Sociedad de Emprendimiento (Ley 186/2020)**: ISR B/.0 durante los primeros 2 años
- **Ley 451 de 2024**: Actualización del marco legal aplicable
- **AMPYME**: Registro como Sociedad de Emprendimiento

---

## Disclaimer

Esta plataforma es un proyecto académico y no constituye asesoría legal individualizada. Los escenarios presentados en el simulador son orientativos y requieren validación por un abogado y contador público autorizado en Panamá.
