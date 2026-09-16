import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Handshake, 
  Sparkles, 
  Phone, 
  Send, 
  Instagram, 
  Github, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const OwnerPromotionCards: React.FC = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: Partnership & Suggestions */}
          <div className="liquid-glass-elevated rounded-[28px] p-7 sm:p-8 border border-white/90 shadow-md relative overflow-hidden flex flex-col justify-between group hover:border-[#132A86]/30 transition-all duration-300">
            {/* Ambient decorative blur circle */}
            <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#1FD0C2]/15 blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132A86]/8 text-xs font-bold text-[#132A86] mb-4">
                <Handshake className="w-3.5 h-3.5 text-[#1FD0C2]" />
                <span>{t.partnership.card1Title}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A143A] tracking-tight mb-3">
                {t.partnership.card1Title}
              </h3>

              <p className="text-sm text-[#4A577D] leading-relaxed mb-6">
                {t.partnership.card1Desc}
              </p>
            </div>

            {/* Phone & Direct Call Button */}
            <div className="pt-4 border-t border-[#132A86]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-[#4A577D] block mb-0.5">
                  {lang === 'uz' ? 'To\'g\'ridan-to\'g\'ri aloqa:' : 'Direct Phone Line:'}
                </span>
                <span className="text-base font-extrabold font-mono text-[#0A143A]">
                  {t.partnership.card1Phone}
                </span>
              </div>

              <a
                href={`tel:${t.partnership.card1Phone}`}
                className="apple-glass-primary py-2.5 px-5 rounded-[16px] text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-[1.02] transition-transform"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.partnership.card1Call}</span>
              </a>
            </div>
          </div>

          {/* Card 2: Connect with Abdulhay */}
          <div className="liquid-glass-elevated rounded-[28px] p-7 sm:p-8 border border-white/90 shadow-md relative overflow-hidden flex flex-col justify-between group hover:border-[#132A86]/30 transition-all duration-300">
            {/* Ambient decorative blur circle */}
            <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#132A86]/10 blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132A86]/8 text-xs font-bold text-[#132A86] mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#132A86]" />
                <span>ScanForge by Abdulhay</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A143A] tracking-tight mb-3">
                {t.partnership.card2Title}
              </h3>

              <p className="text-sm text-[#4A577D] leading-relaxed mb-6">
                {t.partnership.card2Desc}
              </p>
            </div>

            {/* Social channels bar */}
            <div className="pt-4 border-t border-[#132A86]/8 grid grid-cols-3 gap-2.5">
              <a
                href="https://t.me/avazxanovvv_700"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-[16px] bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/20 text-[#229ED9] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              <a
                href="https://www.instagram.com/avazxanovvv_700/"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-[16px] bg-[#E1306C]/10 hover:bg-[#E1306C]/20 border border-[#E1306C]/20 text-[#E1306C] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>

              <a
                href="https://github.com/abdullayevichdev"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-[16px] bg-slate-900/10 hover:bg-slate-900/20 border border-slate-900/20 text-[#0A143A] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
