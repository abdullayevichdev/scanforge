import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Layers,
  Printer
} from 'lucide-react';
import { QRStyleConfig } from '../types';
import { downloadQRAsPNG, downloadQRAsJPG, downloadQRAsPDF, downloadQRAsSVG } from '../utils/qrUtils';
import { QRRenderer } from './QRRenderer';
import { useLanguage } from '../context/LanguageContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrValue: string;
  config: QRStyleConfig;
  onSuccessToast: (format: string, resolution: number) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  qrValue,
  config,
  onSuccessToast,
}) => {
  const { lang, t } = useLanguage();

  const [format, setFormat] = useState<'png' | 'jpg' | 'pdf' | 'svg'>('png');
  const [resolution, setResolution] = useState<number>(2048);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const qualityPresets = [
    { label: 'Standard', res: 512, desc: '512 × 512 px (Veb / Ekran)', badge: 'Tezkor' },
    { label: 'HD', res: 1024, desc: '1024 × 1024 px (Ijtimoiy tarmoq)', badge: 'Mashhur' },
    { label: '2K', res: 2048, desc: '2048 × 2048 px (Vizitkalar / Flayer)', badge: 'Tavsiya' },
    { label: '4K', res: 4096, desc: '4096 × 4096 px (Banner / Menyu)', badge: 'Ultra HD' },
    { label: '8K', res: 8192, desc: '8192 × 8192 px (Ulkan Billbord)', badge: 'Maksimal' },
  ];

  const handleExecuteDownload = async () => {
    setIsExporting(true);
    const filename = `scanforge-qr-${Date.now()}`;
    const bg = transparentBg && (format === 'png' || format === 'svg') 
      ? 'transparent' 
      : (config.backgroundType === 'solid' ? config.backgroundColor : '#FFFFFF');

    try {
      let success = false;
      if (format === 'png') {
        success = await downloadQRAsPNG('scanforge-preview-svg', filename, resolution, bg);
      } else if (format === 'jpg') {
        success = await downloadQRAsJPG('scanforge-preview-svg', filename, resolution, bg);
      } else if (format === 'pdf') {
        success = await downloadQRAsPDF('scanforge-preview-svg', filename, resolution, bg);
      } else if (format === 'svg') {
        success = downloadQRAsSVG('scanforge-preview-svg', filename, resolution);
      }

      if (success) {
        onSuccessToast(format.toUpperCase(), resolution);
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Box */}
      <div 
        className="relative w-full max-w-2xl liquid-glass-elevated bg-white/95 backdrop-blur-2xl rounded-[26px] sm:rounded-[36px] border border-white/90 shadow-2xl p-4 sm:p-8 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#132A86]/10 mb-4 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[12px] sm:rounded-[14px] bg-[#132A86]/10 flex items-center justify-center text-[#132A86] shrink-0">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-[#0A143A]">
                {lang === 'uz' ? 'QR Kodni Eksport Qilish' : 'Export & Download QR'}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#4A577D]">
                {lang === 'uz' ? '100% Bepul • Suv belgisisiz' : '100% Free • No Watermark'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 text-[#4A577D] hover:text-[#0A143A] rounded-[12px] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="space-y-4 sm:space-y-6 overflow-y-auto pr-1">
          
          {/* Format Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {lang === 'uz' ? '1. Formatni Tanlang' : '1. Choose Format'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {[
                { id: 'png', name: 'PNG', icon: ImageIcon, desc: 'Ultra tiniq rasm' },
                { id: 'jpg', name: 'JPG', icon: ImageIcon, desc: 'Oq fonli rasm' },
                { id: 'pdf', name: 'PDF', icon: Printer, desc: 'Chop etish hujjati' },
                { id: 'svg', name: 'SVG', icon: Layers, desc: 'Vektor (Cheksiz)' },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormat(fmt.id as any)}
                    className={`p-2.5 sm:p-3.5 rounded-[16px] sm:rounded-[18px] border text-left transition-all cursor-pointer flex flex-col justify-between touch-manipulation ${
                      isSelected
                        ? 'border-[#132A86] bg-[#EEF6FF] ring-2 ring-[#132A86]/20 shadow-xs'
                        : 'border-[#132A86]/10 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <span className="font-extrabold text-xs sm:text-sm text-[#0A143A]">
                        {fmt.name}
                      </span>
                      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-[#132A86]' : 'text-[#4A577D]'}`} />
                    </div>
                    <span className="text-[10px] text-[#4A577D] truncate">
                      {fmt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality / Resolution Selection (for PNG, JPG, PDF) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider">
                {lang === 'uz' ? '2. Ruxsat & Sifat' : '2. Quality & Resolution'}
              </label>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {lang === 'uz' ? 'Barchasi bepul' : 'All free'}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {qualityPresets.map((q) => {
                const isSelected = resolution === q.res;
                return (
                  <button
                    key={q.res}
                    type="button"
                    onClick={() => setResolution(q.res)}
                    className={`p-2 sm:p-3 rounded-[14px] sm:rounded-[16px] border text-center transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'border-[#132A86] bg-[#132A86] text-white shadow-md'
                        : 'border-[#132A86]/10 bg-white/70 hover:bg-white text-[#0A143A]'
                    }`}
                  >
                    <p className="font-black text-xs sm:text-sm">{q.label}</p>
                    <p className={`text-[9px] sm:text-[10px] font-mono mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#4A577D]'}`}>
                      {q.res}px
                    </p>
                    <span className={`inline-block mt-0.5 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {q.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transparent Background Option for PNG & SVG */}
          {(format === 'png' || format === 'svg') && (
            <div className="flex items-center justify-between p-3.5 rounded-[18px] bg-[#EEF6FF]/60 border border-[#132A86]/10">
              <div>
                <span className="text-xs font-bold text-[#0A143A] block">
                  {lang === 'uz' ? 'Shaffof Fon (Transparent Background)' : 'Transparent Background'}
                </span>
                <span className="text-[11px] text-[#4A577D]">
                  {lang === 'uz' ? 'Dizayn va ilovalar ustiga qo\'yish uchun qulay' : 'Ideal for overlaying on mockups, flyers and posters'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
                className="w-5 h-5 accent-[#132A86] rounded cursor-pointer"
              />
            </div>
          )}

          {/* Quality & Safety Assurance Card */}
          <div className="flex items-center gap-3 p-3 rounded-[16px] bg-white border border-[#132A86]/10 text-xs text-[#4A577D]">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-[11px]">
              <strong className="text-[#0A143A]">ScanForge Kafolati:</strong> Yuklab olingan faylda hech qanday ScanForge suv belgisi (watermark) bo'lmaydi. QR kod istalgan o'lchamda toza va skanerlanishga tayyor.
            </p>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="pt-3 sm:pt-5 border-t border-[#132A86]/10 mt-3 sm:mt-5 flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-5 py-2.5 sm:py-3 rounded-[14px] sm:rounded-[16px] text-xs font-bold text-[#4A577D] hover:text-[#0A143A] hover:bg-black/5 transition-colors cursor-pointer touch-manipulation min-h-[42px]"
          >
            {t.common.cancel}
          </button>

          <button
            type="button"
            onClick={handleExecuteDownload}
            disabled={isExporting}
            className="apple-glass-cta flex-1 py-2.5 sm:py-3.5 px-3 sm:px-5 rounded-[16px] sm:rounded-[18px] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-lg disabled:opacity-70 touch-manipulation min-h-[42px]"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>{t.common.loading}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1FD0C2] shrink-0" />
                <span className="truncate">
                  {format.toUpperCase()} — {lang === 'uz' ? 'Yuklab Olish' : 'Download'} ({resolution}px)
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
