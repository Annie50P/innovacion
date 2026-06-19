'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { toast } from 'sonner';
import { Eye, EyeOff, Shield, TrendingUp, Globe } from 'lucide-react';
import { tenantStorage, sessionStorage, profileStorage } from '@/lib/storage';
import { Tenant, Session } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  companyName: z.string().min(2, 'Nombre de empresa requerido'),
  country: z.string().min(1, 'País requerido'),
  monthlyVolume: z.string().min(1, 'Selecciona volumen'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

const COUNTRIES = ['Panamá','Estados Unidos','México','Colombia','Argentina','Chile','Perú','Brasil','España','Alemania','Francia','Reino Unido','Canadá','Costa Rica','Guatemala','El Salvador','Honduras','Nicaragua','República Dominicana','Venezuela','Ecuador','Bolivia','Uruguay','Paraguay','Otro'];
const VOLUMES = ['< $5,000 / mes', '$5,000 – $20,000 / mes', '$20,000 – $100,000 / mes', '> $100,000 / mes'];
const GATEWAYS = ['Stripe', 'PayPal', 'Wise', 'MercadoPago', 'Otro'];

const PARTICLE_POSITIONS = [
  { left: 12.51, top: 86.46 }, { left: 63.63, top: 23.18 }, { left: 75.33, top: 29.08 },
  { left: 21.25, top: 19.94 }, { left: 44.87, top: 57.32 }, { left: 88.12, top: 41.65 },
  { left: 33.74, top: 72.91 }, { left: 56.48, top: 8.37  }, { left: 7.93,  top: 64.52 },
  { left: 91.06, top: 15.83 }, { left: 28.39, top: 48.76 }, { left: 68.21, top: 93.14 },
  { left: 47.55, top: 35.60 }, { left: 15.82, top: 81.44 }, { left: 82.67, top: 52.29 },
  { left: 39.11, top: 6.75  }, { left: 60.94, top: 77.83 }, { left: 3.27,  top: 31.58 },
  { left: 73.45, top: 62.37 }, { left: 50.00, top: 44.21 },
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPwd, setShowPwd] = useState(false);
  const [selectedGateways, setSelectedGateways] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    // Admin check
    if (data.email === 'admin@taxhub.pa' && data.password === 'admin2026') {
      const session: Session = { tenantId: 'admin', email: data.email, name: 'Administrador', loginAt: new Date().toISOString(), isAdmin: true };
      sessionStorage.set(session);
      toast.success('Bienvenido, Administrador');
      router.push('/admin');
      setLoading(false);
      return;
    }

    const tenant = tenantStorage.findByEmail(data.email);
    if (!tenant || btoa(data.password) !== tenant.password) {
      toast.error('Credenciales inválidas');
      setLoading(false);
      return;
    }

    const session: Session = { tenantId: tenant.id, email: tenant.email, name: tenant.name, loginAt: new Date().toISOString() };
    sessionStorage.set(session);
    toast.success(`Bienvenido, ${tenant.name}`);
    router.push('/dashboard');
    setLoading(false);
  };

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    if (tenantStorage.findByEmail(data.email)) {
      toast.error('Este email ya está registrado');
      setLoading(false);
      return;
    }

    const tenantId = uuidv4();
    const tenant: Tenant = {
      id: tenantId,
      name: data.name,
      email: data.email,
      password: btoa(data.password),
      companyName: data.companyName,
      country: data.country,
      monthlyVolume: data.monthlyVolume,
      gateways: selectedGateways,
      plan: 'starter',
      createdAt: new Date().toISOString(),
    };

    tenantStorage.add(tenant);
    profileStorage.set(tenantId, {
      id: tenantId, name: data.name, email: data.email,
      companyName: data.companyName, country: data.country,
      monthlyVolume: data.monthlyVolume, gateways: selectedGateways,
      plan: 'starter', createdAt: new Date().toISOString(),
    });

    const session: Session = { tenantId, email: data.email, name: data.name, loginAt: new Date().toISOString() };
    sessionStorage.set(session);
    toast.success('¡Cuenta creada exitosamente!');
    router.push('/onboarding');
    setLoading(false);
  };

  const toggleGateway = (g: string) =>
    setSelectedGateways(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 auth-gradient flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Panama map SVG subtle */}
        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 800 600" fill="none">
          <path d="M100 300 Q200 150 350 200 Q450 220 500 180 Q600 150 700 200 Q750 220 720 280 Q700 320 650 300 Q580 280 520 310 Q480 330 440 300 Q380 270 300 320 Q220 360 180 340 Q130 320 100 300Z" fill="var(--accent-gold)" />
        </svg>

        {/* Floating particles */}
        {PARTICLE_POSITIONS.map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ background: 'var(--accent-gold)', left: `${pos.left}%`, top: `${pos.top}%` }}
          />
        ))}

        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'rgba(230,180,74,0.1)' }}>
            <span className="text-2xl">🇵🇦</span>
            <span className="font-mono text-sm" style={{ color: 'var(--accent-gold)' }}>República de Panamá</span>
          </div>

          <h1 className="font-mono text-4xl font-bold mb-2" style={{ color: 'var(--accent-gold)' }}>TAXTECH</h1>
          <p className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Panama Tax Infrastructure Hub</p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
            Optimiza legalmente la carga fiscal de tu startup global aprovechando el principio de territorialidad del ISR panameño.
          </p>

          <div className="space-y-4 text-left">
            {[
              { icon: Shield, text: 'Principio de Territorialidad activo — ingresos extranjeros no gravables' },
              { icon: TrendingUp, text: 'Sociedad de Emprendimiento Ley 186/2020 — ISR B/.0 años 1-2' },
              { icon: Globe, text: 'Análisis de transacciones Stripe con IA en segundos' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(230,180,74,0.15)' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</p>
              </div>
            ))}
          </div>

          <p className="text-xs mt-10" style={{ color: 'var(--text-muted)' }}>
            Proyecto Académico — Universidad Tecnológica de Panamá (UTP)
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: 'var(--bg-surface)' }}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="font-mono text-xl font-bold mb-1" style={{ color: 'var(--accent-gold)' }}>TAXTECH</p>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {mode === 'login' ? 'Acceder a tu cuenta' : 'Crear cuenta'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'login' ? 'Ingresa tus credenciales para continuar' : 'Completa el formulario para comenzar'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg p-1 mb-8" style={{ background: 'var(--bg-elevated)' }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200"
                style={{
                  background: mode === m ? 'var(--accent-gold)' : 'transparent',
                  color: mode === m ? '#0A0F1E' : 'var(--text-secondary)',
                }}
              >
                {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          
            {mode === 'login' ? (
              <form
                key="login"
                
                
                
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Email</label>
                  <input
                    {...loginForm.register('email')}
                    type="email"
                    placeholder="tu@empresa.com"
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all border"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
                  <div className="relative">
                    <input
                      {...loginForm.register('password')}
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all border"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-gold)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60"
                  style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}
                >
                  {loading ? 'Verificando...' : 'Iniciar sesión'}
                </button>

                <div className="text-xs text-center pt-2" style={{ color: 'var(--text-muted)' }}>
                  Admin: admin@taxhub.pa / admin2026
                </div>
              </form>
            ) : (
              <form
                key="register"
                
                
                
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-4"
              >
                {[
                  { name: 'name' as const, label: 'Nombre completo', placeholder: 'Ana García', type: 'text' },
                  { name: 'email' as const, label: 'Email', placeholder: 'tu@empresa.com', type: 'email' },
                  { name: 'password' as const, label: 'Contraseña', placeholder: '••••••••', type: 'password' },
                  { name: 'companyName' as const, label: 'Empresa / Proyecto', placeholder: 'Mi Startup SaaS', type: 'text' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>{field.label}</label>
                    <input
                      {...registerForm.register(field.name)}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all border"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-gold)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    {registerForm.formState.errors[field.name] && (
                      <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{registerForm.formState.errors[field.name]?.message}</p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>País de residencia</label>
                  <select
                    {...registerForm.register('country')}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Selecciona un país...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Volumen mensual estimado</label>
                  <select
                    {...registerForm.register('monthlyVolume')}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Selecciona volumen...</option>
                    {VOLUMES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Pasarelas que usas</label>
                  <div className="flex flex-wrap gap-2">
                    {GATEWAYS.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGateway(g)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium border transition-all"
                        style={{
                          background: selectedGateways.includes(g) ? 'rgba(230,180,74,0.2)' : 'var(--bg-elevated)',
                          borderColor: selectedGateways.includes(g) ? 'var(--accent-gold)' : 'var(--border)',
                          color: selectedGateways.includes(g) ? 'var(--accent-gold)' : 'var(--text-secondary)',
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60"
                  style={{ background: 'var(--accent-gold)', color: '#0A0F1E' }}
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>
            )}
          
        </div>
      </div>
    </div>
  );
}
