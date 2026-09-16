import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Menu, 
  X, 
  QrCode, 
  LayoutTemplate, 
  Sparkles, 
  User, 
  ArrowUp,
  CreditCard,
  Wifi,
  Utensils,
  Share2
} from 'lucide-react';

interface MobileFloatingMenuProps {
  onOpenSettings: () => void;
}

export const MobileFloatingMenu: React.FC<MobileFloatingMenuProps> = ({ onOpenSettings }) => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Floating Speed Dial Popup */}
      {isOpen && (
        <div 
          className="liquid-glass-elevated bg-white/95 backdrop-blur-2xl rounded-[24px] p-3 shadow-[0_16px_40px_rgba(19,42,134,0.18)] border border-white/90 mb-2 w-52 animate-fadeIn space-y-1"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#132A86] px-2.5 py-1 mb-1 border-b border-[#132A86]/10 flex items-center justify-between">
            <span>{lang === 'uz' ? 'Tezkor Menyu' : 'Quick Menu'}</span>
            <Sparkles className="w-3 h-3 text-[#1FD0C2]" />
          </div>

          <button
            type="button"
            onClick={() => scrollTo('dashboard')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#0A143A] hover:bg-[#EEF6FF] transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'Boshqaruv Paneli' : 'Dashboard'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('builder')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#0A143A] hover:bg-[#EEF6FF] transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#132A86]" />
            <span>{lang === 'uz' ? 'QR Konstruktor' : 'QR Builder'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('scanner')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#0A143A] hover:bg-[#EEF6FF] transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'QR Skaner' : 'QR Scanner'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('templates')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#0A143A] hover:bg-[#EEF6FF] transition-colors cursor-pointer"
          >
            <LayoutTemplate className="w-4 h-4 text-[#132A86]" />
            <span>{lang === 'uz' ? 'Shablonlar' : 'Templates'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('poster-creator')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#0A143A] hover:bg-[#EEF6FF] transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'Poster Studiyasi' : 'Poster Studio'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('business-card')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#0A143A] hover:bg-[#EEF6FF] transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#132A86]" />
            <span>{lang === 'uz' ? 'Vizitka Studiyasi' : 'Business Card'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('wifi-card')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#0A143A] hover:bg-[#EEF6FF] transition-colors cursor-pointer"
          >
            <Wifi className="w-4 h-4 text-[#132A86]" />
            <span>{lang === 'uz' ? 'Wi-Fi Stend' : 'Wi-Fi Sign'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('restaurant-menu')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#0A143A] hover:bg-[#EEF6FF] transition-colors cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#132A86]" />
            <span>{lang === 'uz' ? 'Menyu QR' : 'Restaurant Menu'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenSettings();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#132A86] bg-[#132A86]/6 hover:bg-[#132A86]/12 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-[#132A86]" />
            <span>{lang === 'uz' ? 'Sozlamalar & Profil' : 'Settings & Profile'}</span>
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-[12px] text-[11px] font-medium text-[#4A577D] hover:bg-slate-100 transition-colors cursor-pointer pt-1"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{lang === 'uz' ? 'Yuqoriga qaytish' : 'Back to top'}</span>
          </button>
        </div>
      )}

      {/* Floating Glass Action Button */}
      <button
        type="button"
        id="mobile-floating-glass-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="liquid-glass-elevated w-13 h-13 rounded-full bg-gradient-to-tr from-[#132A86] to-[#1FD0C2] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(19,42,134,0.35)] border border-white/60 active:scale-95 transition-all cursor-pointer"
        aria-label={lang === 'uz' ? 'Mobil Tezkor Menyu' : 'Mobile Quick Menu'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
};
