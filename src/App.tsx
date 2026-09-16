import React, { useState, useEffect } from 'react';
import { QRType, QRStyleConfig, QRConfig } from './types';
import { INITIAL_CONFIG } from './presets';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DashboardSection } from './components/DashboardSection';
import { BuilderSection } from './components/BuilderSection';
import { QRScannerSection } from './components/QRScannerSection';
import { PosterCreator } from './components/PosterCreator';
import { BusinessCardGenerator } from './components/BusinessCardGenerator';
import { WifiCardGenerator } from './components/WifiCardGenerator';
import { RestaurantMenuGenerator } from './components/RestaurantMenuGenerator';
import { SocialQRPack } from './components/SocialQRPack';
import { DynamicQRSection } from './components/DynamicQRSection';
import { TemplatesSection } from './components/TemplatesSection';
import { HistoryItem, SavedQRCodeRecord } from './types';
import { BlogSection } from './components/BlogSection';
import { HelpSection } from './components/HelpSection';
import { OwnerPromotionCards } from './components/OwnerPromotionCards';
import { UserSettingsModal } from './components/UserSettingsModal';
import { DailyLimitModal } from './components/DailyLimitModal';
import { LegalModal } from './components/LegalModals';
import { AboutModal } from './components/AboutModal';
import { MobileFloatingMenu } from './components/MobileFloatingMenu';
import { Footer } from './components/Footer';
import { ToastNotification, ToastItem } from './components/ToastNotification';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const HISTORY_STORAGE_KEY = 'scanforge_saved_history_v1';

function MainAppContent() {
  const { lang } = useLanguage();
  const { canCreateQR, recordCreation } = useAuth();

  // 1. Core QR State
  const [activeType, setActiveType] = useState<QRType>('url');
  const [qrValue, setQrValue] = useState('https://scanforge.uz');
  const [config, setConfig] = useState<QRStyleConfig>({ ...INITIAL_CONFIG });

  // Currently editing history item ID (if loaded from history)
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);

  // UI States
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [dailyLimitModalOpen, setDailyLimitModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Toast Helper
  const showToast = (title: string, message?: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const newToast: ToastItem = {
      id: 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4),
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Permanent History State (Retained until manually deleted)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY) || localStorage.getItem('scanforge_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const persistHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // ignore storage quota errors
    }
  };

  // URL Share Parameter Parsing or Autosave Draft Loading on Mount
  useEffect(() => {
    // Handle Dynamic QR redirection on client side
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    const dest = searchParams.get('dest');
    if (dest) {
      window.location.replace(dest.startsWith('http') ? dest : `https://${dest}`);
      return;
    }

    if (hash && hash.startsWith('#r=')) {
      const code = hash.replace('#r=', '').split('&')[0];
      try {
        const stored = localStorage.getItem('scanforge_dynamic_qrs');
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find((d: any) => d.shortCode === code || d.id === code);
          const target = found?.targetUrl || found?.destinationUrl;
          if (target) {
            window.location.replace(target.startsWith('http') ? target : `https://${target}`);
            return;
          }
        }
      } catch (err) {
        console.error('Redirect failed:', err);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');
    if (stateParam) {
      try {
        const decoded = JSON.parse(atob(stateParam));
        if (decoded.type) setActiveType(decoded.type);
        if (decoded.value && !decoded.value.includes('qrbuilder.uz')) {
          setQrValue(decoded.value);
        }
        if (decoded.cfg) setConfig((prev) => ({ ...prev, ...decoded.cfg }));
        return;
      } catch (err) {
        console.error('Error restoring state from URL param:', err);
      }
    }

    // Otherwise, check for autosaved draft
    try {
      const draftStr = localStorage.getItem('scanforge_active_draft_v1');
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        if (draft.config) setConfig(draft.config);
        if (draft.qrValue && !draft.qrValue.includes('qrbuilder.uz')) {
          setQrValue(draft.qrValue);
        }
        if (draft.activeType) setActiveType(draft.activeType);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save or Update QR in History
  const handleSaveToHistory = () => {
    // 1. If user is currently editing an existing history item:
    // Update in-place WITHOUT consuming daily count
    if (editingHistoryId) {
      const updated = history.map((item) => {
        if (item.id === editingHistoryId) {
          return {
            ...item,
            title: activeType.toUpperCase() + ' - ' + (qrValue.slice(0, 24) || 'QR Code'),
            type: activeType,
            updatedAt: Date.now(),
            config: { ...config },
            content: qrValue,
          };
        }
        return item;
      });
      persistHistory(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      showToast(
        lang === 'uz' ? 'Tarixdagi QR kod yangilandi' : 'Updated in history',
        lang === 'uz' ? 'O\'zgarishlar saqlandi (kunlik limit sarflanmadi).' : 'Saved without consuming daily quota.',
        'success'
      );
      return;
    }

    // 2. Otherwise, creating a new QR code:
    if (!canCreateQR()) {
      setDailyLimitModalOpen(true);
      return;
    }

    const newId = 'qr_' + Date.now();
    const newItem: HistoryItem = {
      id: newId,
      title: activeType.toUpperCase() + ' - ' + (qrValue.slice(0, 24) || 'QR Code'),
      type: activeType,
      createdAt: Date.now(),
      config: { ...config },
      content: qrValue,
    };

    const updated = [newItem, ...history];
    persistHistory(updated);
    recordCreation(newId);
    setEditingHistoryId(newId);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    showToast(
      lang === 'uz' ? 'Tarixga saqlandi' : 'Saved to history',
      lang === 'uz' ? 'QR dizayn doimiy xotiraga saqlandi.' : 'Design permanently stored in browser history.',
      'success'
    );
  };

  // Duplicate an existing QR
  const handleDuplicateHistoryItem = (item: HistoryItem) => {
    if (!canCreateQR()) {
      setDailyLimitModalOpen(true);
      return;
    }

    const dupId = 'qr_' + Date.now();
    const dupTitle = `${item.title} (${lang === 'uz' ? 'Nusxa' : 'Copy'})`;
    const dupItem: HistoryItem = {
      id: dupId,
      title: dupTitle,
      type: item.type,
      createdAt: Date.now(),
      config: { ...item.config },
      content: item.content,
    };

    const updated = [dupItem, ...history];
    persistHistory(updated);
    recordCreation(dupId);

    // Load into builder
    handleLoadHistoryItem(dupItem);

    showToast(
      lang === 'uz' ? 'Nusxasi yaratildi' : 'Duplicated',
      dupTitle,
      'success'
    );
  };

  // Delete item manually
  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    persistHistory(updated);
    if (editingHistoryId === id) {
      setEditingHistoryId(null);
    }
    showToast(
      lang === 'uz' ? 'O\'chirildi' : 'Deleted',
      lang === 'uz' ? 'QR kod tarixdan butunlay olib tashlandi.' : 'Item permanently removed.',
      'info'
    );
  };

  // Clear all history manually
  const handleClearHistory = () => {
    persistHistory([]);
    setEditingHistoryId(null);
    showToast(
      lang === 'uz' ? 'Tarix tozalandi' : 'History cleared',
      lang === 'uz' ? 'Barcha saqlangan QR kodlar o\'chirildi.' : 'All saved items removed.',
      'info'
    );
  };

  // Load history item into builder
  const handleLoadHistoryItem = (item: HistoryItem) => {
    setEditingHistoryId(item.id);
    setActiveType(item.type);
    setQrValue(item.content || '');
    setConfig({
      dotStyle: item.config.dotStyle,
      eyeOuterStyle: item.config.eyeOuterStyle,
      eyeInnerStyle: item.config.eyeInnerStyle,
      colorType: item.config.colorType,
      foregroundSolid: item.config.foregroundSolid,
      gradientColor1: item.config.gradientColor1,
      gradientColor2: item.config.gradientColor2,
      gradientAngle: item.config.gradientAngle,
      gradientType: item.config.gradientType,
      backgroundType: item.config.backgroundType,
      backgroundColor: item.config.backgroundColor,
      bgGradientColor1: item.config.bgGradientColor1 || '#FFFFFF',
      bgGradientColor2: item.config.bgGradientColor2 || '#F0F5FF',
      bgGradientAngle: item.config.bgGradientAngle || 135,
      bgImageUrl: item.config.bgImageUrl || null,
      bgImageOpacity: item.config.bgImageOpacity ?? 0.3,
      customEyeColor: item.config.customEyeColor,
      eyeOuterColor: item.config.eyeOuterColor,
      eyeInnerColor: item.config.eyeInnerColor,
      frameStyle: item.config.frameStyle || 'none',
      frameText: item.config.frameText || 'SCAN ME',
      frameColor: item.config.frameColor || '#132A86',
      frameTextColor: item.config.frameTextColor || '#FFFFFF',
      logoType: item.config.logoType,
      presetLogoId: item.config.presetLogoId,
      customLogoUrl: item.config.customLogoUrl,
      customLogoFileName: item.config.customLogoFileName,
      logoSize: item.config.logoSize,
      logoBgShape: item.config.logoBgShape,
      logoBgPadding: item.config.logoBgPadding,
      errorCorrectionLevel: item.config.errorCorrectionLevel,
      margin: item.config.margin,
      sizeScale: item.config.sizeScale ?? 1,
    });
    const el = document.getElementById('builder');
    el?.scrollIntoView({ behavior: 'smooth' });
    showToast(
      lang === 'uz' ? 'Tarixdan yuklandi' : 'Loaded from history',
      item.title,
      'info'
    );
  };

  // Apply template into builder
  const handleApplyTemplate = (tplConfig: Partial<QRConfig>) => {
    setEditingHistoryId(null);
    if (tplConfig.content) {
      setQrValue(tplConfig.content);
    }
    setConfig((prev) => ({
      ...prev,
      ...tplConfig,
    }));
    const el = document.getElementById('builder');
    el?.scrollIntoView({ behavior: 'smooth' });
    showToast(
      lang === 'uz' ? 'Shablon qo\'llanildi' : 'Template applied',
      lang === 'uz' ? 'Dizayn muharrirga joylandi.' : 'Loaded into the live editor.',
      'success'
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-[#0A143A] relative overflow-x-hidden">
      {/* Ambient background blend: White + Sky Blue + Hint of Pink */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-sky-200/50 blur-[120px]" />
        <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] rounded-full bg-pink-200/40 blur-[130px]" />
        <div className="absolute top-2/3 -left-20 w-[650px] h-[650px] rounded-full bg-sky-100/60 blur-[140px]" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-pink-100/45 blur-[130px]" />
      </div>
      
      {/* 1. Global Navigation: Floating Sticky Liquid Glass Navbar */}
      <Navbar 
        onOpenProfile={() => setProfileModalOpen(true)} 
        onOpenAbout={() => setAboutModalOpen(true)}
        savedCount={history.length} 
      />

      {/* 2. Hero Section (Section 64 & 65) */}
      <HeroSection 
        onGetStarted={() => scrollToSection('builder')} 
        onExploreTemplates={() => scrollToSection('templates')} 
      />

      {/* 3. User Dashboard (Section 66, 67, 68) */}
      <DashboardSection
        onNewQR={() => scrollToSection('builder')}
        onScanQR={() => scrollToSection('scanner')}
        onExploreTemplates={() => scrollToSection('templates')}
        onOpenSettings={() => setProfileModalOpen(true)}
        onEditQR={(record) => {
          setActiveType(record.type);
          setQrValue(record.content);
          setConfig(record.config);
          scrollToSection('builder');
          showToast(
            lang === 'uz' ? 'QR kod konstruktorga yuklandi' : 'Loaded into QR Builder',
            record.name,
            'info'
          );
        }}
        onShowToast={showToast}
      />

      {/* 4. Main Interactive QR Builder (Left Controls + Right Live Preview) */}
      <BuilderSection
        activeType={activeType}
        setActiveType={setActiveType}
        config={config}
        setConfig={setConfig}
        qrValue={qrValue}
        setQrValue={setQrValue}
        onSaveToHistory={handleSaveToHistory}
        saveSuccess={saveSuccess}
        onShowToast={showToast}
      />

      {/* 5. QR Scanner Studio (Camera & Image Upload Decoder) */}
      <QRScannerSection
        onLoadIntoBuilder={(scannedContent, detectedType) => {
          setQrValue(scannedContent);
          setActiveType(detectedType);
          scrollToSection('builder');
        }}
        onShowToast={showToast}
      />

      {/* 6. Specialized Studio 1: Business Card Generator (Printable & Digital) */}
      <BusinessCardGenerator onShowToast={showToast} />

      {/* 7. Specialized Studio 2: Wi-Fi Table Sign Generator */}
      <WifiCardGenerator onShowToast={showToast} />

      {/* 8. Specialized Studio 3: Restaurant Menu QR Experience */}
      <RestaurantMenuGenerator onShowToast={showToast} />

      {/* 9. Specialized Studio 4: Social Media QR Quick Pack */}
      <SocialQRPack onShowToast={showToast} />

      {/* 10. Specialized Studio 5: Dynamic Redirection QR Engine */}
      <DynamicQRSection onShowToast={showToast} />

      {/* 11. Specialized Studio 6: Poster & Flyer Creator Studio */}
      <PosterCreator onShowToast={showToast} />

      {/* 12. Curated Design Templates Section */}
      <TemplatesSection onSelectTemplate={handleApplyTemplate} />

      {/* 13. Educational Blog Section */}
      <BlogSection />

      {/* 14. FAQ / Help Section */}
      <HelpSection />

      {/* 15. Owner Partnership & Contact Cards */}
      <OwnerPromotionCards />

      {/* 16. Footer */}
      <Footer 
        onOpenLegal={(type) => setLegalModalType(type)} 
        onOpenAbout={() => setAboutModalOpen(true)}
      />

      {/* User Settings & Profile Modal (Section 52) */}
      <UserSettingsModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        savedCount={history.length} 
        onShowToast={showToast}
      />

      {/* About ScanForge Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      {/* Floating Glass Navigation Menu on Mobile (Section 46) */}
      <MobileFloatingMenu onOpenSettings={() => setProfileModalOpen(true)} />

      {/* Friendly Daily Limit Modal */}
      <DailyLimitModal
        isOpen={dailyLimitModalOpen}
        onClose={() => setDailyLimitModalOpen(false)}
      />

      {/* Privacy Policy & Terms of Service Modals */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Liquid Glass Toast Notifications */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
