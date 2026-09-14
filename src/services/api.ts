import {
  ApiPackage,
  ApiService,
  ApiIndustry,
  ApiFaq,
  ApiTestimonial,
  ApiQuoteLead,
  ApiContactMessage,
  ApiDashboardData,
  ApiAdminUser,
  ApiPaymentOrder,
  PaymentGatewayConfig,
  CreatePaymentIntentParams,
  PaymentIntentResponse,
  ConfirmOrderParams,
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string | string[]>;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('sentrova_admin_token') || sessionStorage.getItem('sentrova_admin_token');
    }
  }

  public setToken(token: string, remember: boolean = true) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (remember) {
        localStorage.setItem('sentrova_admin_token', token);
      } else {
        sessionStorage.setItem('sentrova_admin_token', token);
      }
    }
  }

  public clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sentrova_admin_token');
      sessionStorage.removeItem('sentrova_admin_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const isGet = !options.method || options.method.toUpperCase() === 'GET';
    const separator = endpoint.includes('?') ? '&' : '?';
    const finalEndpoint = isGet ? `${endpoint}${separator}_t=${Date.now()}` : endpoint;
    const url = `${API_BASE}${finalEndpoint.startsWith('/') ? finalEndpoint : `/${finalEndpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...(options.headers as Record<string, string>),
    };

    if (options.method && (options.method === 'DELETE' || options.method === 'PUT' || options.method === 'PATCH')) {
      headers['X-HTTP-Method-Override'] = options.method;
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(url, {
        credentials: 'include',
        cache: 'no-store',
        ...options,
        headers,
      });

      let json: any = null;
      const text = await res.text();

      if (text.includes('aes.js') || text.includes('toNumbers')) {
        throw new Error('Security session expired. Please refresh the page (Ctrl + F5) and try again.');
      }

      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = { success: false, message: text ? text.substring(0, 150) : `HTTP ${res.status} error` };
      }

      if (!res.ok || json.success === false) {
        if (res.status === 401) {
          this.clearToken();
        }
        throw new Error(json?.message || `Request failed with status ${res.status}`);
      }
      return json;
    } catch (err: any) {
      console.warn(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  }

  // =====================================
  // PUBLIC CLIENT METHODS
  // =====================================

  public async getServices(): Promise<ApiService[]> {
    const res = await this.request<ApiService[]>('/services');
    return res.data;
  }

  public async getPackages(): Promise<ApiPackage[]> {
    const res = await this.request<ApiPackage[]>('/packages');
    return res.data;
  }

  public async getIndustries(): Promise<ApiIndustry[]> {
    const res = await this.request<ApiIndustry[]>('/industries');
    return res.data;
  }

  public async getFaqs(): Promise<ApiFaq[]> {
    const res = await this.request<ApiFaq[]>('/faqs');
    return res.data;
  }

  public async getTestimonials(): Promise<ApiTestimonial[]> {
    const res = await this.request<ApiTestimonial[]>('/testimonials');
    return res.data;
  }

  public async getSettings(): Promise<Record<string, string>> {
    const res = await this.request<Record<string, string>>('/settings');
    return res.data;
  }

  public async submitQuoteRequest(data: {
    full_name: string;
    business_name: string;
    phone: string;
    email: string;
    location?: string;
    camera_count: number;
    package_id?: number | null;
    message?: string;
  }): Promise<{ id: number }> {
    const res = await this.request<{ id: number }>('/quote-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async submitContact(data: {
    full_name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ id: number }> {
    const res = await this.request<{ id: number }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async subscribeNewsletter(email: string): Promise<{ email: string }> {
    const res = await this.request<{ email: string }>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return res.data;
  }

  // =====================================
  // ADMIN AUTHENTICATION
  // =====================================

  public async login(email: string, password: string, remember: boolean = false): Promise<{ token: string; admin: ApiAdminUser }> {
    const res = await this.request<{ token: string; admin: ApiAdminUser }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res?.data?.token) {
      this.setToken(res.data.token, remember);
    } else {
      throw new Error(res?.message || 'Login failed: Authentication token was not returned.');
    }
    return res.data;
  }

  public async getProfile(): Promise<ApiAdminUser> {
    const res = await this.request<ApiAdminUser>('/admin/me');
    return res.data;
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/admin/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  // =====================================
  // ADMIN DASHBOARD
  // =====================================

  public async getDashboard(): Promise<ApiDashboardData> {
    const res = await this.request<ApiDashboardData>('/admin/dashboard');
    return res.data;
  }

  // =====================================
  // ADMIN CRM & LEADS
  // =====================================

  public async getQuotes(params: {
    page?: number;
    limit?: number;
    status?: string;
    package_id?: string;
    search?: string;
  } = {}): Promise<{ records: ApiQuoteLead[]; pagination: { page: number; limit: number; total: number; total_pages: number } }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.status) query.set('status', params.status);
    if (params.package_id) query.set('package_id', params.package_id);
    if (params.search) query.set('search', params.search);

    const res = await this.request<{ records: ApiQuoteLead[]; pagination: any }>(`/admin/quotes?${query.toString()}`);
    return res.data;
  }

  public async updateQuote(id: number, status: string, admin_notes?: string): Promise<ApiQuoteLead> {
    const res = await this.request<ApiQuoteLead>(`/admin/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, admin_notes }),
    });
    return res.data;
  }

  public async deleteQuote(id: number): Promise<void> {
    await this.request(`/admin/quotes/${id}/delete`, { method: 'POST' });
  }

  public async getContacts(params: { page?: number; limit?: number; status?: string } = {}): Promise<{
    records: ApiContactMessage[];
    pagination: { page: number; limit: number; total: number; total_pages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.status) query.set('status', params.status);

    const res = await this.request<{ records: ApiContactMessage[]; pagination: any }>(`/admin/contacts?${query.toString()}`);
    return res.data;
  }

  public async updateContact(id: number, status: string, admin_notes?: string): Promise<ApiContactMessage> {
    const res = await this.request<ApiContactMessage>(`/admin/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, admin_notes }),
    });
    return res.data;
  }

  public async deleteContact(id: number): Promise<void> {
    await this.request(`/admin/contacts/${id}/delete`, { method: 'POST' });
  }

  // =====================================
  // ADMIN PACKAGES
  // =====================================

  public async getAdminPackages(): Promise<ApiPackage[]> {
    const res = await this.request<ApiPackage[]>('/admin/packages');
    return res.data;
  }

  public async updatePackage(id: number, data: Partial<ApiPackage>): Promise<ApiPackage> {
    const res = await this.request<ApiPackage>(`/admin/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async addPackageFeature(packageId: number, feature: string, sort_order: number = 0): Promise<any> {
    const res = await this.request(`/admin/packages/${packageId}/features`, {
      method: 'POST',
      body: JSON.stringify({ feature, sort_order }),
    });
    return res.data;
  }

  public async updatePackageFeature(featureId: number, feature: string, sort_order: number = 0): Promise<any> {
    const res = await this.request(`/admin/features/${featureId}`, {
      method: 'PUT',
      body: JSON.stringify({ feature, sort_order }),
    });
    return res.data;
  }

  public async deletePackageFeature(featureId: number): Promise<void> {
    await this.request(`/admin/features/${featureId}/delete`, { method: 'POST' });
  }

  // =====================================
  // ADMIN SERVICES
  // =====================================

  public async getAdminServices(search?: string): Promise<ApiService[]> {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await this.request<ApiService[]>(`/admin/services${q}`);
    return res.data;
  }

  public async createService(data: Partial<ApiService>): Promise<ApiService> {
    const res = await this.request<ApiService>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async updateService(id: number, data: Partial<ApiService>): Promise<ApiService> {
    const res = await this.request<ApiService>(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async deleteService(id: number): Promise<void> {
    await this.request(`/admin/services/${id}/delete`, { method: 'POST' });
  }

  // =====================================
  // ADMIN INDUSTRIES
  // =====================================

  public async getAdminIndustries(): Promise<ApiIndustry[]> {
    const res = await this.request<ApiIndustry[]>('/admin/industries');
    return res.data;
  }

  public async createIndustry(data: Partial<ApiIndustry>): Promise<ApiIndustry> {
    const res = await this.request<ApiIndustry>('/admin/industries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async updateIndustry(id: number, data: Partial<ApiIndustry>): Promise<ApiIndustry> {
    const res = await this.request<ApiIndustry>(`/admin/industries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async deleteIndustry(id: number): Promise<void> {
    await this.request(`/admin/industries/${id}/delete`, { method: 'POST' });
  }

  // =====================================
  // ADMIN FAQS
  // =====================================

  public async getAdminFaqs(): Promise<ApiFaq[]> {
    const res = await this.request<ApiFaq[]>('/admin/faqs');
    return res.data;
  }

  public async createFaq(data: Partial<ApiFaq>): Promise<ApiFaq> {
    const res = await this.request<ApiFaq>('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async updateFaq(id: number, data: Partial<ApiFaq>): Promise<ApiFaq> {
    const res = await this.request<ApiFaq>(`/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async deleteFaq(id: number): Promise<void> {
    await this.request(`/admin/faqs/${id}/delete`, { method: 'POST' });
  }

  // =====================================
  // ADMIN TESTIMONIALS
  // =====================================

  public async getAdminTestimonials(): Promise<ApiTestimonial[]> {
    const res = await this.request<ApiTestimonial[]>('/admin/testimonials');
    return res.data;
  }

  public async createTestimonial(data: Partial<ApiTestimonial>): Promise<ApiTestimonial> {
    const res = await this.request<ApiTestimonial>('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async updateTestimonial(id: number, data: Partial<ApiTestimonial>): Promise<ApiTestimonial> {
    const res = await this.request<ApiTestimonial>(`/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  public async deleteTestimonial(id: number): Promise<void> {
    await this.request(`/admin/testimonials/${id}/delete`, { method: 'POST' });
  }

  // =====================================
  // ADMIN SETTINGS
  // =====================================

  public async getAdminSettings(): Promise<Record<string, string>> {
    const res = await this.request<Record<string, string>>('/admin/settings');
    return res.data;
  }

  public async updateAdminSettings(settings: Record<string, string>): Promise<Record<string, string>> {
    const res = await this.request<Record<string, string>>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return res.data;
  }

  public async testSmtpEmail(email: string): Promise<{ success: boolean; message: string }> {
    const res = await this.request<any>('/admin/settings/test-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return { success: res.success, message: res.message };
  }

  // =====================================
  // PAYMENT GATEWAY (PUBLIC)
  // =====================================

  public async getPaymentConfig(): Promise<PaymentGatewayConfig> {
    const res = await this.request<PaymentGatewayConfig>('/payment/config');
    return res.data;
  }

  public async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResponse> {
    const res = await this.request<PaymentIntentResponse>('/payment/create-intent', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return res.data;
  }

  public async confirmOrder(params: ConfirmOrderParams): Promise<ApiPaymentOrder> {
    const res = await this.request<ApiPaymentOrder>('/payment/confirm-order', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return res.data;
  }

  public async getOrderById(id: string | number): Promise<ApiPaymentOrder> {
    const res = await this.request<ApiPaymentOrder>(`/payment/orders/${id}`);
    return res.data;
  }

  // =====================================
  // ORDERS & TRANSACTIONS (ADMIN)
  // =====================================

  public async getAdminOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Promise<{
    records: ApiPaymentOrder[];
    summary: {
      total_orders: number;
      total_revenue: number;
      total_hours: number;
      paid_orders: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const res = await this.request<any>(`/admin/orders?${query.toString()}`);
    return res.data;
  }

  public async getAdminOrder(id: number): Promise<ApiPaymentOrder> {
    const res = await this.request<ApiPaymentOrder>(`/admin/orders/${id}`);
    return res.data;
  }

  public async updateAdminOrderStatus(id: number, status: string, admin_notes?: string): Promise<ApiPaymentOrder> {
    const res = await this.request<ApiPaymentOrder>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, admin_notes }),
    });
    return res.data;
  }

  public async deleteAdminOrder(id: number): Promise<void> {
    await this.request(`/admin/orders/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
