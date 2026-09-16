import React from 'react';
import { Sparkles, Clock, CheckCircle2, X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DailyLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyLimitModal: React.FC<DailyLimitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Liquid Glass Modal Card */}
      <div 
        className="relative w-full max-w-lg liquid-glass-elevated bg-white/95 backdrop-blur-2xl rounded-[32px] sm:rounded-[36px] border border-white/90 shadow-2xl p-6 sm:p-8 overflow-hidden z-10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-[#4A577D] hover:text-[#0A143A] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-[22px] bg-[#132A86]/10 text-[#132A86] flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Clock className="w-8 h-8 text-[#132A86]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-xs font-bold text-amber-900 mb-2.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'uz' ? 'Kunlik Limit: 15 / 15' : 'Daily Limit: 15 / 15'}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-[#0A143A] mb-2.5">
          {lang === 'uz' ? 'Bugungi limitga yetdingiz' : 'Daily Limit Reached'}
        </h3>

        <p className="text-xs sm:text-sm text-[#4A577D] leading-relaxed mb-6">
          {lang === 'uz'
            ? "ScanForge xizmati mutlaqo bepul! Har bir foydalanuvchi kuniga 15 tagacha yangi QR kod yaratishi mumkin. Toshkent vaqti (UTC+5) bilan soat 00:00 da profilingizdagi limit avtomatik ravishda 15 taga yangilanadi."
            : "ScanForge is completely free! Each user can create up to 15 fresh QR codes per day. The limit automatically resets at midnight (00:00 Tashkent time, UTC+5)."}
        </p>

        {/* Free Assurance Box */}
        <div className="bg-[#EEF6FF]/70 border border-[#132A86]/10 rounded-[20px] p-4 text-left mb-6 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#132A86] font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{lang === 'uz' ? 'Mavjud shablonlar va studiyalar cheklovlarsiz' : 'Unlimited templates & studio generators'}</span>
          </div>
          <p className="text-[11px] text-[#4A577D] pl-6">
            {lang === 'uz'
              ? 'Shablonlardan foydalanish, vizitkalar, Wi-Fi stendlari va menyu yaratish har doim bepul va qulay!'
              : 'Using templates, business cards, Wi-Fi signs, and restaurant menus is always 100% free and ready for print.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="apple-glass-cta w-full py-3.5 rounded-[16px] text-xs sm:text-sm font-bold cursor-pointer shadow-md"
          >
            {lang === 'uz' ? 'Tushunarli' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
