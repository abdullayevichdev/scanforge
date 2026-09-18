import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Heart, Send, Instagram, Github, Phone, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenLegal?: (type: 'privacy' | 'terms') => void;
  onOpenAbout?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenAbout, onOpenAdmin }) => {
  const { t, lang } = useLanguage();

  return (
    <footer className="mt-16 sm:mt-20 border-t border-[#132A86]/10 bg-white/75 backdrop-blur-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* Brand & Creator Bio (sm:col-span-2 lg:col-span-4) */}
          <div className="sm:col-span-2 lg:col-span-4">
            <BrandLogo variant="standard" />
            <p className="text-xs sm:text-sm text-[#4A577D] mt-3.5 max-w-sm leading-relaxed">
              {t.footer.description}
            </p>

            <div className="mt-3.5 flex items-center gap-2 text-xs font-semibold text-[#132A86]">
              <ShieldCheck className="w-4 h-4 text-[#1FD0C2] shrink-0" />
              <span>{lang === 'uz' ? '100% Bepul • Suv belgisiz • Reklamasiz' : '100% Free • No Watermark • No Ads'}</span>
            </div>

            {/* Creator Socials */}
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://t.me/avazxanovvv_700"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#132A86]/6 hover:bg-[#229ED9]/15 text-[#4A577D] hover:text-[#229ED9] flex items-center justify-center transition-colors"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/avazxanovvv_700/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#132A86]/6 hover:bg-[#E1306C]/15 text-[#4A577D] hover:text-[#E1306C] flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/abdullayevichdev"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#132A86]/6 hover:bg-slate-900/15 text-[#4A577D] hover:text-[#0A143A] flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="tel:+998933223580"
                className="w-8 h-8 rounded-full bg-[#132A86]/6 hover:bg-[#1FD0C2]/20 text-[#4A577D] hover:text-[#132A86] flex items-center justify-center transition-colors"
                title="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Specialized Generators (sm:col-span-1 lg:col-span-3) */}
          <div className="sm:col-span-1 lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A143A] mb-3">
              {t.footer.products || 'Products'}
            </h4>
            <ul className="space-y-2 text-xs text-[#4A577D]">
              <li>
                <a href="#scanner" className="hover:text-[#132A86] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FD0C2] shrink-0" />
                  <span>{lang === 'uz' ? 'QR Skaner Studiyasi' : 'QR Scanner Studio'}</span>
                </a>
              </li>
              <li>
                <a href="#poster-creator" className="hover:text-[#132A86] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FD0C2] shrink-0" />
                  <span>{lang === 'uz' ? 'Poster & Flayer Generator' : 'Poster & Flyer Studio'}</span>
                </a>
              </li>
              <li>
                <a href="#business-card" className="hover:text-[#132A86] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FD0C2] shrink-0" />
                  <span>{lang === 'uz' ? 'Vizitka Generator' : 'Business Card Generator'}</span>
                </a>
              </li>
              <li>
                <a href="#wifi-card" className="hover:text-[#132A86] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FD0C2] shrink-0" />
                  <span>{lang === 'uz' ? 'Wi-Fi Stend Generator' : 'Wi-Fi Card Generator'}</span>
                </a>
              </li>
              <li>
                <a href="#restaurant-menu" className="hover:text-[#132A86] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FD0C2] shrink-0" />
                  <span>{lang === 'uz' ? 'Restoran Menyu QR' : 'Restaurant Menu QR'}</span>
                </a>
              </li>
              <li>
                <a href="#social-pack" className="hover:text-[#132A86] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FD0C2] shrink-0" />
                  <span>{lang === 'uz' ? 'Ijtimoiy Tarmoq Paketi' : 'Social Media Pack'}</span>
                </a>
              </li>
              <li>
                <a href="#dynamic-qr" className="hover:text-[#132A86] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#132A86] shrink-0" />
                  <span>{lang === 'uz' ? 'Dinamik QR Tizimi' : 'Dynamic QR Codes'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Navigation & Legal in compact columns on mobile */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 sm:col-span-2 lg:col-span-5">
            {/* Quick Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A143A] mb-3">
                {t.footer.quickLinks}
              </h4>
              <ul className="space-y-2 text-xs text-[#4A577D]">
                <li>
                  <a href="#hero" className="hover:text-[#132A86] transition-colors">
                    {t.nav.home}
                  </a>
                </li>
                <li>
                  <a href="#dashboard" className="hover:text-[#132A86] transition-colors">
                    {lang === 'uz' ? 'Boshqaruv' : 'Dashboard'}
                  </a>
                </li>
                <li>
                  <a href="#builder" className="hover:text-[#132A86] transition-colors">
                    {t.nav.builder}
                  </a>
                </li>
                <li>
                  <a href="#templates" className="hover:text-[#132A86] transition-colors">
                    {t.nav.templates}
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-[#132A86] transition-colors">
                    {t.nav.blog}
                  </a>
                </li>
                <li>
                  <a href="#help" className="hover:text-[#132A86] transition-colors">
                    {t.nav.help}
                  </a>
                </li>
                {onOpenAbout && (
                  <li>
                    <button
                      type="button"
                      onClick={onOpenAbout}
                      className="hover:text-[#132A86] transition-colors cursor-pointer text-left"
                    >
                      {lang === 'uz' ? 'Haqida' : 'About'}
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Legal & Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A143A] mb-3">
                {t.footer.legal}
              </h4>
              <ul className="space-y-2 text-xs text-[#4A577D]">
                <li>
                  <a href="#help" className="hover:text-[#132A86] transition-colors">
                    {t.nav.help} (FAQ)
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenLegal?.('privacy')}
                    className="hover:text-[#132A86] transition-colors cursor-pointer text-left"
                  >
                    {t.footer.privacy}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenLegal?.('terms')}
                    className="hover:text-[#132A86] transition-colors cursor-pointer text-left"
                  >
                    {t.footer.terms}
                  </button>
                </li>
                {onOpenAdmin && (
                  <li>
                    <button
                      type="button"
                      onClick={onOpenAdmin}
                      className="hover:text-[#132A86] font-semibold text-[#132A86] transition-colors cursor-pointer text-left flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>{lang === 'uz' ? 'Admin Panel' : 'Admin Panel'}</span>
                    </button>
                  </li>
                )}
                <li className="pt-2 text-[11px] font-mono text-[#132A86] font-semibold">
                  scanforge.uz
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-[#132A86]/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4A577D]">
          <p>© {new Date().getFullYear()} {t.footer.author}. {t.footer.rights}</p>
          <p className="flex items-center gap-1 font-medium">
            {lang === 'uz' ? (
              <>Toshkentda Abdulhay tomonidan mehr bilan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" /> yaratildi.</>
            ) : (
              <>Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" /> by Abdulhay in Tashkent.</>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};
