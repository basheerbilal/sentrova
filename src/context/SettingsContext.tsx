import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { SENTROVA_CONTACT } from '../data/sentrovaData';

export interface SiteSettings {
  company_name: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  whatsappMessage: string;
  whatsappLink: string;
  email: string;
  address: string;
  hero_title: string;
  hero_description: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  meta_title: string;
  meta_description: string;
  raw: Record<string, string>;
}

const defaultSettings: SiteSettings = {
  company_name: 'SENTROVA Surveillance Ltd',
  phone: SENTROVA_CONTACT.phone,
  phoneDisplay: SENTROVA_CONTACT.phoneDisplay,
  whatsapp: SENTROVA_CONTACT.whatsapp,
  whatsappDisplay: SENTROVA_CONTACT.whatsappDisplay,
  whatsappMessage: 'Hello SENTROVA, I would like to know more about your CCTV monitoring services.',
  whatsappLink: SENTROVA_CONTACT.whatsappLink,
  email: SENTROVA_CONTACT.email,
  address: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom',
  hero_title: 'Real-Time Remote CCTV Monitoring for UK Retail & Business',
  hero_description: 'Human-verified active surveillance starting at $1.99 / hour. We deter shoplifting, till theft, and unauthorized intrusion before damage occurs.',
  facebook_url: 'https://www.facebook.com/alizy.queen.9',
  instagram_url: 'https://instagram.com/sentrova',
  linkedin_url: 'https://linkedin.com/company/sentrova',
  meta_title: 'SENTROVA | Active 24/7 Remote CCTV Monitoring & Retail Deterrence',
  meta_description: 'Professional remote CCTV monitoring from $1.99/hr. Live operator surveillance, instant theft deterrence, and zero lock-in contracts.',
  raw: {},
};

function formatSettings(raw: Record<string, string>): SiteSettings {
  const phone = raw.phone || defaultSettings.phone;
  const whatsapp = raw.whatsapp || defaultSettings.whatsapp;
  const whatsappClean = whatsapp.replace(/[^0-9]/g, '');
  const whatsappMsg = raw.whatsapp_message || defaultSettings.whatsappMessage;
  const whatsappLink = `https://wa.me/${whatsappClean || '447448871603'}?text=${encodeURIComponent(whatsappMsg)}`;

  return {
    company_name: raw.company_name || defaultSettings.company_name,
    phone,
    phoneDisplay: phone,
    whatsapp,
    whatsappDisplay: whatsapp,
    whatsappMessage: whatsappMsg,
    whatsappLink,
    email: raw.email || defaultSettings.email,
    address: raw.address || defaultSettings.address,
    hero_title: raw.hero_title || defaultSettings.hero_title,
    hero_description: raw.hero_description || defaultSettings.hero_description,
    facebook_url: raw.facebook_url || defaultSettings.facebook_url,
    instagram_url: raw.instagram_url || defaultSettings.instagram_url,
    linkedin_url: raw.linkedin_url || defaultSettings.linkedin_url,
    meta_title: raw.meta_title || defaultSettings.meta_title,
    meta_description: raw.meta_description || defaultSettings.meta_description,
    raw,
  };
}

interface SettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      if (data && typeof data === 'object') {
        setSettings(formatSettings(data));
      }
    } catch (err) {
      console.warn('[SettingsProvider] Failed to fetch settings from API, using defaults:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
