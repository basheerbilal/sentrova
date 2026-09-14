import nodemailer from 'nodemailer';
import { pool } from './mysql';

interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  adminEmail: string;
}

// Read config from .env with fallback to database site_settings
async function getMailConfig(): Promise<MailConfig | null> {
  // Check env first
  let host = process.env.SMTP_HOST || '';
  let port = Number(process.env.SMTP_PORT) || 465;
  let secure = process.env.SMTP_SECURE === 'true' || port === 465;
  let user = process.env.SMTP_USER || '';
  let pass = process.env.SMTP_PASS || '';
  let from = process.env.SMTP_FROM || '"SENTROVA Operations" <monitoring@sentrova.co.uk>';
  let adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'monitoring@sentrova.co.uk';

  // If host/user not in env, check database site_settings
  if (!host || !user) {
    try {
      const [rows]: any = await pool.query(
        "SELECT key_name, key_value FROM site_settings WHERE key_name IN ('smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_secure', 'smtp_from', 'admin_notification_email', 'email')"
      );
      const map: Record<string, string> = {};
      for (const r of rows) {
        map[r.key_name] = r.key_value;
      }
      if (map.smtp_host) host = map.smtp_host;
      if (map.smtp_port) port = Number(map.smtp_port) || 465;
      if (map.smtp_secure !== undefined) secure = map.smtp_secure === '1' || map.smtp_secure === 'true';
      if (map.smtp_user) user = map.smtp_user;
      if (map.smtp_pass) pass = map.smtp_pass;
      if (map.smtp_from) from = map.smtp_from;
      if (map.admin_notification_email) adminEmail = map.admin_notification_email;
      else if (map.email) adminEmail = map.email;
    } catch (e) {
      // ignore db error
    }
  }

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, secure, user, pass, from, adminEmail };
}

function createTransporter(config: MailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

// --------------------------------------------------------------------------
// 1. QUOTE REQUEST EMAILS (Client Confirmation + Admin Alert)
// --------------------------------------------------------------------------
export async function sendQuoteEmails(quote: {
  id: number | string;
  full_name: string;
  business_name: string;
  phone: string;
  email: string;
  location?: string | null;
  camera_count?: number;
  package_name?: string;
  message?: string | null;
}) {
  const config = await getMailConfig();
  if (!config) {
    console.log('[SMTP Mailer] SMTP not configured. Skipping email dispatch.');
    return false;
  }

  const transporter = createTransporter(config);

  // A. Admin Alert Email
  const adminHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #060E1E; color: #F1F5F9; border-radius: 16px; overflow: hidden; border: 1px solid #1E3A8A;">
    <div style="background: linear-gradient(135deg, #0756C9 0%, #087BFF 50%, #00D2FF 100%); padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 1px;">SENTROVA</h1>
      <p style="color: #E0F2FE; margin: 6px 0 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase;">New Commercial Quote Request #${quote.id}</p>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 15px; line-height: 1.6; color: #CBD5E1;">A new commercial surveillance quote inquiry has been submitted via the Sentrova website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr style="border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
          <td style="padding: 10px 0; color: #94A3B8; font-weight: bold; width: 35%;">Contact Name:</td>
          <td style="padding: 10px 0; color: #FFFFFF; font-weight: bold;">${quote.full_name}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
          <td style="padding: 10px 0; color: #94A3B8; font-weight: bold;">Business / Facility:</td>
          <td style="padding: 10px 0; color: #00D2FF; font-weight: bold;">${quote.business_name}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
          <td style="padding: 10px 0; color: #94A3B8; font-weight: bold;">Phone Number:</td>
          <td style="padding: 10px 0; color: #FFFFFF;"><a href="tel:${quote.phone}" style="color: #38BDF8; text-decoration: none;">${quote.phone}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
          <td style="padding: 10px 0; color: #94A3B8; font-weight: bold;">Email Address:</td>
          <td style="padding: 10px 0; color: #FFFFFF;"><a href="mailto:${quote.email}" style="color: #38BDF8; text-decoration: none;">${quote.email}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
          <td style="padding: 10px 0; color: #94A3B8; font-weight: bold;">Premises Location:</td>
          <td style="padding: 10px 0; color: #FFFFFF;">${quote.location || 'Not specified'}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
          <td style="padding: 10px 0; color: #94A3B8; font-weight: bold;">Estimated Cameras:</td>
          <td style="padding: 10px 0; color: #10B981; font-weight: bold;">${quote.camera_count || 1} Cameras</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
          <td style="padding: 10px 0; color: #94A3B8; font-weight: bold;">Package Interest:</td>
          <td style="padding: 10px 0; color: #F59E0B; font-weight: bold;">${quote.package_name || 'General Quote'}</td>
        </tr>
        ${quote.message ? `
        <tr>
          <td style="padding: 10px 0; color: #94A3B8; font-weight: bold; vertical-align: top;">Client Notes:</td>
          <td style="padding: 10px 0; color: #E2E8F0; line-height: 1.5;">${quote.message}</td>
        </tr>` : ''}
      </table>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://api.whatsapp.com/send?phone=${quote.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; margin-right: 8px;">WhatsApp Client</a>
        <a href="mailto:${quote.email}" style="display: inline-block; padding: 12px 24px; background-color: #087BFF; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px;">Reply via Email</a>
      </div>
    </div>
    <div style="background-color: #040A17; padding: 14px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #1E293B;">
      Sentrova UK 24/7 CCTV Operations Control Center • Confidential Security Dispatch
    </div>
  </div>`;

  // B. Client Confirmation Email
  const clientHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #060E1E; color: #F1F5F9; border-radius: 16px; overflow: hidden; border: 1px solid rgba(56, 189, 248, 0.2);">
    <div style="background: linear-gradient(135deg, #0756C9 0%, #087BFF 50%, #00D2FF 100%); padding: 28px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">SENTROVA</h1>
      <p style="color: #E0F2FE; margin: 6px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Professional UK CCTV Operations</p>
    </div>
    <div style="padding: 28px 24px;">
      <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Thank you, ${quote.full_name}!</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #CBD5E1;">
        We have received your request for 24/7 active CCTV surveillance monitoring for <strong>${quote.business_name}</strong>.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #CBD5E1;">
        Our UK surveillance operations desk is reviewing your requirements (${quote.camera_count || 1} cameras). A senior security operations specialist will reach out within <strong>30 minutes</strong> during active business hours.
      </p>

      <div style="background-color: #0A162D; border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 18px; margin: 24px 0;">
        <h3 style="color: #38BDF8; font-size: 13px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Summary of Your Inquiry</h3>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #94A3B8; line-height: 1.8;">
          <li>Business: <strong style="color: #FFFFFF;">${quote.business_name}</strong></li>
          <li>Scope: <strong style="color: #FFFFFF;">${quote.camera_count || 1} CCTV Feeds</strong></li>
          <li>Location: <strong style="color: #FFFFFF;">${quote.location || 'UK'}</strong></li>
          <li>Hardware Requirement: <strong style="color: #10B981;">100% Compatible with your existing cameras</strong></li>
        </ul>
      </div>

      <p style="font-size: 13px; color: #94A3B8; line-height: 1.6;">
        Need immediate consultation? Contact our operations desk directly:
      </p>
      <div style="margin: 15px 0;">
        <p style="margin: 4px 0; font-size: 13px;"><strong style="color: #38BDF8;">Direct Desk:</strong> <a href="tel:+447742476163" style="color: #FFFFFF; text-decoration: none;">+44 7742 476163</a></p>
        <p style="margin: 4px 0; font-size: 13px;"><strong style="color: #10B981;">WhatsApp:</strong> <a href="https://api.whatsapp.com/send?phone=447448871603" style="color: #FFFFFF; text-decoration: none;">+44 7448 871603</a></p>
      </div>
    </div>
    <div style="background-color: #040A17; padding: 16px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid rgba(56, 189, 248, 0.1);">
      © 2026 SENTROVA. 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.<br/>
      UK Certified Remote Surveillance • GDPR Compliant
    </div>
  </div>`;

  try {
    // Send admin notification
    await transporter.sendMail({
      from: config.from,
      to: config.adminEmail,
      subject: `🚨 [New Quote Request] ${quote.business_name} (${quote.full_name})`,
      html: adminHtml,
    });

    // Send client acknowledgment
    await transporter.sendMail({
      from: config.from,
      to: quote.email,
      subject: `Your Sentrova CCTV Surveillance Proposal [Inquiry #${quote.id}]`,
      html: clientHtml,
    });

    console.log(`[SMTP Mailer] Quote emails dispatched successfully for quote #${quote.id}`);
    return true;
  } catch (err: any) {
    console.error('[SMTP Mailer] Error sending quote emails:', err?.message || err);
    return false;
  }
}

// --------------------------------------------------------------------------
// 2. NEWSLETTER SUBSCRIPTION EMAILS (Welcome + Admin Alert)
// --------------------------------------------------------------------------
export async function sendNewsletterEmails(subscriberEmail: string) {
  const config = await getMailConfig();
  if (!config) {
    console.log('[SMTP Mailer] SMTP not configured. Skipping email dispatch.');
    return false;
  }

  const transporter = createTransporter(config);

  // A. Admin Alert
  const adminHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background-color: #060E1E; color: #F1F5F9; border-radius: 12px; padding: 24px; border: 1px solid #1E3A8A;">
    <h2 style="color: #00D2FF; margin-top: 0;">📰 New Newsletter Subscriber</h2>
    <p style="color: #CBD5E1; font-size: 14px;">A new lead has subscribed to the Sentrova Surveillance Intelligence Dispatch:</p>
    <div style="background-color: #0A162D; padding: 14px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3); margin: 16px 0;">
      <p style="margin: 0; font-size: 15px; font-weight: bold; color: #FFFFFF;">${subscriberEmail}</p>
    </div>
    <p style="font-size: 12px; color: #64748B;">Captured via footer newsletter form at ${new Date().toLocaleString()}</p>
  </div>`;

  // B. Subscriber Welcome Email
  const subscriberHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #060E1E; color: #F1F5F9; border-radius: 16px; overflow: hidden; border: 1px solid rgba(56, 189, 248, 0.2);">
    <div style="background: linear-gradient(135deg, #0756C9 0%, #087BFF 50%, #00D2FF 100%); padding: 28px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">SENTROVA</h1>
      <p style="color: #E0F2FE; margin: 6px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Surveillance Intelligence Briefing</p>
    </div>
    <div style="padding: 28px 24px;">
      <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Welcome to Sentrova Executive Security Briefings!</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #CBD5E1;">
        You have been successfully added to our monthly intelligence dispatch list.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #CBD5E1;">
        On the 1st of every month, you will receive our retail & commercial crime trends report, featuring:
      </p>
      <ul style="font-size: 13px; line-height: 1.8; color: #94A3B8; padding-left: 20px;">
        <li><strong style="color: #FFFFFF;">Real Deterrence Case Studies:</strong> Live voice-down talk deterrence breakdowns.</li>
        <li><strong style="color: #FFFFFF;">Retail Theft Patterns:</strong> Organized shoplifting hotspots across the UK.</li>
        <li><strong style="color: #FFFFFF;">Compliance Audits:</strong> Remote CCTV protocols for insurance validation.</li>
      </ul>
      <div style="background-color: #0A162D; border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 18px; margin: 24px 0; text-align: center;">
        <p style="color: #00D2FF; font-weight: bold; margin: 0 0 6px 0; font-size: 14px;">Looking to evaluate 24/7 CCTV surveillance?</p>
        <p style="color: #94A3B8; font-size: 12px; margin: 0 0 14px 0;">We connect to your existing CCTV without replacing cameras, starting at £1.99/hr.</p>
        <a href="https://sentrova.co.uk/pricing" style="display: inline-block; padding: 10px 20px; background-color: #087BFF; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 13px;">View Hourly Plans</a>
      </div>
    </div>
    <div style="background-color: #040A17; padding: 16px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid rgba(56, 189, 248, 0.1);">
      © 2026 SENTROVA. London, UK • Zero Spam • You can unsubscribe anytime by replying to this email.
    </div>
  </div>`;

  try {
    // Send admin notification
    await transporter.sendMail({
      from: config.from,
      to: config.adminEmail,
      subject: `📰 [Newsletter Subscriber] ${subscriberEmail}`,
      html: adminHtml,
    });

    // Send subscriber welcome
    await transporter.sendMail({
      from: config.from,
      to: subscriberEmail,
      subject: 'Welcome to Sentrova Surveillance Intelligence Dispatch',
      html: subscriberHtml,
    });

    console.log(`[SMTP Mailer] Newsletter welcome email sent to ${subscriberEmail}`);
    return true;
  } catch (err: any) {
    console.error('[SMTP Mailer] Error sending newsletter email:', err?.message || err);
    return false;
  }
}

// --------------------------------------------------------------------------
// 3. CONTACT DESK MESSAGE EMAILS
// --------------------------------------------------------------------------
export async function sendContactEmails(contact: {
  id: number | string;
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const config = await getMailConfig();
  if (!config) {
    return false;
  }

  const transporter = createTransporter(config);

  const adminHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #060E1E; color: #F1F5F9; border-radius: 16px; padding: 24px; border: 1px solid #1E3A8A;">
    <h2 style="color: #00D2FF; margin-top: 0;">💬 New Contact Desk Message</h2>
    <p><strong>From:</strong> ${contact.full_name} (<a href="mailto:${contact.email}" style="color: #38BDF8;">${contact.email}</a>)</p>
    ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
    <p><strong>Subject:</strong> ${contact.subject}</p>
    <div style="background-color: #0A162D; padding: 14px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.25); margin: 16px 0;">
      <p style="margin: 0; white-space: pre-wrap; font-size: 13px; line-height: 1.6; color: #E2E8F0;">${contact.message}</p>
    </div>
  </div>`;

  try {
    await transporter.sendMail({
      from: config.from,
      to: config.adminEmail,
      subject: `💬 [Contact Desk] ${contact.subject} - ${contact.full_name}`,
      html: adminHtml,
    });
    return true;
  } catch (err: any) {
    console.error('[SMTP Mailer] Error sending contact email:', err?.message || err);
    return false;
  }
}

// --------------------------------------------------------------------------
// 4. TEST EMAIL UTILITY
// --------------------------------------------------------------------------
export async function sendTestEmail(targetEmail: string): Promise<{ success: boolean; message: string }> {
  const config = await getMailConfig();
  if (!config) {
    return {
      success: false,
      message: 'SMTP is not configured. Please fill in SMTP Host, Port, User and Password in Settings.',
    };
  }

  try {
    const transporter = createTransporter(config);
    await transporter.verify();
    await transporter.sendMail({
      from: config.from,
      to: targetEmail,
      subject: '✅ SENTROVA SMTP Configuration Test - Verified',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #060E1E; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #10B981; margin-top: 0;">SMTP Test Successful!</h2>
          <p>Your Sentrova surveillance email dispatch system is correctly configured and working.</p>
          <p style="font-size: 12px; color: #94A3B8;">Sent from server at ${new Date().toISOString()}</p>
        </div>
      `,
    });
    return { success: true, message: `Test email successfully sent to ${targetEmail}` };
  } catch (err: any) {
    return { success: false, message: `SMTP test failed: ${err.message || err}` };
  }
}
