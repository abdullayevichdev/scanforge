import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { QRRenderer } from './QRRenderer';
import { PRESETS } from '../presets';
import { QRConfig } from '../types';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Download, 
  Smartphone,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreTemplates: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onGetStarted, 
  onExploreTemplates 
}) => {
  const { t } = useLanguage();
  
  // Hero dynamic interactive preview state
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const heroPresets = [PRESETS[0], PRESETS[1], PRESETS[2], PRESETS[3]]; // Liquid Glass, Oceanic, Nordic, Obsidian
  const activePreset = heroPresets[activePresetIndex] || PRESETS[0];

  const heroConfig: QRConfig = {
    ...activePreset.config,
    content: "https://scanforge.uz",
  };

  return (
    <section 
      id="hero" 
      className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden"
    >
      {/* 9. HERO BACKGROUND: Atmospheric Glass Gradients */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft Blue Atmospheric Blob 1 */}
        <div 
          className="absolute -top-[12%] -left-[10%] w-[540px] h-[540px] sm:w-[720px] sm:h-[720px] rounded-full bg-gradient-to-tr from-[#EEF6FF] via-[#E2EDFF]/40 to-transparent blur-[80px] sm:blur-[110px] blob-float-1"
        />
        {/* Soft Turquoise Atmospheric Blob 2 */}
        <div 
          className="absolute top-[25%] -right-[8%] w-[480px] h-[480px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-br from-[#1FD0C2]/10 via-[#132A86]/5 to-transparent blur-[90px] sm:blur-[120px] blob-float-2"
        />
        {/* Center Subtly Blurred Circular Light */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-transparent via-[#EEF6FF]/70 to-transparent blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-[#132A86]/10 mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
              <span className="text-xs font-semibold tracking-wide text-[#132A86]">
                {t.hero.badge}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FD0C2] animate-pulse" />
            </div>

            {/* Apple-like Typography Headlines */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#0A143A] leading-[1.12] mb-5">
              <span className="block">{t.hero.headlineLine1}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#132A86] via-[#0F267A] to-[#1FD0C2]">
                {t.hero.headlineLine2}
              </span>
            </h1>

            {/* Supporting paragraph with generous line height and line width */}
            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-[#4A577D] font-normal leading-relaxed mb-8">
              {t.hero.supportingText}
            </p>

            {/* CTAs: Apple-Style Premium Glass Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 mb-10">
              <button
                type="button"
                id="hero-primary-cta"
                onClick={onGetStarted}
                className="apple-glass-cta w-full sm:w-auto px-7 py-3.5 rounded-[18px] text-base font-semibold flex items-center justify-center gap-2.5 group cursor-pointer shadow-lg"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                id="hero-secondary-cta"
                onClick={onExploreTemplates}
                className="apple-glass-secondary w-full sm:w-auto px-7 py-3.5 rounded-[18px] text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#132A86]" />
                <span>{t.hero.secondaryCta}</span>
              </button>
            </div>

            {/* Value Props & Indicators */}
            <div className="pt-6 border-t border-[#132A86]/8 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1FD0C2] shrink-0" />
                <span className="text-xs sm:text-[13px] font-medium text-[#0A143A]">
                  {t.hero.statFree}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#132A86] shrink-0" />
                <span className="text-xs sm:text-[13px] font-medium text-[#0A143A]">
                  {t.hero.statQuality}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#1FD0C2] shrink-0" />
                <span className="text-xs sm:text-[13px] font-medium text-[#0A143A]">
                  {t.hero.statLimit}
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero: Floating QR Preview Composition (Section 8 & 10) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px]">
              
              {/* Subtle back illumination glow */}
              <div className="absolute inset-4 rounded-[36px] bg-gradient-to-tr from-[#132A86]/10 to-[#1FD0C2]/15 blur-2xl -z-10" />

              {/* Elevated Glass Panel (32px to 40px radius as requested) */}
              <div className="gentle-floating-card liquid-glass-elevated rounded-[34px] sm:rounded-[38px] p-6 sm:p-7 border border-white/90 shadow-[0_24px_50px_-12px_rgba(19,42,134,0.12)]">
                
                {/* Header inside the floating glass card */}
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#132A86]/8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1FD0C2] animate-ping" />
                    <div>
                      <p className="text-xs font-bold text-[#132A86] tracking-tight">
                        {t.hero.floatingCardTitle}
                      </p>
                      <p className="text-[11px] text-[#4A577D]">
                        {t.hero.floatingCardSub}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#132A86]/8 text-[#132A86]">
                    {activePreset.name}
                  </span>
                </div>

                {/* QR Canvas Display */}
                <div className="bg-white/90 rounded-[26px] p-5 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(19,42,134,0.04)] border border-[#132A86]/6">
                  <div className="w-[240px] h-[240px] flex items-center justify-center">
                    <QRRenderer value={heroConfig.content} config={heroConfig} sizePx={240} svgId="scanforge-hero-preview-svg" />
                  </div>
                </div>

                {/* Interactive Preset Chips: Allows instantaneous preview change on hover/click */}
                <div className="mt-5 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#4A577D] flex items-center gap-1">
                      <Eye className="w-3 h-3 text-[#132A86]" />
                      {t.builder.designTabs.presets}
                    </span>
                    <span className="text-[10px] text-[#4A577D]/80">scanforge.uz</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {heroPresets.map((preset, idx) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setActivePresetIndex(idx)}
                        className={`px-2 py-1.5 rounded-[12px] text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                          activePresetIndex === idx
                            ? 'bg-[#132A86] text-white shadow-sm scale-[1.02]'
                            : 'bg-white/80 text-[#0A143A] hover:bg-white border border-[#132A86]/8'
                        }`}
                      >
                        {preset.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="mt-4 w-full py-2.5 rounded-[16px] bg-[#EEF6FF] hover:bg-[#E2EDFF] text-[#132A86] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border border-[#132A86]/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.builder.sectionTitle}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
