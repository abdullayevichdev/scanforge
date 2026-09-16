import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Wand2 } from 'lucide-react';
import { calculateContrastRatio } from '../utils/qrUtils';
import { QRStyleConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ContrastWarningProps {
  config: QRStyleConfig;
  onAutoFix: () => void;
}

export const ContrastWarning: React.FC<ContrastWarningProps> = ({ config, onAutoFix }) => {
  const { lang } = useLanguage();

  // Test contrast between primary foreground and effective background
  const fgColor = config.colorType === 'solid' ? config.foregroundSolid : config.gradientColor1;
  const bgColor = config.backgroundType === 'solid' ? config.backgroundColor : '#FFFFFF';
  
  const ratio = calculateContrastRatio(fgColor, bgColor);

  // Status tiers
  const isDanger = ratio < 3.0;
  const isMedium = ratio >= 3.0 && ratio < 4.5;
  const isHigh = ratio >= 4.5;

  return (
    <div className="space-y-2">
      {/* Contrast Badge Indicator */}
      <div className="flex items-center justify-between p-3 rounded-[16px] bg-white/70 border border-[#132A86]/10 text-xs">
        <div className="flex items-center gap-2">
          {isHigh && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {isMedium && <ShieldCheck className="w-4 h-4 text-amber-600" />}
          {isDanger && <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />}

          <span className="font-semibold text-[#0A143A]">
            {lang === 'uz' ? 'O\'qilish kontrasti (WCAG):' : 'Readability Contrast (WCAG):'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] ${
              isHigh
                ? 'bg-emerald-100 text-emerald-800'
                : isMedium
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {ratio}:1 — {isHigh ? (lang === 'uz' ? 'A\'lo' : 'Excellent') : isMedium ? (lang === 'uz' ? 'O\'rtacha' : 'Good') : (lang === 'uz' ? 'Xavfli' : 'Poor')}
          </span>
        </div>
      </div>

      {/* Dangerous Poor Contrast Warning Card */}
      {isDanger && (
        <div className="p-3.5 rounded-[18px] bg-rose-50/90 border border-rose-200 text-xs text-rose-900 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-rose-950">
                {lang === 'uz'
                  ? 'Diqqat: Kam kontrast sababli QR kod skanerlanmasligi mumkin!'
                  : 'Warning: Low contrast may make this QR code unscannable!'}
              </p>
              <p className="text-[11px] text-rose-800 mt-0.5 leading-snug">
                {lang === 'uz'
                  ? 'Tanlangan ranglar o\'rtasida yetarlicha farq yo\'q. Kamera datchiklari modul chegaralarini ajrata olmasligi mumkin. Kontrastni oshiring yoki avtomatik to\'g\'rilashdan foydalaning.'
                  : 'There is insufficient contrast between foreground and background colors. Camera sensors may fail to decode the matrix. Increase contrast or auto-fix.'}
              </p>

              <button
                type="button"
                onClick={onAutoFix}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{lang === 'uz' ? 'Avtomatik To\'g\'rilash' : 'Auto-Fix Contrast'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
