export type PackageTier = 'essential' | 'growth' | 'ultimate';

export interface ApiPackageFeature {
  id: number;
  package_id: number;
  feature: string;
  sort_order: number;
}

export interface ApiPackage {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  price: number;
  currency: string;
  billing_unit: string;
  description: string;
  popular: boolean;
  sort_order: number;
  status: 'active' | 'inactive';
  features: ApiPackageFeature[];
}

export interface ApiService {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon: string;
  image: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

export interface ApiIndustry {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

export interface ApiFaq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  status: 'active' | 'inactive';
}

export interface ApiTestimonial {
  id: number;
  customer_name: string;
  company_name: string;
  designation: string;
  content: string;
  rating: number;
  image: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

export interface ApiQuoteLead {
  id: number;
  full_name: string;
  business_name: string;
  phone: string;
  email: string;
  location?: string;
  camera_count: number;
  package_id?: number | null;
  package_name?: string;
  message?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiContactMessage {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiAdminUser {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
}

export interface ApiDashboardData {
  metrics: {
    total_quotes: number;
    new_leads: number;
    in_progress: number;
    completed: number;
    contact_unread: number;
    contact_total: number;
    active_packages: number;
    active_services: number;
    total_revenue?: number;
    paid_orders?: number;
    total_hours_sold?: number;
  };
  recent_leads: ApiQuoteLead[];
  recent_orders?: ApiPaymentOrder[];
  recent_logs: Array<{
    id: number;
    admin_name?: string;
    action: string;
    entity: string;
    details?: string;
    created_at: string;
  }>;
}

export interface ApiPaymentOrder {
  id: number;
  transaction_id: string;
  invoice_number: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  location?: string;
  package_id?: number | null;
  package_name: string;
  package_slug: string;
  hourly_rate: number;
  hours_purchased: number;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  camera_count: number;
  setup_date?: string;
  special_instructions?: string;
  payment_method: 'card' | 'stripe' | 'bank_transfer';
  payment_intent_id?: string;
  card_last4?: string;
  card_brand?: string;
  status: 'paid' | 'pending' | 'active' | 'cancelled' | 'refunded';
  is_sandbox: boolean;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentGatewayConfig {
  configured: boolean;
  publishableKey: string;
  currency: string;
  merchantName: string;
  supportHotline: string;
  billingContactEmail: string;
  acceptedCards: string[];
  terms: string;
  packages: Array<{
    id: number;
    name: string;
    slug: string;
    subtitle: string;
    price: number;
    currency: string;
    billing_unit: string;
    popular: boolean;
  }>;
}

export interface CreatePaymentIntentParams {
  package_slug: string;
  hours: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  camera_count?: number;
  location?: string;
  currency?: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
  hourly_rate: number;
  hours: number;
  package_name: string;
  package_slug: string;
  is_sandbox: boolean;
  notice?: string;
}

export interface ConfirmOrderParams {
  payment_intent_id?: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  location?: string;
  package_slug: string;
  hours: number;
  camera_count: number;
  setup_date?: string;
  special_instructions?: string;
  card_last4?: string;
  card_brand?: string;
  payment_method?: string;
}

export interface MonitoringPackage {
  id: PackageTier;
  name: string;
  price: string;
  unit: string;
  tagline: string;
  highlight?: boolean;
  badge?: string;
  description: string;
  features: string[];
  bestFor: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  benefits: string[];
}

export interface IndustryItem {
  id: string;
  name: string;
  description: string;
  keyRisks: string[];
  imageUrl: string;
  spanClass: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
  details: string;
  icon: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  content: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface QuoteFormData {
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  location: string;
  numberOfCameras: number;
  packageTier: PackageTier;
  message: string;
}

export interface CookieConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  updatedAt: string;
  version: string;
}
