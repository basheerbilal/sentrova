-- ==========================================================
-- SENTROVA CCTV MONITORING - SEED DATA
-- Default super admin password is: Sentrova2026!
-- ==========================================================


-- 1. SEED DEFAULT SUPER ADMIN
-- Default Password: Sentrova2026!
INSERT INTO `admins` (`id`, `name`, `email`, `password_hash`, `role`, `status`) VALUES
(1, 'Super Administrator', 'admin@sentrova.co.uk', '$2y$10$loBIRdDuhNbFNhidnDnBVOCmqIVO0AbJtHXGxWH/zDEt7.VMcTWsO', 'super_admin', 'active');

-- 2. SEED PACKAGES
INSERT INTO `packages` (`id`, `name`, `slug`, `subtitle`, `price`, `currency`, `billing_unit`, `description`, `popular`, `sort_order`, `status`) VALUES
(1, 'ESSENTIAL', 'essential', 'Customer Theft Monitoring', 1.99, '$', '/HR', 'Dedicated customer-facing surveillance to identify concealment and deter shoplifting in real-time.', 0, 1, 'active'),
(2, 'GROWTH', 'growth', 'Customer + Staff Monitoring', 2.99, '$', '/HR', 'Comprehensive sales-floor and cashier register audit surveillance to eliminate internal shrinkage.', 1, 2, 'active'),
(3, 'ULTIMATE', 'ultimate', 'Complete Store Monitoring', 5.99, '$', '/HR', '360° total facility security with nocturnal perimeter coverage, emergency voice-down deterrence, and daily reports.', 0, 3, 'active');

-- 3. SEED PACKAGE FEATURES
-- Essential Features
INSERT INTO `package_features` (`package_id`, `feature`, `sort_order`) VALUES
(1, 'Store Theft Detection', 1),
(1, 'Shoplifting Monitoring', 2),
(1, 'Suspicious Customer Activity', 3),
(1, 'Theft Incident Identification', 4),
(1, 'High-Risk Behaviour Monitoring', 5),
(1, 'Real-Time CCTV Monitoring', 6),
(1, 'Instant Theft Alerts', 7),
(1, 'Theft Activity Reporting', 8);

-- Growth Features
INSERT INTO `package_features` (`package_id`, `feature`, `sort_order`) VALUES
(2, 'Full Staff Monitoring', 1),
(2, 'Cashier Activity Monitoring', 2),
(2, 'Staff Movement Monitoring', 3),
(2, 'Suspicious Staff Behaviour', 4),
(2, 'Unauthorized Staff Activity', 5),
(2, 'Customer & Staff Interaction Monitoring', 6),
(2, 'Unusual Activity Detection', 7),
(2, 'Workplace Activity Monitoring', 8),
(2, 'Incident Identification & Reporting', 9);

-- Ultimate Features
INSERT INTO `package_features` (`package_id`, `feature`, `sort_order`) VALUES
(3, 'Store Activity Monitoring', 1),
(3, 'Opening & Closing Activity', 2),
(3, 'Unauthorized Access Monitoring', 3),
(3, 'Restricted Area Activity', 4),
(3, 'After-Hours Activity Monitoring', 5),
(3, 'Customer & Staff Behaviour Monitoring', 6),
(3, 'Unusual Incident Detection', 7),
(3, 'Real-Time Incident Monitoring', 8),
(3, 'Detailed Incident Reporting', 9),
(3, 'Daily Monitoring Summary', 10);

-- 4. SEED SERVICES
INSERT INTO `services` (`id`, `slug`, `title`, `short_description`, `description`, `icon`, `sort_order`, `status`) VALUES
(1, 'customer-theft', 'Customer Theft Monitoring', 'Active visual tracking of sales floor activity to identify concealment, tag tampering, and unpaid items.', 'Our proactive operators monitor high-shrink merchandise aisles, fitting room peripheries, and blind spots to pinpoint theft as it occurs, triggering instant discrete floor-manager notifications.', 'ShieldAlert', 1, 'active'),
(2, 'shoplifting', 'Shoplifting Monitoring', 'Targeted surveillance over high-value goods, alcohol shelves, electronics, and cosmetics displays.', 'Dedicated focus on premium merchandise zones to identify organized retail crime (ORC), bulk sweeping, and booster bag use before suspects exit premises.', 'Eye', 2, 'active'),
(3, 'staff-monitoring', 'Staff Monitoring', 'Supervision of cash registers, returns desks, and stock storage to deter internal shrinkage.', 'Rigorous till transaction oversight, sweethearting detection, manual discount verification, and stockroom loading dock supervision.', 'Users', 3, 'active'),
(4, 'suspicious-behaviour', 'Suspicious Behaviour Detection', 'Early warning indicators for loitering, scouting, aggressive posture, or unusual dwell times.', 'Experienced operators recognize pre-theft behavioral cues, giving your on-site security or management a critical 3-5 minute early warning advantage.', 'AlertTriangle', 4, 'active'),
(5, 'unauthorized-access', 'Unauthorized Access Monitoring', 'Perimeter, loading bay, fire exit, and back-office surveillance against unauthorized entry.', 'Real-time detection of perimeter breaches, propped fire exit doors, and restricted area trespassers backed by instant live 2-way audio voice-down broadcast.', 'Lock', 5, 'active'),
(6, 'after-hours', 'After-Hours Monitoring', 'Vigilant nocturnal surveillance when your premises are locked, dark, and empty.', 'Comprehensive night-watch protection with thermal verification, optical zoom tracking, and immediate emergency keyholder & police dispatch.', 'Moon', 6, 'active'),
(7, 'real-time-incident', 'Real-Time Incident Monitoring', 'Live, dynamic operator intervention during active emergencies, disturbances, or safety hazards.', 'Direct 24/7 operator intervention to guide emergency responders with real-time suspect descriptions and tactical location relays.', 'Radio', 7, 'active'),
(8, 'incident-reporting', 'Incident Reporting', 'Structured, court-admissible dossiers complete with HD video clips, timestamps, and operator notes.', 'Every verified incident is recorded with cryptographically hashed timestamps and police-ready evidentiary packs delivered in under 15 minutes.', 'FileText', 8, 'active');

-- 5. SEED INDUSTRIES
INSERT INTO `industries` (`id`, `name`, `slug`, `description`, `icon`, `sort_order`, `status`) VALUES
(1, 'Retail Stores', 'retail-stores', 'High-shrink boutiques, fashion apparel, consumer electronics, and footwear chains.', 'ShoppingBag', 1, 'active'),
(2, 'Supermarkets', 'supermarkets', 'High-footfall grocery stores, produce markets, and liquor departments.', 'Store', 2, 'active'),
(3, 'Convenience Stores', 'convenience-stores', 'Corner shops and express food marts vulnerable to rapid snatch-and-grab theft.', 'Clock', 3, 'active'),
(4, 'Warehouses', 'warehouses', 'Large-format logistics depots, pallet bays, and distribution centers.', 'Boxes', 4, 'active'),
(5, 'Offices', 'offices', 'Corporate headquarters, shared co-working spaces, and IT infrastructure rooms.', 'Building2', 5, 'active'),
(6, 'Restaurants', 'restaurants', 'Bars, cafes, fine dining establishments, and quick-service restaurant points.', 'UtensilsCrossed', 6, 'active'),
(7, 'Commercial Properties', 'commercial-properties', 'Multi-tenant commercial business parks, trade counters, and showrooms.', 'Building', 7, 'active'),
(8, 'Workshops', 'workshops', 'Vehicle service bays, industrial fabrication yards, and tool storage facilities.', 'Wrench', 8, 'active'),
(9, 'Construction Sites', 'construction-sites', 'Plant equipment yards, raw material stores, and high-risk construction developments.', 'HardHat', 9, 'active');

-- 6. SEED FAQ
INSERT INTO `faq` (`id`, `question`, `answer`, `sort_order`, `status`) VALUES
(1, 'Do I need to purchase new CCTV cameras or hardware to use Sentrova?', 'No. Sentrova connects directly to 99% of existing CCTV systems, including Hikvision, Dahua, Axis, Hanwha/Samsung, Uniview, Reolink, and any RTSP/ONVIF compatible NVR/DVR. We establish a secure encrypted tunnel without requiring costly camera replacements.', 1, 'active'),
(2, 'How quickly does Sentrova alert our staff when suspicious activity is detected?', 'Our monitoring center operates on a strict sub-30-second escalation standard. When concealment or unauthorized activity is detected, our operator immediately contacts your on-duty floor manager via dedicated WhatsApp dispatch or phone call with precise details.', 2, 'active'),
(3, 'Are there long-term lock-in contracts?', 'None whatsoever. Sentrova offers transparent, flexible pricing starting at $1.99 / active monitoring hour. You only pay for the scheduled monitoring hours you book, whether that is peak shopping hours, nights, or weekends.', 3, 'active'),
(4, 'How does the two-way live voice deterrence work?', 'If your facility has network IP speakers or audio-enabled cameras, our operators can broadcast live voice-downs directly into the zone (e.g., "Attention: You are under live remote video surveillance. Please step away from the merchandise"). This stops over 94% of incidents without confrontation.', 4, 'active'),
(5, 'Can you provide video evidence for police reports and insurance claims?', 'Yes. Every verified incident generates a court-admissible evidentiary dossier complete with multi-angle HD video exports, millisecond timestamps, operator chronology notes, and suspect descriptions within 15 minutes of occurrence.', 5, 'active');

-- 7. SEED TESTIMONIALS
INSERT INTO `testimonials` (`id`, `customer_name`, `company_name`, `designation`, `content`, `rating`, `sort_order`, `status`) VALUES
(1, 'Marcus Vance', 'Vance Superstores Ltd', 'Managing Director', 'Within the first 3 weeks of connecting our 14 stores to Sentrova, inventory shrinkage dropped by 78%. Their operators intervened during 6 active shoplifting attempts before merchandise could leave the doorway.', 5, 1, 'active'),
(2, 'Helena Berg', 'Nordic Apparel & Retail', 'Operations Director', 'The $2.99/hr Growth package paid for itself in days. Having dedicated eyes on till transactions and rear stockroom entries eliminated sweethearting and unauthorized access completely.', 5, 2, 'active'),
(3, 'David O\'Connor', 'Apex Logistics & Freight', 'Head of Facility Security', 'We use the Ultimate package for overnight yard monitoring. When two trespassers cut our perimeter wire at 2:30 AM, Sentrova used the live audio voice-down and police were on site in 8 minutes. Outstanding professionalism.', 5, 3, 'active');

-- 8. SEED SITE SETTINGS
INSERT INTO `site_settings` (`key_name`, `key_value`, `field_group`, `description`) VALUES
('company_name', 'SENTROVA Surveillance', 'general', 'Company brand name'),
('phone', '+44 7742 476163', 'contact', '24/7 Operations Desk Phone'),
('whatsapp', '+44 7448 871603', 'contact', 'Dedicated WhatsApp Support Line'),
('email', 'monitoring@sentrova.co.uk', 'contact', 'Operations Inquiries Email'),
('address', '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom', 'contact', 'Registered UK Headquarters'),
('hero_title', 'Real-Time Remote CCTV Monitoring for UK Retail & Business', 'content', 'Primary homepage headline'),
('hero_description', 'Human-verified active surveillance starting at $1.99 / hour. We deter shoplifting, till theft, and unauthorized intrusion before damage occurs.', 'content', 'Primary homepage description'),
('meta_title', 'SENTROVA | Active 24/7 Remote CCTV Monitoring & Retail Deterrence', 'seo', 'Default SEO Meta Title'),
('meta_description', 'Professional remote CCTV monitoring from $1.99/hr. Live operator surveillance, instant theft deterrence, and zero lock-in contracts.', 'seo', 'Default SEO Meta Description'),
('whatsapp_message', 'Hello SENTROVA, I would like to know more about your CCTV monitoring services.', 'contact', 'Default WhatsApp click message'),
('facebook_url', 'https://facebook.com/sentrova', 'social', 'Facebook Page URL'),
('instagram_url', 'https://instagram.com/sentrova', 'social', 'Instagram Profile URL'),
('linkedin_url', 'https://linkedin.com/company/sentrova', 'social', 'LinkedIn Profile URL');

-- 9. SEED INITIAL LOG
INSERT INTO `admin_activity_logs` (`id`, `admin_id`, `action`, `entity`, `entity_id`, `details`, `ip_address`) VALUES
(1, 1, 'system_init', 'system', '1', 'Sentrova MySQL 8.0 Production Database Schema Seeded', '127.0.0.1');
