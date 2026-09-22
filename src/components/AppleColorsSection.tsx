import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check } from 'lucide-react';
import { APPLE_COLORS } from '../presets';
import { QRStyleConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AppleColorsSectionProps {
  config: QRStyleConfig;
  onChangeConfig: (updater: (prev: QRStyleConfig) => QRStyleConfig) => void;
}

export const AppleColorsSection: React.FC<AppleColorsSectionProps> = ({ config, onChangeConfig }) => {
  const { lang } = useLanguage();
  const [targetSlot, setTargetSlot] = useState<'fg' | 'grad1' | 'grad2' | 'bg' | 'eyeOuter' | 'eyeInner'>('fg');
  const [lastAppliedColor, setLastAppliedColor] = useState<string | null>(null);

  const title = lang === 'uz' ? 'Apple Ranglari' : 'Apple Colors';
  const subtitle = lang === 'uz'
    ? 'Apple dizayn falsafasiga asoslangan estetik ranglar palitrasi'
    : 'A curated palette of refined Apple-inspired colors for your QR codes';

  const applyColor = (hex: string) => {
    setLastAppliedColor(hex);
    onChangeConfig((prev) => {
      switch (targetSlot) {
        case 'fg':
          return { ...prev, colorType: 'solid', foregroundSolid: hex };
        case 'grad1':
          return { ...prev, colorType: 'gradient', gradientColor1: hex };
        case 'grad2':
          return { ...prev, colorType: 'gradient', gradientColor2: hex };
        case 'bg':
          return { ...prev, backgroundType: 'solid', backgroundColor: hex };
        case 'eyeOuter':
          return { ...prev, customEyeColor: true, eyeOuterColor: hex };
        case 'eyeInner':
          return { ...prev, customEyeColor: true, eyeInnerColor: hex };
        default:
          return prev;
      }
    });
    setTimeout(() => setLastAppliedColor(null), 1500);
  };

  const slotLabels = {
    fg: lang === 'uz' ? 'Asosiy rang' : 'Primary Solid',
    grad1: lang === 'uz' ? 'Gradient boshi' : 'Gradient Start',
    grad2: lang === 'uz' ? 'Gradient oxiri' : 'Gradient End',
    bg: lang === 'uz' ? 'Orqa fon' : 'Background',
    eyeOuter: lang === 'uz' ? 'Tashqi ko\'z' : 'Eye Frame',
    eyeInner: lang === 'uz' ? 'Qorachiq' : 'Pupil',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#132A86] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{title}</span>
          </div>
          <p className="text-[11px] text-[#4A577D] mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Target Slot Selector */}
        <div className="flex items-center gap-1 bg-white/80 p-1 rounded-[14px] border border-[#132A86]/10 text-[11px] overflow-x-auto scrollbar-none touch-pan-x max-w-full">
          {(['fg', 'grad1', 'grad2', 'bg', 'eyeOuter'] as const).map((slot) => (
            <motion.button
              key={slot}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setTargetSlot(slot)}
              className={`px-2.5 py-1.5 rounded-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer touch-manipulation shrink-0 relative ${
                targetSlot === slot
                  ? 'bg-[#132A86] text-white shadow-sm'
                  : 'text-[#4A577D] hover:text-[#0A143A] hover:bg-white/60 active:bg-white'
              }`}
            >
              {slotLabels[slot]}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Apple Colors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {APPLE_COLORS.map((item) => {
          const isSelected = 
            (targetSlot === 'fg' && config.foregroundSolid.toLowerCase() === item.hex.toLowerCase()) ||
            (targetSlot === 'grad1' && config.gradientColor1.toLowerCase() === item.hex.toLowerCase()) ||
            (targetSlot === 'grad2' && config.gradientColor2.toLowerCase() === item.hex.toLowerCase()) ||
            (targetSlot === 'bg' && config.backgroundColor.toLowerCase() === item.hex.toLowerCase()) ||
            (targetSlot === 'eyeOuter' && config.eyeOuterColor.toLowerCase() === item.hex.toLowerCase());

          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.18 }}
              onClick={() => applyColor(item.hex)}
              className={`p-2 rounded-[16px] border text-left group flex flex-col justify-between h-20 cursor-pointer transition-colors ${
                isSelected
                  ? 'border-[#132A86] ring-2 ring-[#132A86]/20 bg-white shadow-md'
                  : 'border-[#132A86]/10 bg-white/70 hover:bg-white hover:border-[#1FD0C2]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className="w-5 h-5 rounded-full shadow-inner border border-black/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: item.hex }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <Check className="w-3 h-3 text-white drop-shadow-sm" />
                    </motion.div>
                  )}
                </span>
                <span className="text-[10px] font-mono text-[#4A577D]">
                  {item.hex}
                </span>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#0A143A] group-hover:text-[#132A86] truncate leading-tight">
                  {lang === 'uz' ? item.nameUz : item.nameEn}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
