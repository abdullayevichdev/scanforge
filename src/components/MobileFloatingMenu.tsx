import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Utensils
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

  const menuItems = [
    { id: 'dashboard', label: lang === 'uz' ? 'Boshqaruv Paneli' : 'Dashboard', icon: Sparkles, iconColor: 'text-[#1FD0C2]' },
    { id: 'builder', label: lang === 'uz' ? 'QR Konstruktor' : 'QR Builder', icon: QrCode, iconColor: 'text-[#132A86]' },
    { id: 'scanner', label: lang === 'uz' ? 'QR Skaner' : 'QR Scanner', icon: QrCode, iconColor: 'text-[#1FD0C2]' },
    { id: 'templates', label: lang === 'uz' ? 'Shablonlar' : 'Templates', icon: LayoutTemplate, iconColor: 'text-[#132A86]' },
    { id: 'poster-creator', label: lang === 'uz' ? 'Poster Studiyasi' : 'Poster Studio', icon: CreditCard, iconColor: 'text-[#1FD0C2]' },
    { id: 'business-card', label: lang === 'uz' ? 'Vizitka Studiyasi' : 'Business Card', icon: CreditCard, iconColor: 'text-[#132A86]' },
    { id: 'wifi-card', label: lang === 'uz' ? 'Wi-Fi Stend' : 'Wi-Fi Sign', icon: Wifi, iconColor: 'text-[#132A86]' },
    { id: 'restaurant-menu', label: lang === 'uz' ? 'Menyu QR' : 'Restaurant Menu', icon: Utensils, iconColor: 'text-[#132A86]' },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 sm:bottom-6 right-3 sm:right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto pb-safe">
      {/* Floating Speed Dial Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="liquid-glass-elevated bg-white/95 backdrop-blur-2xl rounded-[24px] p-3 shadow-[0_16px_40px_rgba(19,42,134,0.18)] border border-white/90 mb-2 w-52 max-h-[75vh] overflow-y-auto scrollbar-none space-y-1 origin-bottom-right"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#132A86] px-2.5 py-1 mb-1 border-b border-[#132A86]/10 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <span>{lang === 'uz' ? 'Tezkor Menyu' : 'Quick Menu'}</span>
              <Sparkles className="w-3 h-3 text-[#1FD0C2]" />
            </div>

            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02, duration: 0.15 }}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => scrollTo(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#0A143A] hover:bg-[#EEF6FF] active:bg-[#EEF6FF] transition-colors cursor-pointer text-left"
                >
                  <Icon className={`w-4 h-4 shrink-0 ${item.iconColor}`} />
                  <span className="truncate">{item.label}</span>
                </motion.button>
              );
            })}

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-semibold text-[#132A86] bg-[#132A86]/6 hover:bg-[#132A86]/12 active:bg-[#132A86]/15 transition-colors cursor-pointer text-left"
            >
              <User className="w-4 h-4 text-[#132A86] shrink-0" />
              <span className="truncate">{lang === 'uz' ? 'Sozlamalar & Profil' : 'Settings & Profile'}</span>
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={scrollToTop}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-[12px] text-[11px] font-medium text-[#4A577D] hover:bg-slate-100 transition-colors cursor-pointer pt-1 text-left"
            >
              <ArrowUp className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'uz' ? 'Yuqoriga qaytish' : 'Back to top'}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glass Action Button with Radar Pulse Ring */}
      <motion.button
        type="button"
        id="mobile-floating-glass-btn"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="liquid-glass-elevated w-13 h-13 rounded-full bg-gradient-to-tr from-[#132A86] to-[#1FD0C2] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(19,42,134,0.35)] border border-white/60 cursor-pointer pulse-radar-ring relative"
        aria-label={lang === 'uz' ? 'Mobil Tezkor Menyu' : 'Mobile Quick Menu'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
