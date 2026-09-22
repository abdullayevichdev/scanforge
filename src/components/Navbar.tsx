import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { 
  Menu, 
  X, 
  User, 
  QrCode, 
  LayoutTemplate, 
  History, 
  BookOpen, 
  HelpCircle, 
  Globe, 
  Sparkles, 
  ChevronDown, 
  CreditCard, 
  Wifi, 
  Utensils, 
  Share2, 
  Repeat 
} from 'lucide-react';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenAbout?: () => void;
  onOpenAdmin?: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, onOpenAbout, onOpenAdmin, savedCount }) => {
  const { language, setLanguage, t, lang } = useLanguage();
  const { user, logout, isAdminLoggedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const specialTools = [
    { href: "#business-card", label: lang === 'uz' ? 'Vizitka Kartasi' : 'Business Card', icon: CreditCard },
    { href: "#wifi-card", label: lang === 'uz' ? 'Wi-Fi Stend' : 'Wi-Fi Sign Card', icon: Wifi },
    { href: "#restaurant-menu", label: lang === 'uz' ? 'Restoran Menyu QR' : 'Restaurant Menu', icon: Utensils },
    { href: "#social-pack", label: lang === 'uz' ? 'Ijtimoiy Tarmoq Paketi' : 'Social Media Pack', icon: Share2 },
    { href: "#dynamic-qr", label: lang === 'uz' ? 'Dinamik QR Tizimi' : 'Dynamic QR Codes', icon: Repeat },
    { href: "#poster-creator", label: lang === 'uz' ? 'Poster & Flayer' : 'Poster & Flyer Studio', icon: CreditCard },
  ];

  const navLinks = [
    { href: "#hero", label: t.nav.home, icon: Globe },
    { href: "#dashboard", label: lang === 'uz' ? 'Boshqaruv' : 'Dashboard', icon: History },
    { href: "#builder", label: t.nav.builder, icon: QrCode },
    { href: "#templates", label: t.nav.templates, icon: LayoutTemplate },
    { href: "#scanner", label: lang === 'uz' ? 'QR Skaner' : 'QR Scanner', icon: QrCode },
    { href: "#blog", label: t.nav.blog, icon: BookOpen },
    { href: "#help", label: t.nav.help, icon: HelpCircle },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <header className="sticky top-2.5 sm:top-4 z-50 w-full max-w-7xl mx-auto px-2.5 sm:px-6 transition-all duration-300">
      <div className="liquid-glass rounded-[20px] sm:rounded-[26px] px-3 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between shadow-[0_8px_32px_rgba(19,42,134,0.06)] border border-white/80">
        {/* Brand Logo */}
        <a 
          href="#hero" 
          id="nav-logo-link"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02] shrink-0"
        >
          <BrandLogo variant="navbar" />
        </a>

        {/* Desktop Navigation Links - Clean, Uncluttered Layout */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 whitespace-nowrap" aria-label="Main Navigation">
          <a
            href="#hero"
            className="px-3 py-1.5 rounded-[14px] text-[13px] font-medium text-[#0A143A]/85 hover:text-[#132A86] hover:bg-white/80 transition-all duration-200"
          >
            {t.nav.home}
          </a>

          <a
            href="#builder"
            className="px-3 py-1.5 rounded-[14px] text-[13px] font-medium text-[#0A143A]/85 hover:text-[#132A86] hover:bg-white/80 transition-all duration-200"
          >
            {t.nav.builder}
          </a>

            {/* Tools / Studios Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setToolsDropdownOpen(!toolsDropdownOpen);
              }}
              onMouseEnter={() => setToolsDropdownOpen(true)}
              className="px-3 py-1.5 rounded-[14px] text-[13px] font-bold text-[#132A86] bg-[#132A86]/6 hover:bg-[#132A86]/10 active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
              <span>{lang === 'uz' ? 'Maxsus Studiyalar' : 'Studios'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {toolsDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 liquid-glass-elevated bg-white/95 backdrop-blur-2xl rounded-[22px] p-2 border border-white/90 shadow-2xl z-50 origin-top-left"
                >
                  {specialTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <a
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-[14px] text-xs font-medium text-[#0A143A] hover:bg-[#132A86]/8 hover:text-[#132A86] transition-colors"
                      >
                        <div className="w-7 h-7 rounded-[10px] bg-white flex items-center justify-center text-[#132A86] shadow-xs shrink-0">
                          <Icon className="w-3.5 h-3.5 text-[#1FD0C2]" />
                        </div>
                        <span className="truncate">{tool.label}</span>
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#templates"
            className="px-3 py-1.5 rounded-[14px] text-[13px] font-medium text-[#0A143A]/85 hover:text-[#132A86] hover:bg-white/80 transition-all duration-200"
          >
            {t.nav.templates}
          </a>

          <a
            href="#blog"
            className="px-3 py-1.5 rounded-[14px] text-[13px] font-medium text-[#0A143A]/85 hover:text-[#132A86] hover:bg-white/80 transition-all duration-200"
          >
            {t.nav.blog}
          </a>

          <a
            href="#help"
            className="px-3 py-1.5 rounded-[14px] text-[13px] font-medium text-[#0A143A]/85 hover:text-[#132A86] hover:bg-white/80 transition-all duration-200"
          >
            {t.nav.help}
          </a>
        </nav>

        {/* Right Controls: Language Switcher, Admin Button, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher Pill */}
          <div 
            id="lang-switcher"
            className="flex items-center p-0.5 sm:p-1 rounded-[14px] sm:rounded-[16px] bg-white/70 border border-[#132A86]/10 shadow-[inset_0_1px_2px_rgba(19,42,134,0.04)]"
            title={t.nav.switchLanguage}
          >
            <button
              type="button"
              id="lang-btn-uz"
              onClick={() => setLanguage('uz')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-[10px] sm:rounded-[12px] transition-all duration-200 cursor-pointer ${
                language === 'uz'
                  ? 'bg-[#132A86] text-white shadow-[0_2px_8px_rgba(19,42,134,0.25)]'
                  : 'text-[#4A577D] hover:text-[#0A143A]'
              }`}
            >
              UZ
            </button>
            <button
              type="button"
              id="lang-btn-en"
              onClick={() => setLanguage('en')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-[10px] sm:rounded-[12px] transition-all duration-200 cursor-pointer ${
                language === 'en'
                  ? 'bg-[#132A86] text-white shadow-[0_2px_8px_rgba(19,42,134,0.25)]'
                  : 'text-[#4A577D] hover:text-[#0A143A]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Admin Panel Entry Trigger */}
          {onOpenAdmin && (
            <button
              type="button"
              id="nav-admin-btn"
              onClick={onOpenAdmin}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-[14px] sm:rounded-[16px] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border ${
                isAdminLoggedIn
                  ? 'bg-[#132A86] text-white shadow-md shadow-[#132A86]/20 border-[#132A86]'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#132A86] border-[#132A86]/10'
              }`}
              title="Admin Monitoring Panel"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline font-bold">Admin</span>
            </button>
          )}

          {/* User Profile Badge & Dropdown */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                id="nav-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="apple-glass-secondary p-1.5 sm:px-3 sm:py-1.5 rounded-[14px] sm:rounded-[16px] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border border-[#132A86]/10"
                title={`${user.firstName} ${user.lastName}`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#132A86] to-[#00D2B4] text-white flex items-center justify-center text-[10px] font-black">
                  {user.firstName[0]}
                </div>
                <span className="hidden sm:inline font-bold truncate max-w-[90px]">
                  {user.firstName}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 liquid-glass-elevated rounded-[20px] p-2 border border-white/90 shadow-2xl z-50 animate-fade-in text-xs"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="p-2.5 border-b border-slate-200/60 dark:border-slate-800">
                    <p className="font-black text-slate-900 dark:text-white truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                      {user.phone}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{lang === 'uz' ? 'Faol Sessiya' : 'Active Session'}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full p-2 text-left rounded-xl hover:bg-[#132A86]/10 text-slate-700 font-semibold transition-colors"
                    >
                      {t.nav.profile}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full p-2 text-left rounded-xl hover:bg-rose-500/10 text-rose-600 font-semibold transition-colors flex items-center justify-between"
                    >
                      <span>{lang === 'uz' ? 'Chiqish' : 'Log out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              id="nav-profile-btn"
              onClick={onOpenProfile}
              className="apple-glass-secondary p-1.5 sm:px-3.5 sm:py-1.5 rounded-[14px] sm:rounded-[16px] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
              title={t.nav.profile}
            >
              <User className="w-3.5 h-3.5 text-[#132A86]" />
              <span className="hidden sm:inline">{t.nav.profile}</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-[12px] sm:rounded-[14px] bg-white/80 border border-[#132A86]/10 text-[#132A86] hover:bg-white transition-colors cursor-pointer flex items-center justify-center"
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer - Compact Liquid Glass View */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden mt-2 liquid-glass-elevated bg-white/95 backdrop-blur-2xl rounded-[24px] p-4 shadow-[0_16px_40px_rgba(19,42,134,0.14)] border border-white/95 max-h-[80vh] overflow-y-auto scrollbar-none touch-pan-y space-y-3.5 origin-top"
          >
          {/* User Profile Card inside Mobile Drawer */}
          {user ? (
            <div className="p-3 rounded-[18px] bg-gradient-to-r from-[#132A86]/6 to-[#1FD0C2]/10 border border-[#132A86]/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#132A86] to-[#00D2B4] text-white flex items-center justify-center text-xs font-black shrink-0">
                  {user.firstName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0A143A] truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-[#4A577D] font-mono truncate">
                    {user.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="px-2.5 py-1.5 rounded-[12px] bg-white border border-[#132A86]/15 text-[11px] font-bold text-[#132A86] cursor-pointer"
                >
                  {t.nav.profile}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                  }}
                  className="px-2 py-1.5 rounded-[12px] bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-600 cursor-pointer"
                >
                  {lang === 'uz' ? 'Chiqish' : 'Exit'}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProfile();
              }}
              className="w-full py-2.5 px-4 rounded-[16px] apple-glass-secondary border border-[#132A86]/15 text-xs font-bold text-[#132A86] flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#132A86]" />
              <span>{lang === 'uz' ? 'Kirish / Profil ochish' : 'Sign in / Profile'}</span>
            </button>
          )}

          {/* Main Navigation Links */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A577D] block mb-1.5 px-1">
              {lang === 'uz' ? 'Asosiy Sahifalar' : 'Main Navigation'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon || Globe;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-[14px] text-xs font-medium text-[#0A143A] hover:bg-[#EEF6FF] active:bg-[#EEF6FF] transition-colors touch-manipulation min-h-[42px]"
                  >
                    <Icon className="w-4 h-4 text-[#132A86] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Special Studios section in mobile */}
          <div className="pt-2 border-t border-[#132A86]/8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#132A86] block mb-2 px-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#1FD0C2]" />
              <span>{lang === 'uz' ? 'Maxsus Studiyalar & Generatorlar' : 'Special QR Studios'}</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {specialTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <a
                    key={tool.href}
                    href={tool.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 p-2 rounded-[14px] text-xs text-[#0A143A] bg-white/60 hover:bg-white border border-[#132A86]/8 active:scale-[0.98] transition-all touch-manipulation min-h-[42px]"
                  >
                    <div className="w-6 h-6 rounded-[8px] bg-white flex items-center justify-center text-[#1FD0C2] shrink-0 shadow-2xs">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate font-medium">{tool.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Language Switcher & About Trigger */}
          <div className="pt-2.5 border-t border-[#132A86]/8 flex items-center justify-between">
            {onOpenAbout && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAbout();
                }}
                className="text-xs font-bold text-[#132A86] hover:underline cursor-pointer"
              >
                {t.nav.about}
              </button>
            )}

            <div className="flex gap-1 bg-white/80 p-1 rounded-[14px] border border-[#132A86]/10 ml-auto">
              <button
                type="button"
                onClick={() => setLanguage('uz')}
                className={`px-3 py-1 text-xs font-semibold rounded-[10px] transition-all ${
                  language === 'uz' ? 'bg-[#132A86] text-white shadow-xs' : 'text-[#4A577D]'
                }`}
              >
                O'zbek
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-[10px] transition-all ${
                  language === 'en' ? 'bg-[#132A86] text-white shadow-xs' : 'text-[#4A577D]'
                }`}
              >
                Eng
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </header>
  );
};
