import { StripeTransaction } from '@/types';

export const MOCK_TRANSACTIONS: StripeTransaction[] = [
  { id: 'pi_test_3xK9mA', amount: 299900, currency: 'usd', status: 'succeeded', description: 'SaaS Pro Plan - Monthly Subscription', created: 1718500000, customer: { email: 'founder@acmecorp.io', address: { country: 'US' } }, metadata: { product_type: 'subscription', billing_cycle: 'monthly' } },
  { id: 'pi_test_7qR2nB', amount: 150000, currency: 'eur', status: 'succeeded', description: 'Software License Q2 2026', created: 1718450000, customer: { email: 'cto@berlintech.de', address: { country: 'DE' } }, metadata: { product_type: 'license' } },
  { id: 'pi_test_1mN4pC', amount: 500000, currency: 'usd', status: 'succeeded', description: 'Consulting Services - April 2026', created: 1718400000, customer: { email: 'ops@latamdigital.mx', address: { country: 'MX' } }, metadata: { product_type: 'service' } },
  { id: 'pi_test_8tF6vD', amount: 89900, currency: 'usd', status: 'succeeded', description: 'Online Course Bundle - Advanced', created: 1718350000, customer: { email: 'student@learner.ca', address: { country: 'CA' } }, metadata: { product_type: 'digital_product' } },
  { id: 'pi_test_2zW5kE', amount: 350000, currency: 'gbp', status: 'succeeded', description: 'API Access - Enterprise Tier', created: 1718300000, customer: { email: 'dev@ukstartup.co.uk', address: { country: 'GB' } }, metadata: { product_type: 'api_access' } },
  { id: 'pi_test_9sL8jF', amount: 75000, currency: 'usd', status: 'succeeded', description: 'Digital Templates + E-book Pack', created: 1718250000, customer: { email: 'buyer@creator.com', address: { country: 'US' } }, metadata: { product_type: 'digital_product' } },
  { id: 'pi_test_4yH3qG', amount: 220000, currency: 'brl', status: 'succeeded', description: 'Membresía Anual SaaS Platform', created: 1718200000, customer: { email: 'user@empresa.com.br', address: { country: 'BR' } }, metadata: { product_type: 'subscription' } },
  { id: 'pi_test_6cB1rH', amount: 180000, currency: 'usd', status: 'succeeded', description: 'UX/UI Design Services - Q2', created: 1718150000, customer: { email: 'client@agencynyc.us', address: { country: 'US' } }, metadata: { product_type: 'service' } },
  { id: 'pi_test_5kD7mI', amount: 420000, currency: 'usd', status: 'succeeded', description: 'SaaS Enterprise Annual License', created: 1718100000, customer: { email: 'cfo@fortune500.com', address: { country: 'US' } }, metadata: { product_type: 'license' } },
  { id: 'pi_test_3nP9xJ', amount: 65000, currency: 'eur', status: 'succeeded', description: 'Marketing Automation Subscription', created: 1718050000, customer: { email: 'mktg@paris-agency.fr', address: { country: 'FR' } }, metadata: { product_type: 'subscription' } },
];

export function formatAmount(amount: number, currency: string): string {
  const value = amount / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(value);
}

export function toUSD(amount: number, currency: string): number {
  const value = amount / 100;
  const rates: Record<string, number> = { usd: 1, eur: 1.08, gbp: 1.27, brl: 0.18 };
  return value * (rates[currency.toLowerCase()] ?? 1);
}

export const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', DE: '🇩🇪', MX: '🇲🇽', CA: '🇨🇦', GB: '🇬🇧', FR: '🇫🇷', BR: '🇧🇷',
  PA: '🇵🇦', ES: '🇪🇸', AR: '🇦🇷', CO: '🇨🇴', CL: '🇨🇱', PE: '🇵🇪',
};

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  subscription: 'Suscripción',
  license: 'Licencia',
  service: 'Servicio',
  digital_product: 'Producto Digital',
  api_access: 'API Access',
  consultoria: 'Consultoría',
};

export const PRODUCT_TYPE_COLORS: Record<string, string> = {
  subscription: 'bg-blue-500/20 text-blue-400',
  license: 'bg-purple-500/20 text-purple-400',
  service: 'bg-amber-500/20 text-amber-400',
  digital_product: 'bg-green-500/20 text-green-400',
  api_access: 'bg-cyan-500/20 text-cyan-400',
  consultoria: 'bg-orange-500/20 text-orange-400',
};
