import express, { Request, Response, NextFunction } from 'express';
import {
  pool,
  verifyJwt,
  signJwt,
  verifyPassword,
  hashPassword,
  logActivity,
} from './mysql';
import { getStripe, isStripeConfigured, getPublicStripeConfig } from './stripeService';
import {
  sendQuoteEmails,
  sendNewsletterEmails,
  sendContactEmails,
  sendTestEmail,
} from './mailer';

export const apiRouter = express.Router();

// Helper for consistent JSON responses
function jsonSuccess(res: Response, data: any = {}, message: string = 'Request successful', statusCode: number = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function jsonError(res: Response, message: string = 'Something went wrong', statusCode: number = 400, errors: any = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

// Authentication Middleware for /api/admin/*
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonError(res, 'Authentication token missing or invalid', 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyJwt(token);

  if (!payload || !payload.admin_id) {
    return jsonError(res, 'Session expired or token invalid', 401);
  }

  try {
    const [rows]: any = await pool.query('SELECT * FROM admins WHERE id = ? AND status = "active"', [payload.admin_id]);
    if (!rows || rows.length === 0) {
      return jsonError(res, 'Admin account inactive or removed', 401);
    }
    (req as any).admin = rows[0];
    next();
  } catch (error: any) {
    return jsonError(res, 'Database error during authentication', 500);
  }
}

// ==========================================
// 1. PUBLIC REST API ENDPOINTS
// ==========================================

// GET /api/services
apiRouter.get('/services', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM services WHERE status = "active" ORDER BY sort_order ASC');
    return jsonSuccess(res, rows);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

// GET /api/packages
apiRouter.get('/packages', async (req, res) => {
  try {
    const [packages]: any = await pool.query('SELECT * FROM packages WHERE status = "active" ORDER BY sort_order ASC');
    const [features]: any = await pool.query('SELECT * FROM package_features ORDER BY sort_order ASC');

    const result = packages.map((pkg: any) => ({
      ...pkg,
      popular: Boolean(pkg.popular),
      price: Number(pkg.price),
      features: features.filter((f: any) => f.package_id === pkg.id),
    }));

    return jsonSuccess(res, result);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

// GET /api/industries
apiRouter.get('/industries', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM industries WHERE status = "active" ORDER BY sort_order ASC');
    return jsonSuccess(res, rows);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

// GET /api/faqs
apiRouter.get('/faqs', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM faq WHERE status = "active" ORDER BY sort_order ASC');
    return jsonSuccess(res, rows);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

// GET /api/testimonials
apiRouter.get('/testimonials', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM testimonials WHERE status = "active" ORDER BY sort_order ASC');
    return jsonSuccess(res, rows);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

// GET /api/settings
apiRouter.get('/settings', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT key_name, key_value FROM site_settings');
    const settingsMap: Record<string, string> = {};
    for (const r of rows) {
      settingsMap[r.key_name] = r.key_value;
    }
    return jsonSuccess(res, settingsMap);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

// POST /api/quote-request, /api/quote-requests, /api/quotes
const handleQuoteSubmission = async (req: Request, res: Response) => {
  try {
    const { full_name, business_name, phone, email, location, camera_count, package_id, packageTier, message } = req.body;

    if (!full_name || !business_name || !phone || !email) {
      return jsonError(res, 'Please provide full name, business name, phone, and email.', 422, {
        full_name: !full_name ? 'Full name is required' : undefined,
        business_name: !business_name ? 'Business name is required' : undefined,
        phone: !phone ? 'Phone is required' : undefined,
        email: !email ? 'Email is required' : undefined,
      });
    }

    let resolvedPackageId = package_id ? Number(package_id) : null;
    if (!resolvedPackageId && packageTier) {
      const [pkgs]: any = await pool.query('SELECT id FROM packages WHERE slug = ? LIMIT 1', [packageTier]);
      if (pkgs && pkgs.length > 0) {
        resolvedPackageId = pkgs[0].id;
      }
    }

    const [result]: any = await pool.query(
      `INSERT INTO quote_requests 
       (full_name, business_name, phone, email, location, camera_count, package_id, message, status, admin_notes, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', '', NOW(), NOW())`,
      [
        String(full_name).trim(),
        String(business_name).trim(),
        String(phone).trim(),
        String(email).trim().toLowerCase(),
        location ? String(location).trim() : null,
        Number(camera_count) || 1,
        resolvedPackageId,
        message ? String(message).trim() : null,
      ]
    );

    const newId = result.insertId;
    await logActivity(null, 'new_quote_request', 'quote_requests', String(newId), `Lead from ${business_name} (${full_name})`);

    // Asynchronously dispatch SMTP email notifications without blocking client
    sendQuoteEmails({
      id: newId,
      full_name,
      business_name,
      phone,
      email,
      location,
      camera_count,
      package_name: packageTier || undefined,
      message,
    }).catch((err) => console.warn('[SMTP Dispatch Warning]:', err?.message));

    return jsonSuccess(res, { id: newId }, 'Thank you. Your quote request has been received.', 201);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};

apiRouter.post('/quote-request', handleQuoteSubmission);
apiRouter.post('/quote-requests', handleQuoteSubmission);
apiRouter.post('/quotes', handleQuoteSubmission);

// POST /api/contact, /api/contact-messages, /api/contacts
const handleContactSubmission = async (req: Request, res: Response) => {
  try {
    const full_name = req.body.full_name || req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const subject = req.body.subject || 'General Inquiry';
    const message = req.body.message;

    if (!full_name || !email || !message) {
      return jsonError(res, 'Please fill out name, email, and message.', 422);
    }

    const [result]: any = await pool.query(
      `INSERT INTO contact_messages 
       (full_name, email, phone, subject, message, status, admin_notes, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, 'new', '', NOW(), NOW())`,
      [
        String(full_name).trim(),
        String(email).trim().toLowerCase(),
        phone ? String(phone).trim() : null,
        String(subject).trim(),
        String(message).trim(),
      ]
    );

    const newId = result.insertId;
    await logActivity(null, 'new_contact_message', 'contact_messages', String(newId), `Message from ${full_name} (${subject})`);

    // Asynchronously dispatch SMTP email notifications
    sendContactEmails({
      id: newId,
      full_name,
      email,
      phone,
      subject,
      message,
    }).catch((err) => console.warn('[SMTP Dispatch Warning]:', err?.message));

    return jsonSuccess(res, { id: newId }, 'Thank you. Your message has been sent to our operations team.', 201);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};

apiRouter.post('/contact', handleContactSubmission);
apiRouter.post('/contact-messages', handleContactSubmission);
apiRouter.post('/contacts', handleContactSubmission);

// POST /api/newsletter
apiRouter.post('/newsletter', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return jsonError(res, 'Please provide a valid business email address.', 422);
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const [existing]: any = await pool.query(
      'SELECT id FROM contact_messages WHERE email = ? AND subject = "Newsletter Lead Subscription" LIMIT 1',
      [cleanEmail]
    );

    if (!existing || existing.length === 0) {
      const [result]: any = await pool.query(
        `INSERT INTO contact_messages 
         (full_name, email, subject, message, status, admin_notes, created_at, updated_at) 
         VALUES (?, ?, ?, ?, 'new', ?, NOW(), NOW())`,
        [
          'Newsletter Subscriber',
          cleanEmail,
          'Newsletter Lead Subscription',
          'Subscribed to Sentrova Surveillance Intelligence & Loss Prevention Briefings via Website Footer.',
          'Lead captured via Footer Newsletter Subscription form.',
        ]
      );
      await logActivity(null, 'newsletter_subscription', 'contacts', String(result.insertId), `Newsletter subscriber: ${cleanEmail}`);
    }

    // Asynchronously dispatch SMTP newsletter emails
    sendNewsletterEmails(cleanEmail).catch((err) => console.warn('[SMTP Dispatch Warning]:', err?.message));

    return jsonSuccess(
      res,
      { email: cleanEmail },
      'Thank you for subscribing to Sentrova Surveillance Intelligence. You have been added to our executive security briefing dispatch list.'
    );
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

// ==========================================
// 2. CHECKOUT & ORDERS (PUBLIC)
// ==========================================

const handleGetPaymentConfig = async (req: Request, res: Response) => {
  try {
    const [packages]: any = await pool.query('SELECT * FROM packages WHERE status = "active" ORDER BY sort_order ASC');
    const [settings]: any = await pool.query('SELECT key_name, key_value FROM site_settings');
    const settingsMap: Record<string, string> = {};
    for (const r of settings) {
      settingsMap[r.key_name] = r.key_value;
    }

    const stripeConfig = getPublicStripeConfig();

    return jsonSuccess(res, {
      ...stripeConfig,
      merchantName: settingsMap.company_name || 'SENTROVA Surveillance Ltd',
      supportHotline: settingsMap.phone || '+44 7742 476163',
      billingContactEmail: settingsMap.email || 'monitoring@sentrova.co.uk',
      acceptedCards: ['visa', 'mastercard', 'amex', 'discover'],
      terms: 'Hourly surveillance contracts are billed on a flexible retainer basis. Zero lock-in contracts. 30-day cancellation notice.',
      packages: packages.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        subtitle: p.subtitle,
        price: Number(p.price),
        currency: p.currency,
        billing_unit: p.billing_unit,
        popular: Boolean(p.popular),
      })),
    });
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};

apiRouter.get('/checkout/config', handleGetPaymentConfig);
apiRouter.get('/payment/config', handleGetPaymentConfig);

const handleCreatePaymentIntent = async (req: Request, res: Response) => {
  try {
    const { package_slug, hours, company_name, contact_name, email, phone, camera_count, location, currency = 'usd' } = req.body;

    if (!package_slug || !hours || !company_name || !contact_name || !email) {
      return jsonError(res, 'Missing required fields for checkout.', 422);
    }

    const [packages]: any = await pool.query('SELECT * FROM packages WHERE slug = ? LIMIT 1', [package_slug]);
    if (!packages || packages.length === 0) {
      return jsonError(res, 'Invalid package selected', 404);
    }

    const pkg = packages[0];
    const numericHours = Math.max(1, parseInt(String(hours), 10) || 1);
    const hourlyRate = Number(pkg.price);
    const subtotal = Math.round(hourlyRate * numericHours * 100) / 100;
    const amountInCents = Math.round(subtotal * 100);

    const stripe = getStripe();

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: String(currency).toLowerCase(),
        automatic_payment_methods: { enabled: true },
        description: `SENTROVA ${pkg.name} CCTV Monitoring - ${numericHours} Hours`,
        receipt_email: String(email).trim().toLowerCase(),
        metadata: {
          package_id: String(pkg.id),
          package_slug: pkg.slug,
          package_name: pkg.name,
          company_name: String(company_name).trim(),
          contact_name: String(contact_name).trim(),
          phone: phone ? String(phone).trim() : '',
          hours: String(numericHours),
          camera_count: String(camera_count || 1),
          location: location ? String(location).trim() : '',
        },
      });

      return jsonSuccess(res, {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: subtotal,
        currency: currency.toUpperCase(),
        hourly_rate: hourlyRate,
        hours: numericHours,
        package_name: pkg.name,
        package_slug: pkg.slug,
        is_sandbox: false,
      });
    }

    // Fallback Sandbox simulation
    const simulatedIntentId = `pi_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const simulatedClientSecret = `${simulatedIntentId}_secret_${Math.random().toString(36).substring(2, 12)}`;

    return jsonSuccess(res, {
      client_secret: simulatedClientSecret,
      payment_intent_id: simulatedIntentId,
      amount: subtotal,
      currency: currency.toUpperCase(),
      hourly_rate: hourlyRate,
      hours: numericHours,
      package_name: pkg.name,
      package_slug: pkg.slug,
      is_sandbox: true,
      notice: 'Running in Secure Sandbox Simulation Mode. Live Stripe keys can be configured in .env',
    });
  } catch (error: any) {
    return jsonError(res, error.message || 'Failed to initialize payment gateway', 500);
  }
};

apiRouter.post('/checkout/create-payment-intent', handleCreatePaymentIntent);
apiRouter.post('/payment/create-intent', handleCreatePaymentIntent);
apiRouter.post('/payment/create-payment-intent', handleCreatePaymentIntent);

const handleConfirmOrder = async (req: Request, res: Response) => {
  try {
    const {
      payment_intent_id,
      company_name,
      contact_name,
      email,
      phone,
      location,
      package_slug,
      hours,
      camera_count,
      setup_date,
      special_instructions,
      card_last4 = '4242',
      card_brand = 'visa',
      payment_method = 'card',
    } = req.body;

    if (!company_name || !contact_name || !email || !phone || !package_slug || !hours) {
      return jsonError(res, 'Please provide all customer contact and package details.', 422);
    }

    const [packages]: any = await pool.query('SELECT * FROM packages WHERE slug = ? LIMIT 1', [package_slug]);
    const pkg = packages && packages.length > 0 ? packages[0] : null;

    const numericHours = Math.max(1, parseInt(String(hours), 10) || 1);
    const hourlyRate = pkg ? Number(pkg.price) : 2.99;
    const subtotal = Math.round(hourlyRate * numericHours * 100) / 100;
    const taxAmount = 0.0;
    const totalAmount = subtotal + taxAmount;

    const [orderCountRow]: any = await pool.query('SELECT COUNT(*) as count FROM payment_orders');
    const orderIndex = (orderCountRow[0].count || 0) + 1;
    const invoiceNumber = `INV-STV-2026-${String(orderIndex).padStart(4, '0')}`;
    const transactionId = payment_intent_id || `TXN-STV-2026-${Date.now().toString().slice(-6)}`;
    const isSandbox = !payment_intent_id || payment_intent_id.startsWith('pi_sim_');

    const [result]: any = await pool.query(
      `INSERT INTO payment_orders 
       (transaction_id, invoice_number, company_name, contact_name, email, phone, location, package_id, package_name, package_slug, hourly_rate, hours_purchased, subtotal, tax_amount, total_amount, currency, camera_count, setup_date, special_instructions, payment_method, payment_intent_id, card_last4, card_brand, status, is_sandbox, admin_notes, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?, ?, ?, 'paid', ?, ?, NOW(), NOW())`,
      [
        transactionId,
        invoiceNumber,
        String(company_name).trim(),
        String(contact_name).trim(),
        String(email).trim().toLowerCase(),
        String(phone).trim(),
        location ? String(location).trim() : null,
        pkg ? pkg.id : null,
        pkg ? pkg.name : package_slug.toUpperCase(),
        package_slug,
        hourlyRate,
        numericHours,
        subtotal,
        taxAmount,
        totalAmount,
        Number(camera_count) || 1,
        setup_date || null,
        special_instructions ? String(special_instructions).trim() : null,
        payment_method,
        payment_intent_id || null,
        card_last4,
        card_brand,
        isSandbox ? 1 : 0,
        'Retainer confirmed via Checkout Gateway.',
      ]
    );

    const [newOrderRows]: any = await pool.query('SELECT * FROM payment_orders WHERE id = ?', [result.insertId]);
    const newOrder = newOrderRows[0];

    await logActivity(null, 'order_placed', 'payment_orders', String(newOrder.id), `New Order ${invoiceNumber} ($${totalAmount}) for ${company_name}`);

    return jsonSuccess(res, {
      ...newOrder,
      hourly_rate: Number(newOrder.hourly_rate),
      subtotal: Number(newOrder.subtotal),
      tax_amount: Number(newOrder.tax_amount),
      total_amount: Number(newOrder.total_amount),
      is_sandbox: Boolean(newOrder.is_sandbox),
    }, 'Order placed and surveillance monitoring schedule activated successfully.', 201);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};

apiRouter.post('/checkout/confirm-order', handleConfirmOrder);
apiRouter.post('/payment/confirm-order', handleConfirmOrder);

const handleGetOrder = async (req: Request, res: Response) => {
  try {
    const txn = req.params.transactionId || req.params.id;
    const [rows]: any = await pool.query(
      'SELECT * FROM payment_orders WHERE id = ? OR transaction_id = ? OR invoice_number = ? LIMIT 1',
      [isNaN(Number(txn)) ? -1 : Number(txn), txn, txn]
    );

    if (!rows || rows.length === 0) {
      return jsonError(res, 'Order not found', 404);
    }

    const r = rows[0];
    return jsonSuccess(res, {
      ...r,
      hourly_rate: Number(r.hourly_rate),
      subtotal: Number(r.subtotal),
      tax_amount: Number(r.tax_amount),
      total_amount: Number(r.total_amount),
      is_sandbox: Boolean(r.is_sandbox),
    });
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};

apiRouter.get('/checkout/order/:transactionId', handleGetOrder);
apiRouter.get('/payment/orders/:id', handleGetOrder);
apiRouter.get('/payment/order/:transactionId', handleGetOrder);

// ==========================================
// 3. ADMIN AUTHENTICATION
// ==========================================

apiRouter.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return jsonError(res, 'Email and password are required', 422);
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const [rows]: any = await pool.query('SELECT * FROM admins WHERE email = ?', [cleanEmail]);

    if (!rows || rows.length === 0) {
      await logActivity(null, 'login_failed', 'auth', null, `Failed login attempt for ${email}`);
      return jsonError(res, 'Invalid email or password', 401);
    }

    const admin = rows[0];

    if (!verifyPassword(password, admin.password_hash, admin.salt)) {
      await logActivity(null, 'login_failed', 'auth', null, `Failed login attempt for ${email}`);
      return jsonError(res, 'Invalid email or password', 401);
    }

    if (admin.status !== 'active') {
      return jsonError(res, 'Admin account is deactivated', 403);
    }

    await pool.query('UPDATE admins SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?', [req.ip || '127.0.0.1', admin.id]);

    const token = signJwt({
      admin_id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await logActivity(admin.id, 'login_success', 'auth', String(admin.id), `${admin.name} logged in`);

    return jsonSuccess(res, {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    }, 'Authentication successful');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.get('/admin/me', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  return jsonSuccess(res, {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.status,
    last_login_at: admin.last_login_at,
  });
});

apiRouter.post('/admin/logout', requireAdmin, async (req, res) => {
  const admin = (req as any).admin;
  await logActivity(admin.id, 'logout', 'auth', String(admin.id), 'Admin logged out');
  return jsonSuccess(res, {}, 'Logged out successfully');
});

apiRouter.post('/admin/change-password', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return jsonError(res, 'Current password and new password are required', 422);
    }

    if (!verifyPassword(current_password, admin.password_hash, admin.salt)) {
      return jsonError(res, 'Current password does not match', 400);
    }

    if (String(new_password).length < 8) {
      return jsonError(res, 'New password must be at least 8 characters long', 422);
    }

    const hashed = hashPassword(new_password);
    await pool.query('UPDATE admins SET password_hash = ?, salt = ?, updated_at = NOW() WHERE id = ?', [
      hashed.hash,
      hashed.salt,
      admin.id,
    ]);

    await logActivity(admin.id, 'change_password', 'admins', String(admin.id), 'Admin changed password');
    return jsonSuccess(res, {}, 'Password updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

// ==========================================
// 4. ADMIN DASHBOARD & METRICS
// ==========================================

apiRouter.get('/admin/dashboard', requireAdmin, async (req, res) => {
  try {
    const [quoteCounts]: any = await pool.query(`
      SELECT 
        COUNT(*) as total_quotes,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_leads,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM quote_requests
    `);

    const [contactCounts]: any = await pool.query(`
      SELECT 
        COUNT(*) as contact_total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as contact_unread
      FROM contact_messages
    `);

    const [pkgCount]: any = await pool.query('SELECT COUNT(*) as active_packages FROM packages WHERE status = "active"');
    const [svcCount]: any = await pool.query('SELECT COUNT(*) as active_services FROM services WHERE status = "active"');

    const [orderStats]: any = await pool.query(`
      SELECT 
        COUNT(*) as paid_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(hours_purchased), 0) as total_hours_sold
      FROM payment_orders
      WHERE status IN ('paid', 'active')
    `);

    const [recentLeads]: any = await pool.query(`
      SELECT q.*, p.name as package_name 
      FROM quote_requests q 
      LEFT JOIN packages p ON q.package_id = p.id 
      ORDER BY q.id DESC LIMIT 8
    `);

    const [recentOrders]: any = await pool.query('SELECT * FROM payment_orders ORDER BY id DESC LIMIT 6');

    const [recentLogs]: any = await pool.query(`
      SELECT l.*, a.name as admin_name 
      FROM admin_activity_logs l 
      LEFT JOIN admins a ON l.admin_id = a.id 
      ORDER BY l.id DESC LIMIT 8
    `);

    const q = quoteCounts[0] || {};
    const c = contactCounts[0] || {};
    const o = orderStats[0] || {};

    return jsonSuccess(res, {
      metrics: {
        total_quotes: Number(q.total_quotes) || 0,
        new_leads: Number(q.new_leads) || 0,
        in_progress: Number(q.in_progress) || 0,
        completed: Number(q.completed) || 0,
        contact_unread: Number(c.contact_unread) || 0,
        contact_total: Number(c.contact_total) || 0,
        active_packages: Number(pkgCount[0]?.active_packages) || 0,
        active_services: Number(svcCount[0]?.active_services) || 0,
        total_revenue: Number(o.total_revenue) || 0,
        paid_orders: Number(o.paid_orders) || 0,
        total_hours_sold: Number(o.total_hours_sold) || 0,
      },
      recent_leads: recentLeads,
      recent_orders: recentOrders,
      recent_logs: recentLogs,
    });
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

// ==========================================
// 5. CRM: QUOTE REQUESTS MANAGEMENT
// ==========================================

apiRouter.get('/admin/quotes', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const status = req.query.status as string;
    const packageId = req.query.package_id as string;
    const search = (req.query.search as string || '').toLowerCase().trim();

    const whereClauses: string[] = ['1=1'];
    const queryParams: any[] = [];

    if (status && status !== 'all') {
      whereClauses.push('q.status = ?');
      queryParams.push(status);
    }

    if (packageId && packageId !== 'all') {
      whereClauses.push('q.package_id = ?');
      queryParams.push(Number(packageId));
    }

    if (search) {
      whereClauses.push('(LOWER(q.full_name) LIKE ? OR LOWER(q.business_name) LIKE ? OR LOWER(q.email) LIKE ? OR q.phone LIKE ? OR LOWER(q.location) LIKE ?)');
      const wild = `%${search}%`;
      queryParams.push(wild, wild, wild, wild, wild);
    }

    const whereStr = whereClauses.join(' AND ');

    const [countRows]: any = await pool.query(
      `SELECT COUNT(*) as total FROM quote_requests q WHERE ${whereStr}`,
      queryParams
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    const [records]: any = await pool.query(
      `SELECT q.*, p.name as package_name, p.currency as package_currency, p.price as package_price, p.billing_unit as package_billing_unit 
       FROM quote_requests q 
       LEFT JOIN packages p ON q.package_id = p.id 
       WHERE ${whereStr} 
       ORDER BY q.id DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return jsonSuccess(res, {
      records,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    });
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.get('/admin/quotes/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows]: any = await pool.query(
      `SELECT q.*, p.name as package_name 
       FROM quote_requests q 
       LEFT JOIN packages p ON q.package_id = p.id 
       WHERE q.id = ?`,
      [id]
    );

    if (!rows || rows.length === 0) return jsonError(res, 'Quote not found', 404);
    return jsonSuccess(res, rows[0]);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.put('/admin/quotes/:id', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);
    const { status, admin_notes } = req.body;

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(admin_notes);
    }

    params.push(id);
    await pool.query(`UPDATE quote_requests SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM quote_requests WHERE id = ?', [id]);
    await logActivity(admin.id, 'update_quote', 'quote_requests', String(id), `Updated quote #${id} status: ${status}`);

    return jsonSuccess(res, rows[0], 'Quote updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleDeleteQuote = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);

    const [rows]: any = await pool.query('SELECT * FROM quote_requests WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return jsonError(res, 'Quote not found', 404);

    await pool.query('DELETE FROM quote_requests WHERE id = ?', [id]);
    await logActivity(admin.id, 'delete_quote', 'quote_requests', String(id), `Deleted quote #${id}`);

    return jsonSuccess(res, {}, 'Quote deleted successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};
apiRouter.delete('/admin/quotes/:id', requireAdmin, handleDeleteQuote);
apiRouter.post('/admin/quotes/:id/delete', requireAdmin, handleDeleteQuote);

// ==========================================
// 6. CONTACT MESSAGES MANAGEMENT
// ==========================================

apiRouter.get('/admin/contacts', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const status = req.query.status as string;

    const whereClauses: string[] = ['1=1'];
    const queryParams: any[] = [];

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      queryParams.push(status);
    }

    const whereStr = whereClauses.join(' AND ');

    const [countRows]: any = await pool.query(`SELECT COUNT(*) as total FROM contact_messages WHERE ${whereStr}`, queryParams);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    const [records]: any = await pool.query(
      `SELECT * FROM contact_messages WHERE ${whereStr} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return jsonSuccess(res, {
      records,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    });
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.get('/admin/contacts/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows]: any = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return jsonError(res, 'Message not found', 404);
    return jsonSuccess(res, rows[0]);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.put('/admin/contacts/:id', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);
    const { status, admin_notes } = req.body;

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(admin_notes);
    }

    params.push(id);
    await pool.query(`UPDATE contact_messages SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    await logActivity(admin.id, 'update_contact', 'contact_messages', String(id), `Updated message #${id} status: ${status}`);

    return jsonSuccess(res, rows[0], 'Contact message updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleDeleteContact = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);

    const [rows]: any = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return jsonError(res, 'Message not found', 404);

    await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    await logActivity(admin.id, 'delete_contact', 'contact_messages', String(id), `Deleted message from ${rows[0].full_name}`);

    return jsonSuccess(res, {}, 'Message deleted successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};
apiRouter.delete('/admin/contacts/:id', requireAdmin, handleDeleteContact);
apiRouter.post('/admin/contacts/:id/delete', requireAdmin, handleDeleteContact);

// ==========================================
// 7. ORDERS MANAGEMENT
// ==========================================

apiRouter.get('/admin/orders', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const status = req.query.status as string;
    const search = (req.query.search as string || '').toLowerCase().trim();

    const whereClauses: string[] = ['1=1'];
    const queryParams: any[] = [];

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      queryParams.push(status);
    }

    if (search) {
      whereClauses.push('(LOWER(company_name) LIKE ? OR LOWER(contact_name) LIKE ? OR LOWER(email) LIKE ? OR phone LIKE ? OR transaction_id LIKE ? OR invoice_number LIKE ?)');
      const wild = `%${search}%`;
      queryParams.push(wild, wild, wild, wild, wild, wild);
    }

    const whereStr = whereClauses.join(' AND ');

    const [countRows]: any = await pool.query(`SELECT COUNT(*) as total FROM payment_orders WHERE ${whereStr}`, queryParams);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    const [records]: any = await pool.query(
      `SELECT * FROM payment_orders WHERE ${whereStr} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return jsonSuccess(res, {
      records: records.map((r: any) => ({
        ...r,
        hourly_rate: Number(r.hourly_rate),
        subtotal: Number(r.subtotal),
        tax_amount: Number(r.tax_amount),
        total_amount: Number(r.total_amount),
        is_sandbox: Boolean(r.is_sandbox),
      })),
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    });
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.get('/admin/orders/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows]: any = await pool.query('SELECT * FROM payment_orders WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return jsonError(res, 'Order not found', 404);
    const r = rows[0];
    return jsonSuccess(res, {
      ...r,
      hourly_rate: Number(r.hourly_rate),
      subtotal: Number(r.subtotal),
      tax_amount: Number(r.tax_amount),
      total_amount: Number(r.total_amount),
      is_sandbox: Boolean(r.is_sandbox),
    });
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleUpdateOrder = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);
    const { status, admin_notes } = req.body;

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(admin_notes);
    }

    params.push(id);
    await pool.query(`UPDATE payment_orders SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM payment_orders WHERE id = ?', [id]);
    await logActivity(admin.id, 'update_order', 'payment_orders', String(id), `Updated order #${id} status: ${status}`);

    return jsonSuccess(res, rows[0], 'Order updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};
apiRouter.put('/admin/orders/:id', requireAdmin, handleUpdateOrder);
apiRouter.put('/admin/orders/:id/status', requireAdmin, handleUpdateOrder);

const handleDeleteOrder = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);

    const [rows]: any = await pool.query('SELECT * FROM payment_orders WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return jsonError(res, 'Order not found', 404);

    await pool.query('DELETE FROM payment_orders WHERE id = ?', [id]);
    await logActivity(admin.id, 'delete_order', 'payment_orders', String(id), `Deleted order #${id} (${rows[0].invoice_number})`);

    return jsonSuccess(res, {}, 'Order deleted successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};
apiRouter.delete('/admin/orders/:id', requireAdmin, handleDeleteOrder);
apiRouter.post('/admin/orders/:id/delete', requireAdmin, handleDeleteOrder);

// ==========================================
// 8. PACKAGES & FEATURES MANAGEMENT
// ==========================================

apiRouter.get('/admin/packages', requireAdmin, async (req, res) => {
  try {
    const [packages]: any = await pool.query('SELECT * FROM packages ORDER BY sort_order ASC');
    const [features]: any = await pool.query('SELECT * FROM package_features ORDER BY sort_order ASC');

    const result = packages.map((pkg: any) => ({
      ...pkg,
      popular: Boolean(pkg.popular),
      price: Number(pkg.price),
      features: features.filter((f: any) => f.package_id === pkg.id),
    }));

    return jsonSuccess(res, result);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.get('/admin/packages/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [packages]: any = await pool.query('SELECT * FROM packages WHERE id = ?', [id]);
    if (!packages || packages.length === 0) return jsonError(res, 'Package not found', 404);

    const [features]: any = await pool.query('SELECT * FROM package_features WHERE package_id = ? ORDER BY sort_order ASC', [id]);

    const pkg = packages[0];
    return jsonSuccess(res, {
      ...pkg,
      popular: Boolean(pkg.popular),
      price: Number(pkg.price),
      features,
    });
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.put('/admin/packages/:id', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);
    const { name, subtitle, price, currency, billing_unit, description, popular, sort_order, status } = req.body;

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(String(name)); }
    if (subtitle !== undefined) { updates.push('subtitle = ?'); params.push(String(subtitle)); }
    if (price !== undefined) { updates.push('price = ?'); params.push(Number(price)); }
    if (currency !== undefined) { updates.push('currency = ?'); params.push(String(currency)); }
    if (billing_unit !== undefined) { updates.push('billing_unit = ?'); params.push(String(billing_unit)); }
    if (description !== undefined) { updates.push('description = ?'); params.push(String(description)); }
    if (popular !== undefined) { updates.push('popular = ?'); params.push(popular ? 1 : 0); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(Number(sort_order)); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    params.push(id);
    await pool.query(`UPDATE packages SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM packages WHERE id = ?', [id]);
    await logActivity(admin.id, 'update_package', 'packages', String(id), `Updated package ${rows[0].name}`);

    return jsonSuccess(res, rows[0], 'Package updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleAddFeature = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    let packageId = Number(req.params.id || req.body.package_id || 1);
    if (isNaN(packageId) && typeof req.body.package_id === 'string') {
      const [pkgs]: any = await pool.query('SELECT id FROM packages WHERE slug = ? LIMIT 1', [req.body.package_id]);
      if (pkgs && pkgs.length > 0) packageId = pkgs[0].id;
      else packageId = 1;
    }
    const feature = req.body.feature || req.body.name;
    const sort_order = req.body.sort_order;

    if (!feature || !String(feature).trim()) {
      return jsonError(res, 'Feature title is required', 422);
    }

    const [result]: any = await pool.query(
      'INSERT INTO package_features (package_id, feature, sort_order, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [packageId, String(feature).trim(), Number(sort_order) || 0]
    );

    const [rows]: any = await pool.query('SELECT * FROM package_features WHERE id = ?', [result.insertId]);
    await logActivity(admin.id, 'add_feature', 'package_features', String(result.insertId), `Added feature to package #${packageId}`);

    return jsonSuccess(res, rows[0], 'Feature added successfully', 201);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};

apiRouter.post('/admin/packages/:id/features', requireAdmin, handleAddFeature);
apiRouter.post('/admin/features', requireAdmin, handleAddFeature);

apiRouter.put('/admin/features/:id', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);
    const { feature, sort_order } = req.body;

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];

    if (feature !== undefined) { updates.push('feature = ?'); params.push(String(feature).trim()); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(Number(sort_order)); }

    params.push(id);
    await pool.query(`UPDATE package_features SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM package_features WHERE id = ?', [id]);
    await logActivity(admin.id, 'update_feature', 'package_features', String(id), `Updated feature #${id}`);

    return jsonSuccess(res, rows[0], 'Feature updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleDeleteFeature = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);

    await pool.query('DELETE FROM package_features WHERE id = ?', [id]);
    await logActivity(admin.id, 'delete_feature', 'package_features', String(id), `Deleted feature #${id}`);

    return jsonSuccess(res, {}, 'Feature deleted successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};
apiRouter.delete('/admin/features/:id', requireAdmin, handleDeleteFeature);
apiRouter.post('/admin/features/:id/delete', requireAdmin, handleDeleteFeature);

// ==========================================
// 9. SERVICES MANAGEMENT
// ==========================================

apiRouter.get('/admin/services', requireAdmin, async (req, res) => {
  try {
    const search = (req.query.search as string || '').toLowerCase().trim();
    let query = 'SELECT * FROM services ORDER BY sort_order ASC';
    let params: any[] = [];

    if (search) {
      query = 'SELECT * FROM services WHERE LOWER(title) LIKE ? OR LOWER(short_description) LIKE ? ORDER BY sort_order ASC';
      params = [`%${search}%`, `%${search}%`];
    }

    const [rows]: any = await pool.query(query, params);
    return jsonSuccess(res, rows);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.post('/admin/services', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const title = req.body.title || req.body.name;
    const short_description = req.body.short_description || req.body.description || '';
    const description = req.body.description || req.body.full_description || short_description;
    const { icon, image, sort_order, status } = req.body;

    if (!title) {
      return jsonError(res, 'Title (or name) is required', 422);
    }

    const slug = req.body.slug || String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const [result]: any = await pool.query(
      `INSERT INTO services 
       (slug, title, short_description, description, icon, image, sort_order, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        slug,
        String(title).trim(),
        String(short_description).trim(),
        String(description).trim(),
        icon ? String(icon).trim() : 'ShieldAlert',
        image || null,
        Number(sort_order) || 0,
        status === 'inactive' ? 'inactive' : 'active',
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    await logActivity(admin.id, 'create_service', 'services', String(result.insertId), `Created service ${title}`);

    return jsonSuccess(res, rows[0], 'Service created successfully', 201);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.put('/admin/services/:id', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);
    const title = req.body.title || req.body.name;
    const short_description = req.body.short_description;
    const description = req.body.description || req.body.full_description;
    const { icon, image, sort_order, status } = req.body;

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(String(title).trim()); }
    if (short_description !== undefined) { updates.push('short_description = ?'); params.push(String(short_description).trim()); }
    if (description !== undefined) { updates.push('description = ?'); params.push(String(description).trim()); }
    if (icon !== undefined) { updates.push('icon = ?'); params.push(String(icon).trim()); }
    if (image !== undefined) { updates.push('image = ?'); params.push(image); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(Number(sort_order)); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    params.push(id);
    await pool.query(`UPDATE services SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    await logActivity(admin.id, 'update_service', 'services', String(id), `Updated service ${rows[0]?.title}`);

    return jsonSuccess(res, rows[0], 'Service updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleDeleteService = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);

    const [rows]: any = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return jsonError(res, 'Service not found', 404);

    await pool.query('DELETE FROM services WHERE id = ?', [id]);
    await logActivity(admin.id, 'delete_service', 'services', String(id), `Deleted service ${rows[0].title}`);

    return jsonSuccess(res, {}, 'Service deleted successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};
apiRouter.delete('/admin/services/:id', requireAdmin, handleDeleteService);
apiRouter.post('/admin/services/:id/delete', requireAdmin, handleDeleteService);

// ==========================================
// 10. INDUSTRIES MANAGEMENT
// ==========================================

apiRouter.get('/admin/industries', requireAdmin, async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM industries ORDER BY sort_order ASC');
    return jsonSuccess(res, rows);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.post('/admin/industries', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const { name, description, icon, sort_order, status } = req.body;

    if (!name) return jsonError(res, 'Industry name is required', 422);

    const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const [result]: any = await pool.query(
      `INSERT INTO industries 
       (name, slug, description, icon, sort_order, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        String(name).trim(),
        slug,
        description ? String(description).trim() : '',
        icon ? String(icon).trim() : 'Building2',
        Number(sort_order) || 0,
        status === 'inactive' ? 'inactive' : 'active',
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM industries WHERE id = ?', [result.insertId]);
    await logActivity(admin.id, 'create_industry', 'industries', String(result.insertId), `Created industry ${name}`);

    return jsonSuccess(res, rows[0], 'Industry created successfully', 201);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.put('/admin/industries/:id', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);
    const { name, description, icon, sort_order, status } = req.body;

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(String(name).trim()); }
    if (description !== undefined) { updates.push('description = ?'); params.push(String(description).trim()); }
    if (icon !== undefined) { updates.push('icon = ?'); params.push(String(icon).trim()); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(Number(sort_order)); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    params.push(id);
    await pool.query(`UPDATE industries SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM industries WHERE id = ?', [id]);
    await logActivity(admin.id, 'update_industry', 'industries', String(id), `Updated industry ${rows[0]?.name}`);

    return jsonSuccess(res, rows[0], 'Industry updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleDeleteIndustry = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);

    const [rows]: any = await pool.query('SELECT * FROM industries WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return jsonError(res, 'Industry not found', 404);

    await pool.query('DELETE FROM industries WHERE id = ?', [id]);
    await logActivity(admin.id, 'delete_industry', 'industries', String(id), `Deleted industry ${rows[0].name}`);

    return jsonSuccess(res, {}, 'Industry deleted successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};
apiRouter.delete('/admin/industries/:id', requireAdmin, handleDeleteIndustry);
apiRouter.post('/admin/industries/:id/delete', requireAdmin, handleDeleteIndustry);

// ==========================================
// 11. FAQS MANAGEMENT
// ==========================================

apiRouter.get('/admin/faqs', requireAdmin, async (req, res) => {
  try {
    let rows: any = [];
    try {
      [rows] = await pool.query('SELECT * FROM faqs ORDER BY sort_order ASC, id ASC');
    } catch {
      [rows] = await pool.query('SELECT * FROM faq ORDER BY sort_order ASC, id ASC');
    }
    return jsonSuccess(res, rows);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.post('/admin/faqs', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const { question, answer, sort_order, status } = req.body;

    if (!question || !answer) return jsonError(res, 'Question and answer are required', 422);

    let insertId: any = 0;
    try {
      const [r]: any = await pool.query(
        `INSERT INTO faqs (question, answer, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [String(question).trim(), String(answer).trim(), Number(sort_order) || 0, status === 'inactive' ? 'inactive' : 'active']
      );
      insertId = r.insertId;
    } catch {
      const [r]: any = await pool.query(
        `INSERT INTO faq (question, answer, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [String(question).trim(), String(answer).trim(), Number(sort_order) || 0, status === 'inactive' ? 'inactive' : 'active']
      );
      insertId = r.insertId;
    }

    await logActivity(admin.id, 'create_faq', 'faqs', String(insertId), 'Created FAQ');
    return jsonSuccess(res, { id: insertId, question, answer, sort_order: Number(sort_order) || 0, status: status || 'active' }, 'FAQ created successfully', 201);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.put('/admin/faqs/:id', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);
    const { question, answer, sort_order, status } = req.body;

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];

    if (question !== undefined) { updates.push('question = ?'); params.push(String(question).trim()); }
    if (answer !== undefined) { updates.push('answer = ?'); params.push(String(answer).trim()); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(Number(sort_order)); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    params.push(id);
    try {
      await pool.query(`UPDATE faqs SET ${updates.join(', ')} WHERE id = ?`, params);
    } catch {}
    try {
      await pool.query(`UPDATE faq SET ${updates.join(', ')} WHERE id = ?`, params);
    } catch {}

    await logActivity(admin.id, 'update_faq', 'faqs', String(id), 'Updated FAQ');
    return jsonSuccess(res, { id, question, answer, sort_order, status }, 'FAQ updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleDeleteFaq = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);

    try { await pool.query('DELETE FROM faqs WHERE id = ?', [id]); } catch {}
    try { await pool.query('DELETE FROM faq WHERE id = ?', [id]); } catch {}
    await logActivity(admin.id, 'delete_faq', 'faqs', String(id), 'Deleted FAQ');

    return jsonSuccess(res, {}, 'FAQ deleted successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};
apiRouter.delete('/admin/faqs/:id', requireAdmin, handleDeleteFaq);
apiRouter.post('/admin/faqs/:id/delete', requireAdmin, handleDeleteFaq);

// ==========================================
// 12. TESTIMONIALS MANAGEMENT
// ==========================================

apiRouter.get('/admin/testimonials', requireAdmin, async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM testimonials ORDER BY sort_order ASC');
    return jsonSuccess(res, rows);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.post('/admin/testimonials', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const { customer_name, company_name, designation, content, rating, sort_order, status } = req.body;

    if (!customer_name || !company_name || !content) {
      return jsonError(res, 'Customer name, company name, and review content are required', 422);
    }

    const [result]: any = await pool.query(
      `INSERT INTO testimonials 
       (customer_name, company_name, designation, content, rating, sort_order, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        String(customer_name).trim(),
        String(company_name).trim(),
        designation ? String(designation).trim() : null,
        String(content).trim(),
        Number(rating) || 5,
        Number(sort_order) || 0,
        status === 'inactive' ? 'inactive' : 'active',
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM testimonials WHERE id = ?', [result.insertId]);
    await logActivity(admin.id, 'create_testimonial', 'testimonials', String(result.insertId), `Created testimonial for ${customer_name}`);

    return jsonSuccess(res, rows[0], 'Testimonial created successfully', 201);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

apiRouter.put('/admin/testimonials/:id', requireAdmin, async (req, res) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);
    const { customer_name, company_name, designation, content, rating, sort_order, status } = req.body;

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];

    if (customer_name !== undefined) { updates.push('customer_name = ?'); params.push(String(customer_name).trim()); }
    if (company_name !== undefined) { updates.push('company_name = ?'); params.push(String(company_name).trim()); }
    if (designation !== undefined) { updates.push('designation = ?'); params.push(designation ? String(designation).trim() : null); }
    if (content !== undefined) { updates.push('content = ?'); params.push(String(content).trim()); }
    if (rating !== undefined) { updates.push('rating = ?'); params.push(Number(rating)); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(Number(sort_order)); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    params.push(id);
    await pool.query(`UPDATE testimonials SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    await logActivity(admin.id, 'update_testimonial', 'testimonials', String(id), `Updated testimonial #${id}`);

    return jsonSuccess(res, rows[0], 'Testimonial updated successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleDeleteTestimonial = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const id = Number(req.params.id);

    await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
    await logActivity(admin.id, 'delete_testimonial', 'testimonials', String(id), `Deleted testimonial #${id}`);

    return jsonSuccess(res, {}, 'Testimonial deleted successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};
apiRouter.delete('/admin/testimonials/:id', requireAdmin, handleDeleteTestimonial);
apiRouter.post('/admin/testimonials/:id/delete', requireAdmin, handleDeleteTestimonial);

// ==========================================
// 13. SETTINGS & LOGS MANAGEMENT
// ==========================================

apiRouter.get('/admin/settings', requireAdmin, async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT key_name, key_value FROM site_settings');
    const settingsMap: Record<string, string> = {};
    for (const r of rows) {
      settingsMap[r.key_name] = r.key_value;
    }
    return jsonSuccess(res, settingsMap);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});

const handleSaveSettings = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const settingsObj = req.body;

    if (!settingsObj || typeof settingsObj !== 'object') {
      return jsonError(res, 'Settings object is required', 422);
    }

    for (const [key, val] of Object.entries(settingsObj)) {
      await pool.query(
        `INSERT INTO site_settings (key_name, key_value, field_group, created_at, updated_at) 
         VALUES (?, ?, 'general', NOW(), NOW()) 
         ON DUPLICATE KEY UPDATE key_value = VALUES(key_value), updated_at = NOW()`,
        [key, String(val ?? '')]
      );
    }

    if (admin) {
      await logActivity(admin.id, 'update_settings', 'site_settings', null, 'Updated global site settings');
    }

    const [rows]: any = await pool.query('SELECT key_name, key_value FROM site_settings');
    const settingsMap: Record<string, string> = {};
    for (const r of rows) {
      settingsMap[r.key_name] = r.key_value;
    }

    return jsonSuccess(res, settingsMap, 'Settings saved successfully');
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
};

apiRouter.post('/admin/settings', requireAdmin, handleSaveSettings);
apiRouter.put('/admin/settings', requireAdmin, handleSaveSettings);
apiRouter.put('/settings', requireAdmin, handleSaveSettings);
apiRouter.post('/settings', requireAdmin, handleSaveSettings);

apiRouter.post('/admin/settings/test-email', requireAdmin, async (req: Request, res: Response) => {
  try {
    const targetEmail = req.body.email || (req as any).admin?.email;
    if (!targetEmail) {
      return jsonError(res, 'Target email address is required', 422);
    }
    const result = await sendTestEmail(targetEmail);
    if (!result.success) {
      return jsonError(res, result.message, 400);
    }
    return jsonSuccess(res, null, result.message);
  } catch (err: any) {
    return jsonError(res, err.message, 500);
  }
});

apiRouter.get('/admin/logs', requireAdmin, async (req, res) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT l.*, a.name as admin_name 
      FROM admin_activity_logs l 
      LEFT JOIN admins a ON l.admin_id = a.id 
      ORDER BY l.id DESC 
      LIMIT 100
    `);
    return jsonSuccess(res, rows);
  } catch (error: any) {
    return jsonError(res, error.message, 500);
  }
});
