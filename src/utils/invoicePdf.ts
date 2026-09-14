import { jsPDF } from 'jspdf';
import { ApiPaymentOrder } from '../types';

export function generateInvoicePdf(order: ApiPaymentOrder): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryNavy = [11, 18, 32] as const; // #0B1220
  const brandBlue = [8, 123, 255] as const; // #087BFF
  const darkBlue = [7, 86, 201] as const; // #0756C9
  const textDark = [30, 41, 59] as const; // slate-800
  const textMuted = [100, 116, 139] as const; // slate-500
  const bgLight = [248, 250, 252] as const; // slate-50
  const borderLight = [226, 232, 240] as const; // slate-200
  const successGreen = [16, 185, 129] as const; // emerald-500

  // 1. Top Decorative Brand Bar
  doc.setFillColor(...brandBlue);
  doc.rect(0, 0, pageWidth, 5, 'F');

  let y = 18;

  // 2. Company Header & Invoice Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...primaryNavy);
  doc.text('SENTROVA SURVEILLANCE', margin, y);

  // Status Badge on Right
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(...successGreen);
  doc.roundedRect(pageWidth - margin - 42, y - 6, 42, 9, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(5, 150, 105);
  doc.text('PAID IN FULL', pageWidth - margin - 21, y, { align: 'center' });

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textMuted);
  doc.text('Commercial Remote CCTV Operations & Voice Deterrence', margin, y);

  y += 4;
  doc.text('24/7 Operations Desk: +44 7742 476163 | billing@sentrova.co.uk', margin, y);

  y += 8;
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;

  // 3. Invoice Metadata & Billing Grid (2 Columns)
  const colWidth = (contentWidth - 10) / 2;

  // Left Box: Billed Client
  doc.setFillColor(...bgLight);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(margin, y, colWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...brandBlue);
  doc.text('BILLED TO (COMMERCIAL CLIENT)', margin + 5, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryNavy);
  doc.text(order.company_name || 'Commercial Client', margin + 5, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  doc.text(`Attn: ${order.contact_name}`, margin + 5, y + 19);
  doc.text(order.email, margin + 5, y + 24);
  doc.text(order.phone, margin + 5, y + 29);
  if (order.location) {
    const locText = doc.splitTextToSize(`Premise: ${order.location}`, colWidth - 10);
    doc.text(locText, margin + 5, y + 34);
  }

  // Right Box: Tax Invoice Meta
  const rightX = margin + colWidth + 10;
  doc.setFillColor(...bgLight);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(rightX, y, colWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...brandBlue);
  doc.text('INVOICE SPECIFICATIONS', rightX + 5, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryNavy);
  doc.text(order.invoice_number || 'INV-STV-2026', rightX + 5, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  doc.text(`Invoice Date: ${new Date(order.created_at || Date.now()).toLocaleDateString('en-GB')}`, rightX + 5, y + 19);
  doc.text(`Transaction ID: ${order.transaction_id || 'TXN-STV'}`, rightX + 5, y + 24);
  doc.text(`Connected Feeds: ${order.camera_count} CCTV Cameras`, rightX + 5, y + 29);
  doc.text(`Activation Schedule: ${order.setup_date || 'Within 24 Hours'}`, rightX + 5, y + 34);

  y += 50;

  // 4. Line Items Table
  // Header Row
  doc.setFillColor(...primaryNavy);
  doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION', margin + 5, y + 5.5);
  doc.text('HOURS', margin + 95, y + 5.5, { align: 'right' });
  doc.text('RATE (USD)', margin + 128, y + 5.5, { align: 'right' });
  doc.text('AMOUNT', pageWidth - margin - 5, y + 5.5, { align: 'right' });

  y += 8;

  // Row Content
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderLight);
  doc.rect(margin, y, contentWidth, 22, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryNavy);
  doc.text(order.package_name || `${order.package_slug?.toUpperCase()} Surveillance Retainer`, margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  const desc1 = 'Continuous human operator surveillance, rapid audio talkdown deterrence,';
  const desc2 = 'unauthorized intrusion alerts, till audits, and tamper-evident shift logs.';
  doc.text(desc1, margin + 5, y + 11.5);
  doc.text(desc2, margin + 5, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.text(`${order.hours_purchased} hrs`, margin + 95, y + 10, { align: 'right' });
  doc.text(`$${Number(order.hourly_rate).toFixed(2)}/hr`, margin + 128, y + 10, { align: 'right' });
  doc.text(`$${Number(order.subtotal).toFixed(2)}`, pageWidth - margin - 5, y + 10, { align: 'right' });

  y += 22;

  // 5. Financial Summary Calculation Box
  const summaryWidth = 85;
  const summaryX = pageWidth - margin - summaryWidth;

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  doc.text('Subtotal:', summaryX, y + 4);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${Number(order.subtotal).toFixed(2)}`, pageWidth - margin - 5, y + 4, { align: 'right' });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('VAT / Sales Tax (0% Reverse Charge B2B):', summaryX, y + 4);
  doc.setFont('helvetica', 'bold');
  doc.text('$0.00', pageWidth - margin - 5, y + 4, { align: 'right' });

  y += 7;
  doc.setFillColor(...bgLight);
  doc.setDrawColor(...brandBlue);
  doc.setLineWidth(0.8);
  doc.roundedRect(summaryX - 4, y, summaryWidth + 4, 11, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryNavy);
  doc.text('Total Paid in Full:', summaryX, y + 7.5);

  doc.setFontSize(11);
  doc.setTextColor(...brandBlue);
  doc.text(`$${Number(order.total_amount).toFixed(2)} USD`, pageWidth - margin - 5, y + 7.5, { align: 'right' });

  y += 18;

  // 6. Payment & Security Clearance
  doc.setFillColor(240, 246, 255); // blue-50
  doc.setDrawColor(186, 219, 254);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...darkBlue);
  const cardInfo = order.card_last4
    ? `Card Method: ${order.card_brand || 'Card'} ending in •••• ${order.card_last4}`
    : `Payment Gateway: Stripe 256-Bit SSL Encrypted`;
  doc.text(cardInfo, margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textDark);
  doc.text('Payment cleared and authenticated via Stripe Merchant Gateway. 0% VAT reverse charge for commercial security.', margin + 5, y + 11.5);

  y += 22;

  // 7. Operational SLA & Onboarding Instructions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...primaryNavy);
  doc.text('OPERATIONAL SERVICE LEVEL AGREEMENT (SLA) & ONBOARDING', margin, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  const termsText = [
    '1. Feed Verification: Our UK Network Security Engineer will contact your designated site manager within 24 hours to integrate RTSP/NVR feeds.',
    '2. Retainer Rollover: Purchased surveillance hours never expire and roll over indefinitely until consumed by scheduled shifts.',
    '3. Voice Deterrence: Live operators are authorized to issue targeted verbal warnings over store speakers upon detecting unauthorized activity.',
    '4. Evidentiary Dossiers: Complete time-stamped video evidence and incident reports are delivered for any suspicious event.',
  ];

  termsText.forEach((line) => {
    doc.text(line, margin, y);
    y += 4;
  });

  // 8. Footer (at bottom of page)
  const footerY = pageHeight - 14;
  doc.setDrawColor(...borderLight);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...primaryNavy);
  doc.text('SENTROVA SURVEILLANCE LTD', margin, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textMuted);
  doc.text('| London, United Kingdom | Company Registered in England & Wales | sentrova.co.uk', margin + 45, footerY);

  doc.setFont('helvetica', 'bold');
  doc.text(`Page 1 of 1`, pageWidth - margin, footerY, { align: 'right' });

  // Download PDF
  const safeFilename = `Invoice-${order.invoice_number || 'SENTROVA'}.pdf`;
  doc.save(safeFilename);
}
