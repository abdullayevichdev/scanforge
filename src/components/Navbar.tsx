import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
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
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, onOpenAbout, savedCount }) => {
  const { language, setLanguage, t, lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

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
              className="px-3 py-1.5 rounded-[14px] text-[13px] font-bold text-[#132A86] bg-[#132A86]/6 hover:bg-[#132A86]/10 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
              <span>{lang === 'uz' ? 'Maxsus Studiyalar' : 'Studios'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {toolsDropdownOpen && (
              <div 
                onMouseLeave={() => setToolsDropdownOpen(false)}
                className="absolute top-full left-0 mt-1.5 w-64 liquid-glass-elevated rounded-[20px] p-2 border border-white/90 shadow-xl z-50 animate-fade-in"
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
              </div>
            )}
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

        {/* Right Controls: Language Switcher & Profile/Login */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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

          {/* Profile / Login Trigger */}
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="lg:hidden mt-2 liquid-glass-elevated rounded-[24px] p-4 shadow-[0_16px_40px_rgba(19,42,134,0.12)] border border-white/90 animate-fade-in"
        >
          {/* Main Links */}
          <div className="grid grid-cols-2 gap-1.5 pb-3 mb-3 border-b border-[#132A86]/10">
            {navLinks.map((item) => {
              const Icon = item.icon || Globe;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 p-2.5 rounded-[16px] text-xs font-medium text-[#0A143A] hover:bg-[#EEF6FF]/70 transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#132A86]" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Special Studios section in mobile */}
          <div className="pb-3 mb-3 border-b border-[#132A86]/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#132A86] block mb-2 px-1">
              {lang === 'uz' ? 'Maxsus Studiyalar' : 'Special Studios'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {specialTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <a
                    key={tool.href}
                    href={tool.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 p-2 rounded-[14px] text-xs text-[#0A143A] hover:bg-white/80 bg-white/40"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#1FD0C2]" />
                    <span className="truncate">{tool.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#4A577D] font-medium">{t.nav.switchLanguage}</span>
            <div className="flex gap-1 bg-white/80 p-1 rounded-[14px] border border-[#132A86]/10">
              <button
                type="button"
                onClick={() => setLanguage('uz')}
                className={`px-3 py-1 text-xs font-semibold rounded-[10px] ${
                  language === 'uz' ? 'bg-[#132A86] text-white' : 'text-[#4A577D]'
                }`}
              >
                O'zbekcha
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-[10px] ${
                  language === 'en' ? 'bg-[#132A86] text-white' : 'text-[#4A577D]'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
