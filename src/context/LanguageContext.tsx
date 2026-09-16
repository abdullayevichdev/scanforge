import React, { createContext, useContext, useState, useEffect } from 'react';
import { uz } from '../locales/uz';
import { en } from '../locales/en';

export type Language = 'uz' | 'en';
export type Translations = typeof uz;

interface LanguageContextType {
  language: Language;
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('scanforge_lang');
      if (saved === 'uz' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore localstorage errors
    }
    return 'en'; // Default language is English as required
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('scanforge_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = language === 'uz' ? uz : en;

  return (
    <LanguageContext.Provider value={{ language, lang: language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
