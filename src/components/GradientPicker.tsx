import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { GRADIENT_PRESETS } from '../presets';
import { QRStyleConfig, GradientPreset } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GradientPickerProps {
  config: QRStyleConfig;
  onChangeConfig: (updater: (prev: QRStyleConfig) => QRStyleConfig) => void;
}

export const GradientPicker: React.FC<GradientPickerProps> = ({ config, onChangeConfig }) => {
  const { lang } = useLanguage();

  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  const handleApplyPreset = (preset: GradientPreset) => {
    onChangeConfig((prev) => ({
      ...prev,
      colorType: 'gradient',
      gradientColor1: preset.color1,
      gradientColor2: preset.color2,
      gradientAngle: preset.angle,
    }));
  };

  return (
    <div className="space-y-5">
      {/* 1. Gradient Controls Card */}
      <div className="liquid-glass-subtle p-4 sm:p-5 rounded-[22px] border border-[#132A86]/10 space-y-4">
        
        {/* Live Gradient Preview Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#4A577D]">
            <span>{lang === 'uz' ? 'Gradient ko\'rinishi' : 'Gradient Preview'}</span>
            <span className="font-mono text-[#132A86] font-bold">{config.gradientAngle}°</span>
          </div>
          <div
            className="h-10 w-full rounded-[14px] shadow-inner border border-black/5 flex items-center justify-between px-3 text-[11px] font-mono font-bold text-white drop-shadow-sm"
            style={{
              background: `linear-gradient(${config.gradientAngle}deg, ${config.gradientColor1}, ${config.gradientColor2})`,
            }}
          >
            <span>{config.gradientColor1}</span>
            <span>{config.gradientColor2}</span>
          </div>
        </div>

        {/* Color 1 and Color 2 pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Start Color */}
          <div className="bg-white/80 p-3 rounded-[16px] border border-[#132A86]/10">
            <label className="block text-[11px] font-bold text-[#132A86] uppercase tracking-wider mb-1.5">
              {lang === 'uz' ? '1-Rang (Boshi)' : 'Color 1 (Start)'}
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={config.gradientColor1}
                onChange={(e) => onChangeConfig(prev => ({ ...prev, gradientColor1: e.target.value }))}
                className="w-10 h-10 rounded-[12px] border border-gray-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={config.gradientColor1}
                onChange={(e) => onChangeConfig(prev => ({ ...prev, gradientColor1: e.target.value }))}
                className="w-full bg-white border border-[#132A86]/15 rounded-[10px] px-3 py-1.5 text-xs font-mono font-bold text-[#0A143A]"
              />
            </div>
          </div>

          {/* End Color */}
          <div className="bg-white/80 p-3 rounded-[16px] border border-[#132A86]/10">
            <label className="block text-[11px] font-bold text-[#132A86] uppercase tracking-wider mb-1.5">
              {lang === 'uz' ? '2-Rang (Oxiri)' : 'Color 2 (End)'}
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={config.gradientColor2}
                onChange={(e) => onChangeConfig(prev => ({ ...prev, gradientColor2: e.target.value }))}
                className="w-10 h-10 rounded-[12px] border border-gray-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={config.gradientColor2}
                onChange={(e) => onChangeConfig(prev => ({ ...prev, gradientColor2: e.target.value }))}
                className="w-full bg-white border border-[#132A86]/15 rounded-[10px] px-3 py-1.5 text-xs font-mono font-bold text-[#0A143A]"
              />
            </div>
          </div>
        </div>

        {/* Gradient Angle Slider & Quick Angle Presets */}
        <div className="bg-white/80 p-3.5 rounded-[16px] border border-[#132A86]/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#132A86] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#1FD0C2]" />
              {lang === 'uz' ? 'Gradient Yo\'nalishi (Burchak)' : 'Gradient Direction (Angle)'}
            </span>
            <span className="font-mono font-bold text-[#0A143A]">{config.gradientAngle}°</span>
          </div>

          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={config.gradientAngle}
            onChange={(e) => onChangeConfig(prev => ({ ...prev, gradientAngle: Number(e.target.value) }))}
            className="w-full accent-[#132A86] cursor-pointer"
          />

          <div className="flex items-center justify-between gap-1 overflow-x-auto pt-1">
            {angles.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => onChangeConfig(prev => ({ ...prev, gradientAngle: a }))}
                className={`px-2 py-1 rounded-[8px] text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  config.gradientAngle === a
                    ? 'bg-[#132A86] text-white shadow-sm'
                    : 'bg-white text-[#4A577D] hover:bg-[#EEF6FF] hover:text-[#132A86]'
                }`}
              >
                {a}°
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Gradient Presets Gallery */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#132A86] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
          <span>{lang === 'uz' ? 'Tayyor Gradient Shabloni' : 'Curated Gradient Presets'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {GRADIENT_PRESETS.map((p) => {
            const isActive =
              config.gradientColor1.toLowerCase() === p.color1.toLowerCase() &&
              config.gradientColor2.toLowerCase() === p.color2.toLowerCase();

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-2 rounded-[16px] border text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'border-[#132A86] ring-2 ring-[#132A86]/20 bg-white shadow-md'
                    : 'border-[#132A86]/10 bg-white/70 hover:bg-white hover:border-[#1FD0C2]'
                }`}
              >
                <div
                  className="h-9 w-full rounded-[10px] shadow-sm mb-1.5"
                  style={{
                    background: `linear-gradient(${p.angle}deg, ${p.color1}, ${p.color2})`,
                  }}
                />
                <p className="text-[11px] font-bold text-[#0A143A] group-hover:text-[#132A86] truncate">
                  {p.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
