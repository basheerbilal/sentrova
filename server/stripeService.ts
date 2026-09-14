import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

/**
 * Lazy initialization of the Stripe SDK.
 * Only initializes when called, avoiding startup crashes if STRIPE_SECRET_KEY is missing.
 */
export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.trim() === '') {
    return null;
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-02-24.acacia' as any,
      typescript: true,
    });
  }
  return stripeInstance;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim() !== '');
}

export function getPublicStripeConfig() {
  return {
    configured: isStripeConfigured(),
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    currency: 'USD',
    merchantName: 'SENTROVA Surveillance Ltd',
    supportHotline: '+44 7742 476163',
    billingContactEmail: 'billing@sentrova.co.uk',
  };
}
