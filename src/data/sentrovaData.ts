import { MonitoringPackage, ServiceItem, IndustryItem, HowItWorksStep, TestimonialItem, FaqItem } from '../types';

export const SENTROVA_CONTACT = {
  phone: '+44 7742 476163',
  phoneDisplay: '+44 7742 476163',
  whatsapp: '+44 7448 871603',
  whatsappDisplay: '+44 7448 871603',
  whatsappLink: 'https://wa.me/447448871603',
  email: 'monitoring@sentrova.co.uk',
  address: 'Commercial Surveillance Operations, United Kingdom',
  operatingHours: '24/7/365 Continuous Live Surveillance',
};

export const PACKAGES: MonitoringPackage[] = [
  {
    id: 'essential',
    name: 'ESSENTIAL',
    price: '$1.99',
    unit: '/ HR',
    tagline: 'Customer Theft Monitoring',
    description: 'Designed for small retail stores, convenience stores, and high-footfall entrances needing focused loss-prevention surveillance.',
    bestFor: 'Independent convenience stores, newsagents, boutiques, and single-door retail.',
    features: [
      'Customer Theft Monitoring',
      'Active Shoplifting Deterrence',
      'Instant Phone & WhatsApp Alerts',
      'Daily Shift Summary & Logbook',
      'Full Compatibility with Existing CCTV',
      'Encrypted Digital Video Backup',
      'Real-Time Live Feed Watch During Peak Hours',
    ],
  },
  {
    id: 'growth',
    name: 'GROWTH',
    price: '$2.99',
    unit: '/ HR',
    tagline: 'Customer + Staff Monitoring',
    highlight: true,
    badge: 'MOST POPULAR',
    description: 'Comprehensive store protection covering both customer-facing areas and staff transactions, stockrooms, and cash desks.',
    bestFor: 'Supermarkets, busy convenience stores, apparel stores, and restaurants.',
    features: [
      'All Essential Monitoring Features',
      'Customer + Staff Area Surveillance',
      'Cash Register & POS Transaction Watch',
      'Stockroom & Backdoor Delivery Monitoring',
      'Unauthorized Staff Behavior Detection',
      'Priority Alert Escalation Protocols',
      'Weekly Loss Prevention & Shrinkage Report',
      'Dedicated Shift Surveillance Operator',
    ],
  },
  {
    id: 'ultimate',
    name: 'ULTIMATE',
    price: '$5.99',
    unit: '/ HR',
    tagline: 'Complete Store Monitoring',
    description: 'Enterprise-grade end-to-end video surveillance ensuring 360° coverage of your entire commercial property, day and night.',
    bestFor: 'Large supermarkets, commercial warehouses, multi-branch stores, and logistics depots.',
    features: [
      'All Growth Monitoring Features',
      'Complete Store & Perimeter Surveillance',
      'After-Hours Intrusion & Perimeter Tripwire Watch',
      'Multi-Angle Blindspot & Corridor Surveillance',
      'Direct Emergency Services / Keyholder Dispatch',
      'Police-Ready High-Definition Incident Dossiers',
      'Dedicated Senior Operations Specialist',
      'Custom Standard Operating Procedures (SOP)',
      'Unlimited High-Priority Incident Reviews',
    ],
  },
];

export const PACKAGE_COMPARISON = [
  {
    feature: 'Continuous Real-Time Watch',
    essential: 'Customer Floor',
    growth: 'Floor + Backroom + Till',
    ultimate: '360° Total Facility',
  },
  {
    feature: 'Customer Shoplifting Monitoring',
    essential: true,
    growth: true,
    ultimate: true,
  },
  {
    feature: 'Cash Register & POS Surveillance',
    essential: false,
    growth: true,
    ultimate: true,
  },
  {
    feature: 'Staff Procedure & Stockroom Watch',
    essential: false,
    growth: true,
    ultimate: true,
  },
  {
    feature: 'After-Hours Perimeter Protection',
    essential: false,
    growth: 'Optional Add-on',
    ultimate: true,
  },
  {
    feature: 'Incident Notification Response Time',
    essential: '< 3 Minutes',
    growth: '< 60 Seconds',
    ultimate: '< 30 Seconds (Instant)',
  },
  {
    feature: 'Police-Ready Evidentiary Reports',
    essential: 'Standard Summary',
    growth: 'Detailed Video Clip Dossier',
    ultimate: 'Certified Forensic Dossier',
  },
  {
    feature: 'Compatible with Existing Cameras',
    essential: true,
    growth: true,
    ultimate: true,
  },
  {
    feature: 'Dedicated Surveillance Operator',
    essential: 'Shared Queue',
    growth: 'Dedicated Regional Team',
    ultimate: 'Dedicated Senior Specialist',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'customer-theft',
    title: 'Customer Theft Monitoring',
    shortDesc: 'Active visual tracking of sales floor activity to identify concealment, tag tampering, and unpaid items.',
    fullDesc: 'Our UK-trained remote operators watch aisles, display tables, and merchandise corners in real time, alerting floor staff before perpetrators leave the premises.',
    icon: 'ShieldAlert',
    benefits: ['Immediate suspect tagging', 'Aisle-by-aisle surveillance', 'Reduces shop floor stock loss by up to 74%'],
  },
  {
    id: 'shoplifting',
    title: 'Shoplifting Monitoring',
    shortDesc: 'Targeted surveillance over high-value goods, alcohol shelves, electronics, and cosmetics displays.',
    fullDesc: 'Dedicated surveillance algorithms paired with human verification detect telltale concealment methods, repeated sweeps, and suspicious group maneuvers.',
    icon: 'Eye',
    benefits: ['Focus on repeat offenders', 'High-shrink item coverage', 'Clear evidentiary timestamping'],
  },
  {
    id: 'staff-monitoring',
    title: 'Staff Monitoring',
    shortDesc: 'Supervision of cash registers, returns desks, and stock storage to deter internal shrinkage.',
    fullDesc: 'Ensure till policies are respected, refunds and voids are legitimate, and authorized stock handling protocols are maintained across every shift.',
    icon: 'Users',
    benefits: ['Till drawer discrepancy tracking', 'Reduces unauthorized discounting', 'Improves staff accountability'],
  },
  {
    id: 'suspicious-behaviour',
    title: 'Suspicious Behaviour Detection',
    shortDesc: 'Early warning indicators for loitering, scouting, aggressive posture, or unusual dwell times.',
    fullDesc: 'Proactive detection of behavior patterns before crimes occur, enabling calm, preventative de-escalation by on-site managers.',
    icon: 'AlertTriangle',
    benefits: ['Pre-incident warning signals', 'Dwell-time anomaly alerts', 'Protects front-line employees'],
  },
  {
    id: 'unauthorized-access',
    title: 'Unauthorized Access Monitoring',
    shortDesc: 'Perimeter, loading bay, fire exit, and back-office surveillance against unauthorized entry.',
    fullDesc: 'Immediate detection of individuals entering restricted operational areas, back exits, server closets, or perimeter fences.',
    icon: 'Lock',
    benefits: ['Fire door breach alerts', 'Loading bay supervision', 'Delivery verification'],
  },
  {
    id: 'after-hours',
    title: 'After-Hours Monitoring',
    shortDesc: 'Vigilant nocturnal surveillance when your premises are locked, dark, and empty.',
    fullDesc: 'Night-shift remote operators monitor infrared and thermal camera streams, instantly dispatching security patrols or keyholders when trespassers are sighted.',
    icon: 'Moon',
    benefits: ['Complete dark-hours coverage', 'Rapid keyholder dispatch', 'Deters burglary and vandalism'],
  },
  {
    id: 'real-time-incident',
    title: 'Real-Time Incident Monitoring',
    shortDesc: 'Live, dynamic operator intervention during active emergencies, disturbances, or safety hazards.',
    fullDesc: 'When an alert triggers, our operators continuously feed live visual intel to your store management or emergency services until resolved.',
    icon: 'Radio',
    benefits: ['Live audio/visual guidance', 'Zero lag communications', 'Continuous situational tracking'],
  },
  {
    id: 'incident-reporting',
    title: 'Incident Reporting',
    shortDesc: 'Structured, court-admissible dossiers complete with HD video clips, timestamps, and operator notes.',
    fullDesc: 'Receive clear, professionally prepared digital incident reports within minutes of an event, ready for police investigation and insurance claims.',
    icon: 'FileText',
    benefits: ['Court-admissible video exports', 'Standardized timeline breakdown', 'Seamless insurance submission'],
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: '01',
    title: 'CONNECT',
    description: 'Connect your existing CCTV system.',
    details: 'Zero hardware replacement needed. We securely link to your existing DVR, NVR, or IP cameras via encrypted handshake within minutes.',
    icon: 'Network',
  },
  {
    step: '02',
    title: 'MONITOR',
    description: 'Our monitoring team watches the relevant areas.',
    details: 'Professional UK-trained surveillance operators actively watch your designated high-priority zones during business hours and overnight.',
    icon: 'Eye',
  },
  {
    step: '03',
    title: 'DETECT',
    description: 'Suspicious activity is identified.',
    details: 'From subtle shoplifting concealment to perimeter breaches, our operators detect anomalies immediately using visual verification protocols.',
    icon: 'AlertCircle',
  },
  {
    step: '04',
    title: 'RESPOND',
    description: 'You receive the appropriate alert/report.',
    details: 'Immediate voice call, WhatsApp alert, on-site speaker talkdown, keyholder alert, or emergency dispatch followed by a full digital report.',
    icon: 'Send',
  },
];

export const INDUSTRIES: IndustryItem[] = [
  {
    id: 'retail',
    name: 'Retail & Boutiques',
    description: 'Protect high-value fashion, luxury merchandise, cosmetics, and accessories against organized retail theft.',
    keyRisks: ['Customer concealment', 'Fitting room bag sweeps', 'Counter grab-and-runs'],
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    spanClass: 'md:col-span-2 lg:col-span-2',
  },
  {
    id: 'supermarkets',
    name: 'Supermarkets & Grocers',
    description: 'High-density customer traffic monitoring across busy aisles, alcohol zones, self-checkout kiosks, and exits.',
    keyRisks: ['Self-checkout barcode evasion', 'Bulk cart walkouts', 'Stock room leakage'],
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1000&auto=format&fit=crop',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'warehouses',
    name: 'Warehouses & Logistics',
    description: 'Sprawling distribution facilities requiring active gate entry oversight, high-bay inventory watch, and loading dock audits.',
    keyRisks: ['Cargo tampering', 'Unchecked truck bays', 'After-hours fence hopping'],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'offices',
    name: 'Commercial Offices',
    description: 'Securing reception foyers, executive suites, server rooms, and confidential documentation areas.',
    keyRisks: ['Tailgating visitors', 'After-hours unauthorized guests', 'Asset theft'],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
    spanClass: 'md:col-span-2 lg:col-span-2',
  },
  {
    id: 'restaurants',
    name: 'Restaurants & Bars',
    description: 'Cash reconciliation protection, liquor cabinet security, dining floor disturbance mitigation, and kitchen safety checks.',
    keyRisks: ['Cash till discrepancies', 'Dine-and-dash incidents', 'Stockroom alcohol loss'],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'commercial-properties',
    name: 'Commercial Properties',
    description: 'Multi-tenant commercial buildings, shared car parks, utility infrastructure, and entry concourses.',
    keyRisks: ['Vandalism & graffiti', 'Car park loitering', 'Fire exit tampering'],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
    spanClass: 'md:col-span-2 lg:col-span-2',
  },
  {
    id: 'workshops',
    name: 'Workshops & Auto Centers',
    description: 'Protecting expensive tools, customer vehicle fleets, diagnostic equipment, and scrap metal yards.',
    keyRisks: ['Catalytic converter theft', 'Specialist tool pilfering', 'Yard intrusion'],
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1000&auto=format&fit=crop',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'construction',
    name: 'Construction Sites',
    description: 'Compound perimeter watch, heavy plant machinery protection, and copper cable theft deterrence.',
    keyRisks: ['Plant machinery theft', 'Cable & fuel siphoning', 'Hazardous trespassing'],
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?q=80&w=1000&auto=format&fit=crop',
    spanClass: 'md:col-span-2 lg:col-span-2',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'David Harrington',
    role: 'Managing Director',
    company: 'Harrington Retail Group',
    industry: 'High Street Fashion (4 Locations)',
    content: 'Switching to Sentrova transformed our loss prevention. In our first 90 days, shop floor shrinkage dropped by over 68%. The operators catch concealment in real time and quietly notify our store manager before perpetrators step outside.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Sarah Jenkins',
    role: 'Operations Director',
    company: 'Apex Logistics & Storage',
    industry: 'Commercial Warehousing',
    content: 'We used to pay thousands for stationary security guards who spent half the night asleep. Sentrova monitors all 32 cameras across our warehouse 24/7 at a fraction of the cost. The incident reports with HD timestamps are second to none.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Marcus Vance',
    role: 'Proprietor',
    company: 'Metro Food Market',
    industry: 'Supermarket & Convenience',
    content: 'The Growth package pays for itself on day one. Our till shortages disappeared, and the staff know that transactions and deliveries are watched by true professionals. The setup was effortless with our existing Hikvision system.',
    rating: 5,
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is CCTV monitoring?',
    answer: 'CCTV monitoring is a proactive security service where trained remote surveillance specialists continuously watch your live camera feeds from a central operations center. Rather than cameras merely recording crime to be reviewed after the loss has already occurred, our operators identify suspicious activity, shoplifting, and unauthorized access as it happens, allowing immediate intervention and deterrence.',
  },
  {
    id: 'faq-2',
    question: 'Do you monitor existing cameras?',
    answer: 'Yes! You do not need to replace your existing cameras or spend thousands on new infrastructure. Sentrova connects directly to almost all standard commercial CCTV systems, DVRs, NVRs, and IP cameras (including Hikvision, Dahua, Axis, Hanwha, Uniview, Reolink, and ONVIF-compliant hardware) via secure encrypted network gateways.',
  },
  {
    id: 'faq-3',
    question: 'How does remote monitoring work?',
    answer: 'Our technicians establish an encrypted, latency-free feed connection between your camera system and our UK monitoring facility. You define your operating hours, priority zones (such as cash tills, alcohol shelves, or stockroom exits), and custom notification procedures. During monitored hours, our operators actively scan your feeds, log events, and respond instantly to anomalies.',
  },
  {
    id: 'faq-4',
    question: 'What happens when suspicious activity is detected?',
    answer: 'Our operators follow your pre-agreed escalation protocol. Within seconds, we can: (1) Place an immediate phone call to your on-duty floor manager, (2) Send a priority WhatsApp alert with high-resolution still images of the suspect, (3) Broadcast a live voice warning over your store audio system, or (4) Directly contact local police and emergency keyholders if an unauthorized intrusion or burglary occurs.',
  },
  {
    id: 'faq-5',
    question: 'Which package should I choose?',
    answer: 'For independent convenience stores or retail shops primarily battling customer shoplifting, the Essential package ($1.99/hr) is ideal. For busy convenience stores, supermarkets, or restaurants where cash drawers and staff stockrooms also need scrutiny, the Growth package ($2.99/hr) is our most popular tier. For multi-building facilities, warehouses, or large commercial premises needing 360° coverage and overnight perimeter watch, choose Ultimate ($5.99/hr). Packages start from just $99 per month.',
  },
  {
    id: 'faq-6',
    question: 'Can I change packages later?',
    answer: 'Absolutely. Sentrova operates on flexible commercial terms with no lock-in contracts. You can easily upgrade, downgrade, or add seasonal coverage (e.g. extending hours during holiday retail peaks) at any time by speaking with your account manager.',
  },
];

export const WHY_CHOOSE_ITEMS = [
  {
    title: '24/7 Continuous Monitoring',
    description: 'Unbroken day and night vigilance across every designated surveillance camera, eliminating blind spots and fatigue.',
    icon: 'Clock',
  },
  {
    title: 'Real-Time Surveillance',
    description: 'Active human oversight during trading hours to spot shoplifters, concealment, and suspicious maneuvers as they unfold.',
    icon: 'Radio',
  },
  {
    title: 'Instant Alerts in Seconds',
    description: 'Immediate phone calls and priority WhatsApp alerts to your floor managers with exact suspect descriptions and aisle locations.',
    icon: 'Zap',
  },
  {
    title: 'Professional UK Operators',
    description: 'Trained, accredited surveillance professionals focused entirely on proactive deterrence, safety, and protocol enforcement.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Detailed Evidentiary Reporting',
    description: 'Court-admissible PDF dossiers with HD video timestamps, operator timelines, and clear incident summaries for police and insurance.',
    icon: 'FileSpreadsheet',
  },
  {
    title: 'Scalable Transparent Packages',
    description: 'Affordable monitoring starting from just $99/month (or $1.99/hr), with no costly hardware swaps and full flexibility to scale.',
    icon: 'TrendingUp',
  },
];
