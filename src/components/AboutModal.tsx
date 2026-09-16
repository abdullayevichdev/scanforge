import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, X, Shield, Globe, Award, Heart, CheckCircle2, QrCode } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="liquid-glass-elevated w-full max-w-2xl max-h-[90vh] rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-2xl overflow-y-auto flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#132A86]/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-[#132A86] to-[#1FD0C2] flex items-center justify-center text-white shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#0A143A]">
                {lang === 'uz' ? 'ScanForge Haqida' : 'About ScanForge'}
              </h3>
              <p className="text-[11px] text-[#4A577D] font-medium">
                {lang === 'uz' ? 'Mukammal, bepul va zamonaviy QR ekotizimi' : 'Premium, free & privacy-first QR ecosystem'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-[14px] bg-white/70 hover:bg-white text-[#4A577D] hover:text-[#0A143A] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-5 text-xs sm:text-sm text-[#4A577D] leading-relaxed">
          <div className="p-4 rounded-[22px] bg-gradient-to-br from-[#132A86]/5 to-[#1FD0C2]/10 border border-[#132A86]/10 space-y-2">
            <h4 className="text-sm font-bold text-[#132A86] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1FD0C2]" />
              <span>{lang === 'uz' ? 'ScanForge Missiyasi' : 'The ScanForge Mission'}</span>
            </h4>
            <p>
              {lang === 'uz'
                ? 'ScanForge — foydalanuvchilarga hech qanday obuna to\'lovlarisiz, reklamasiz va suv belgisisiz (watermark) professional darajadagi eng yuqori sifatli (Ultra HD 4K/8K, SVG, PDF) QR kodlarni yaratish, tahrirlash va skanerlash imkoniyatini taqdim etadi.'
                : 'ScanForge is built to provide everyone with Apple-level design elegance for creating, customizing, and scanning ultra-high-resolution (4K/8K, SVG, PDF) QR codes with zero subscriptions, zero ads, and zero watermarks.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-[20px] bg-white/80 border border-[#132A86]/10 space-y-1.5">
              <div className="flex items-center gap-2 text-[#0A143A] font-bold text-xs">
                <Shield className="w-4 h-4 text-[#1FD0C2]" />
                <span>{lang === 'uz' ? '100% Maxfiylik' : '100% Privacy-First'}</span>
              </div>
              <p className="text-[11px] text-[#4A577D]">
                {lang === 'uz'
                  ? 'Barcha QR kodlar to\'g\'ridan-to\'g\'ri brauzeringizda render qilinadi va xavfsiz saqlanadi.'
                  : 'All QR codes and designs render entirely in your browser with zero data harvesting.'}
              </p>
            </div>

            <div className="p-4 rounded-[20px] bg-white/80 border border-[#132A86]/10 space-y-1.5">
              <div className="flex items-center gap-2 text-[#0A143A] font-bold text-xs">
                <Award className="w-4 h-4 text-[#132A86]" />
                <span>{lang === 'uz' ? 'Liquid Glass Dizayn' : 'Liquid Glass Interface'}</span>
              </div>
              <p className="text-[11px] text-[#4A577D]">
                {lang === 'uz'
                  ? 'Apple dizayn falsafasiga asoslangan estetik va qulay boshqaruv.'
                  : 'Crafted with premium typography, fluid translucency, and optical precision.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-white border border-[#132A86]/10 space-y-2">
            <h4 className="text-xs font-bold text-[#0A143A]">
              {lang === 'uz' ? 'Loyiha Muallifi & Yaratuvchisi' : 'Creator & Developer'}
            </h4>
            <p className="text-xs text-[#4A577D]">
              {lang === 'uz'
                ? 'Loyiha Abdulhay tomonidan yuqori sifat, qulaylik va bepul texnologik xizmatlarni ommalashtirish maqsadida yaratilgan.'
                : 'Designed and engineered with pride by Abdulhay as a dedicated full-stack craft project.'}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-bold text-[#132A86]">
              <a href="https://t.me/abdulxay_dev" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Telegram: @abdulxay_dev
              </a>
              <span>•</span>
              <a href="tel:+998901234567" className="hover:underline">
                +998 90 123 45 67
              </a>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="pt-6 mt-6 border-t border-[#132A86]/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="apple-glass-cta py-2.5 px-6 rounded-[16px] text-xs font-bold cursor-pointer"
          >
            {lang === 'uz' ? 'Tushunarli' : 'Got it'}
          </button>
        </div>

      </div>
    </div>
  );
};
