import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Sliders, 
  Palette, 
  Image as ImageIcon, 
  RotateCcw, 
  RotateCw,
  Upload, 
  Download, 
  Copy, 
  Share2, 
  Bookmark, 
  Check, 
  CheckCircle2, 
  Link as LinkIcon, 
  FileText, 
  Wifi, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  Send,
  Instagram,
  MapPin,
  Calendar,
  Layers,
  Square,
  Smile,
  Compass,
  Type,
  Clock
} from 'lucide-react';
import { QRType, QRStyleConfig, DesignPreset } from '../types';
import { PRESETS, PRESET_LOGOS, INITIAL_CONFIG } from '../presets';
import { QRInputForm } from './QRInputForm';
import { QRRenderer } from './QRRenderer';
import { GradientPicker } from './GradientPicker';
import { AppleColorsSection } from './AppleColorsSection';
import { ContrastWarning } from './ContrastWarning';
import { ExportModal } from './ExportModal';
import { copyQRToClipboard } from '../utils/qrUtils';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface BuilderSectionProps {
  activeType: QRType;
  setActiveType: (type: QRType) => void;
  config: QRStyleConfig;
  setConfig: React.Dispatch<React.SetStateAction<QRStyleConfig>>;
  qrValue: string;
  setQrValue: (val: string) => void;
  onSaveToHistory: () => void;
  saveSuccess: boolean;
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

interface Snapshot {
  config: QRStyleConfig;
  qrValue: string;
}

export const BuilderSection: React.FC<BuilderSectionProps> = ({
  activeType,
  setActiveType,
  config,
  setConfig,
  qrValue,
  setQrValue,
  onSaveToHistory,
  saveSuccess,
  onShowToast,
}) => {
  const { lang, t } = useLanguage();
  const { remainingCount, dailyLimit } = useAuth();

  const [activeTab, setActiveTab] = useState<'presets' | 'design' | 'colors' | 'frames' | 'background' | 'logo'>('presets');
  const [resetting, setResetting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [bgDragActive, setBgDragActive] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Undo / Redo Stacks (Section 26)
  const [undoStack, setUndoStack] = useState<Snapshot[]>([]);
  const [redoStack, setRedoStack] = useState<Snapshot[]>([]);
  const isNavigatingHistory = useRef(false);
  const lastSnapshot = useRef<Snapshot>({ config, qrValue });

  // Autosave status (Section 25)
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving'>('saved');

  // Autosave & Snapshot recording
  useEffect(() => {
    if (isNavigatingHistory.current) {
      isNavigatingHistory.current = false;
      return;
    }

    setAutosaveStatus('saving');
    const timer = setTimeout(() => {
      // Record snapshot to undo stack if changed
      const prev = lastSnapshot.current;
      if (
        JSON.stringify(prev.config) !== JSON.stringify(config) ||
        prev.qrValue !== qrValue
      ) {
        setUndoStack((curr) => [...curr.slice(-25), prev]);
        setRedoStack([]);
        lastSnapshot.current = { config, qrValue };
      }

      // Autosave draft to storage (Section 25)
      try {
        localStorage.setItem(
          'scanforge_active_draft_v1',
          JSON.stringify({ config, qrValue, activeType, savedAt: Date.now() })
        );
      } catch {
        // ignore quota
      }
      setAutosaveStatus('saved');
    }, 600);

    return () => clearTimeout(timer);
  }, [config, qrValue, activeType]);

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    isNavigatingHistory.current = true;
    setRedoStack((curr) => [...curr, { config, qrValue }]);
    setUndoStack(newUndoStack);
    setConfig(previous.config);
    setQrValue(previous.qrValue);
    lastSnapshot.current = previous;

    onShowToast(
      lang === 'uz' ? 'Bekor qilindi (Undo)' : 'Undo',
      undefined,
      'info'
    );
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    isNavigatingHistory.current = true;
    setUndoStack((curr) => [...curr, { config, qrValue }]);
    setRedoStack(newRedoStack);
    setConfig(next.config);
    setQrValue(next.qrValue);
    lastSnapshot.current = next;

    onShowToast(
      lang === 'uz' ? 'Qaytarildi (Redo)' : 'Redo',
      undefined,
      'info'
    );
  };

  // Keyboard shortcut listener for Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
      if (isInput) return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, config, qrValue]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  // 12 QR Types configuration
  const typeTabs: { id: QRType; label: string; icon: React.ElementType }[] = [
    { id: 'url', label: t.builder.contentTypes.url, icon: LinkIcon },
    { id: 'text', label: t.builder.contentTypes.text, icon: FileText },
    { id: 'phone', label: t.builder.contentTypes.phone, icon: Phone },
    { id: 'email', label: t.builder.contentTypes.email, icon: Mail },
    { id: 'whatsapp', label: t.builder.contentTypes.whatsapp, icon: MessageSquare },
    { id: 'telegram', label: t.builder.contentTypes.telegram, icon: Send },
    { id: 'instagram', label: t.builder.contentTypes.instagram, icon: Instagram },
    { id: 'wifi', label: t.builder.contentTypes.wifi, icon: Wifi },
    { id: 'vcard', label: t.builder.contentTypes.vcard, icon: User },
    { id: 'location', label: t.builder.contentTypes.location, icon: MapPin },
    { id: 'event', label: t.builder.contentTypes.event, icon: Calendar },
    { id: 'sms', label: t.builder.contentTypes.sms, icon: MessageSquare },
  ];

  const handleResetStyle = () => {
    setResetting(true);
    setConfig(INITIAL_CONFIG);
    setTimeout(() => setResetting(false), 500);
    onShowToast(
      lang === 'uz' ? 'Dizayn qayta tiklandi' : 'Style reset',
      lang === 'uz' ? 'Boshlang\'ich sozlamalar qo\'llanildi.' : 'Default settings applied.',
      'info'
    );
  };

  const applyPreset = (preset: DesignPreset) => {
    setConfig({
      ...preset.config,
      customLogoUrl: config.customLogoUrl,
      customLogoFileName: config.customLogoFileName,
    });
    onShowToast(
      preset.name,
      lang === 'uz' ? 'Shablon muvaffaqiyatli qo\'llanildi' : 'Preset applied successfully',
      'success'
    );
  };

  const handleCopyImage = async () => {
    const success = await copyQRToClipboard('scanforge-preview-svg');
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShowToast(
        lang === 'uz' ? 'Nusxalandi!' : 'Copied!',
        lang === 'uz' ? 'QR kod rasmi clipboardga nusxalandi' : 'QR code image copied to clipboard',
        'success'
      );
    }
  };

  const handleShare = () => {
    try {
      const stateObj = {
        type: activeType,
        value: qrValue,
        cfg: config,
      };
      const encoded = btoa(JSON.stringify(stateObj));
      const shareUrl = `${window.location.origin}${window.location.pathname}?state=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
      onShowToast(
        lang === 'uz' ? 'Havola nusxalandi!' : 'Link copied!',
        lang === 'uz' ? 'Dizayn havolasi xotiraga olindi' : 'Design share link copied to clipboard',
        'success'
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Logo file upload
  const handleLogoUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setConfig((prev) => ({
        ...prev,
        logoType: 'custom',
        customLogoUrl: result,
        customLogoFileName: file.name,
        errorCorrectionLevel: 'Q', // Ensure high readability
      }));
      onShowToast(
        lang === 'uz' ? 'Logotip yuklandi' : 'Logo uploaded',
        file.name,
        'success'
      );
    };
    reader.readAsDataURL(file);
  };

  // Background image upload
  const handleBgImageUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setConfig((prev) => ({
        ...prev,
        backgroundType: 'image',
        bgImageUrl: result,
      }));
      onShowToast(
        lang === 'uz' ? 'Orqa fon rasmi yuklandi' : 'Background image uploaded',
        file.name,
        'success'
      );
    };
    reader.readAsDataURL(file);
  };

  const autoFixContrast = () => {
    setConfig((prev) => ({
      ...prev,
      colorType: 'gradient',
      foregroundSolid: '#132A86',
      gradientColor1: '#132A86',
      gradientColor2: '#0D9488',
      backgroundType: 'solid',
      backgroundColor: '#FFFFFF',
      customEyeColor: true,
      eyeOuterColor: '#132A86',
      eyeInnerColor: '#0D9488',
    }));
    onShowToast(
      lang === 'uz' ? 'Kontrast to\'g\'rilandi!' : 'Contrast auto-fixed!',
      lang === 'uz' ? 'Skanerlanish kafolatlangan yuqori kontrastli ranglar o\'rnatildi.' : 'Safe high-contrast colors applied.',
      'success'
    );
  };

  return (
    <section id="builder" className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-bold text-[#132A86] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{t.builder.sectionTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-2">
            {t.builder.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D] mb-3">
            {t.builder.sectionSubtitle}
          </p>

          {/* Unobtrusive Daily Limit indicator (Section 21) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#132A86]/10 text-xs font-bold text-[#132A86] shadow-xs backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>
              {lang === 'uz'
                ? `Bugun ${dailyLimit} tadan ${remainingCount} ta QR kod qoldi`
                : `${remainingCount} of ${dailyLimit} QR codes remaining today`}
            </span>
          </div>
        </div>

        {/* Builder Layout Grid: Mobile preview first (order-1), desktop controls left (order-1 on lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          
          {/* Controls Column (Mobile: order-2, Desktop: order-1 lg:col-span-7) */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* 1. Content Type Pill Selector (12 Types) */}
            <div className="liquid-glass rounded-[22px] sm:rounded-[24px] p-2 sm:p-3 border border-white/80 shadow-sm">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none touch-pan-x">
                {typeTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      id={`tab-type-${tab.id}`}
                      onClick={() => setActiveType(tab.id)}
                      className={`px-3 sm:px-3.5 py-2.5 sm:py-2 rounded-[14px] sm:rounded-[16px] text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer touch-manipulation min-h-[40px] ${
                        isActive
                          ? 'bg-[#132A86] text-white shadow-md'
                          : 'text-[#4A577D] hover:text-[#0A143A] hover:bg-white/70 active:bg-white'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1FD0C2]' : 'text-[#132A86]'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Dynamic Input Fields for Active Type */}
            <div className="liquid-glass rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 lg:p-7 border border-white/90 shadow-sm">
              <QRInputForm 
                activeType={activeType} 
                value={qrValue}
                onValueChange={(val) => setQrValue(val)} 
              />
            </div>

            {/* 3. Design Studio Controls Card */}
            <div className="liquid-glass rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 lg:p-7 border border-white/90 shadow-sm">
              
              {/* Studio Tabs & Actions Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#132A86]/10 pb-4 mb-5 sm:mb-6">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none touch-pan-x">
                  {[
                    { id: 'presets', label: t.builder.designTabs.presets, icon: Sparkles },
                    { id: 'design', label: t.builder.designTabs.shape, icon: Sliders },
                    { id: 'colors', label: t.builder.designTabs.colors, icon: Palette },
                    { id: 'frames', label: lang === 'uz' ? 'Ramkalar' : 'Frames', icon: Square },
                    { id: 'background', label: lang === 'uz' ? 'Fon' : 'Background', icon: Layers },
                    { id: 'logo', label: t.builder.designTabs.logo, icon: ImageIcon },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        id={`design-tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-2 sm:py-1.5 rounded-[12px] sm:rounded-[14px] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 cursor-pointer touch-manipulation min-h-[38px] ${
                          isActive
                            ? 'bg-[#132A86] text-white shadow-sm'
                            : 'text-[#4A577D] hover:text-[#0A143A] hover:bg-white/70 active:bg-white'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1FD0C2]' : 'text-[#132A86]'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Studio Controls: Autosave status & Undo/Redo/Reset */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {/* Autosave status indicator (Section 25) */}
                  <div className="mr-1">
                    {autosaveStatus === 'saving' ? (
                      <span className="text-[10px] font-semibold text-[#4A577D] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        <span>{lang === 'uz' ? 'Saqlanmoqda...' : 'Saving...'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200/50">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{lang === 'uz' ? 'Saqlandi' : 'Saved'}</span>
                      </span>
                    )}
                  </div>

                  {/* Undo Button (Ctrl+Z) (Section 26) */}
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className={`p-1.5 rounded-[12px] transition-all cursor-pointer ${
                      undoStack.length === 0
                        ? 'text-[#4A577D]/30 cursor-not-allowed'
                        : 'text-[#4A577D] hover:text-[#132A86] hover:bg-white/80 shadow-xs'
                    }`}
                    title={lang === 'uz' ? 'Bekor qilish (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Redo Button (Ctrl+Shift+Z / Ctrl+Y) (Section 26) */}
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className={`p-1.5 rounded-[12px] transition-all cursor-pointer ${
                      redoStack.length === 0
                        ? 'text-[#4A577D]/30 cursor-not-allowed'
                        : 'text-[#4A577D] hover:text-[#132A86] hover:bg-white/80 shadow-xs'
                    }`}
                    title={lang === 'uz' ? 'Qaytarish (Ctrl+Shift+Z / Ctrl+Y)' : 'Redo (Ctrl+Shift+Z / Ctrl+Y)'}
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Reset Style Button */}
                  <button
                    type="button"
                    onClick={handleResetStyle}
                    className="p-1.5 text-[#4A577D] hover:text-[#132A86] rounded-[12px] hover:bg-white/70 transition-all cursor-pointer ml-1"
                    title={lang === 'uz' ? 'Dizaynni tozalash' : 'Reset Style'}
                  >
                    <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Tab 1: Presets */}
              {activeTab === 'presets' && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs text-[#4A577D]">
                    {t.builder.presets.subtitle}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="liquid-glass-subtle p-3.5 rounded-[20px] text-left hover:border-[#1FD0C2] hover:bg-white transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#0A143A] group-hover:text-[#132A86]">
                            {preset.name}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#1FD0C2]" />
                        </div>
                        <p className="text-[11px] text-[#4A577D] line-clamp-2">
                          {preset.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Shapes & Eyes */}
              {activeTab === 'design' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Module Shapes */}
                  <div>
                    <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2.5">
                      {t.builder.shapes.title}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: 'square', label: t.builder.shapes.square },
                        { id: 'rounded', label: t.builder.shapes.rounded },
                        { id: 'dots', label: t.builder.shapes.circle },
                        { id: 'fluid', label: t.builder.shapes.liquid },
                        { id: 'classy', label: t.builder.shapes.star },
                      ].map((shape) => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => setConfig({ ...config, dotStyle: shape.id as any })}
                          className={`p-2.5 rounded-[16px] text-xs font-semibold text-center transition-all cursor-pointer ${
                            config.dotStyle === shape.id
                              ? 'bg-[#132A86] text-white shadow-sm'
                              : 'bg-white/70 text-[#0A143A] border border-[#132A86]/10 hover:bg-white'
                          }`}
                        >
                          {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outer Frame Shape */}
                  <div>
                    <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2.5">
                      {t.builder.eyes.outerFrameShape}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'square', label: t.builder.eyes.square },
                        { id: 'rounded', label: t.builder.eyes.rounded },
                        { id: 'extra-rounded', label: t.builder.eyes.extraRounded },
                        { id: 'circular', label: t.builder.eyes.circle },
                      ].map((eye) => (
                        <button
                          key={eye.id}
                          type="button"
                          onClick={() => setConfig({ ...config, eyeOuterStyle: eye.id as any })}
                          className={`p-2 rounded-[14px] text-xs font-semibold text-center transition-all cursor-pointer ${
                            config.eyeOuterStyle === eye.id
                              ? 'bg-[#132A86] text-white shadow-sm'
                              : 'bg-white/70 text-[#0A143A] border border-[#132A86]/10 hover:bg-white'
                          }`}
                        >
                          {eye.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inner Pupil Shape */}
                  <div>
                    <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2.5">
                      {t.builder.eyes.innerPupilShape}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'square', label: t.builder.eyes.square },
                        { id: 'rounded', label: t.builder.eyes.rounded },
                        { id: 'circular', label: t.builder.eyes.circle },
                        { id: 'diamond', label: t.builder.eyes.diamond },
                      ].map((pupil) => (
                        <button
                          key={pupil.id}
                          type="button"
                          onClick={() => setConfig({ ...config, eyeInnerStyle: pupil.id as any })}
                          className={`p-2 rounded-[14px] text-xs font-semibold text-center transition-all cursor-pointer ${
                            config.eyeInnerStyle === pupil.id
                              ? 'bg-[#132A86] text-white shadow-sm'
                              : 'bg-white/70 text-[#0A143A] border border-[#132A86]/10 hover:bg-white'
                          }`}
                        >
                          {pupil.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Colors (with Gradient Picker & Apple Colors) */}
              {activeTab === 'colors' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Mode Toggle: Gradient vs Solid */}
                  <div className="flex items-center justify-between p-3.5 rounded-[18px] bg-white/70 border border-[#132A86]/10">
                    <div>
                      <span className="text-xs font-bold text-[#0A143A] block">
                        {t.builder.colors.gradientToggle}
                      </span>
                      <span className="text-[11px] text-[#4A577D]">
                        {lang === 'uz' ? 'Ikki rangli suyuq gradient yoki tekis rang' : 'Two-tone liquid gradient or solid color'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfig({
                        ...config,
                        colorType: config.colorType === 'gradient' ? 'solid' : 'gradient'
                      })}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        config.colorType === 'gradient' ? 'bg-[#132A86]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          config.colorType === 'gradient' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Gradient Picker Component if Gradient active */}
                  {config.colorType === 'gradient' ? (
                    <GradientPicker config={config} onChangeConfig={setConfig} />
                  ) : (
                    <div className="bg-white/80 p-4 rounded-[20px] border border-[#132A86]/10">
                      <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                        {t.builder.colors.singleColor}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={config.foregroundSolid}
                          onChange={(e) => setConfig({ ...config, foregroundSolid: e.target.value })}
                          className="w-11 h-11 rounded-[14px] border border-gray-200 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={config.foregroundSolid}
                          onChange={(e) => setConfig({ ...config, foregroundSolid: e.target.value })}
                          className="w-36 bg-white border border-[#132A86]/15 rounded-[12px] px-3 py-2 text-xs font-mono font-bold text-[#0A143A]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Custom Finder Eye Colors */}
                  <div className="bg-white/80 p-4 rounded-[20px] border border-[#132A86]/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0A143A]">
                        {t.builder.eyes.customEyeColor}
                      </span>
                      <input
                        type="checkbox"
                        checked={config.customEyeColor}
                        onChange={(e) => setConfig({ ...config, customEyeColor: e.target.checked })}
                        className="w-4 h-4 accent-[#132A86] rounded cursor-pointer"
                      />
                    </div>

                    {config.customEyeColor && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-[#4A577D] mb-1">
                            {t.builder.eyes.outerColor}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.eyeOuterColor}
                              onChange={(e) => setConfig({ ...config, eyeOuterColor: e.target.value })}
                              className="w-8 h-8 rounded-[8px] border cursor-pointer"
                            />
                            <span className="text-xs font-mono">{config.eyeOuterColor}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#4A577D] mb-1">
                            {t.builder.eyes.innerColor}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.eyeInnerColor}
                              onChange={(e) => setConfig({ ...config, eyeInnerColor: e.target.value })}
                              className="w-8 h-8 rounded-[8px] border cursor-pointer"
                            />
                            <span className="text-xs font-mono">{config.eyeInnerColor}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Curated Apple Colors Palette */}
                  <div className="pt-2 border-t border-[#132A86]/10">
                    <AppleColorsSection config={config} onChangeConfig={setConfig} />
                  </div>
                </div>
              )}

              {/* Tab 4: Frames & Borders */}
              {activeTab === 'frames' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2.5">
                      {lang === 'uz' ? 'Ramka Uslubi' : 'Frame Style'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'none', label: lang === 'uz' ? 'Ramkasiz' : 'No Frame' },
                        { id: 'scan-me-bottom', label: lang === 'uz' ? 'Skanerlang (Pastda)' : 'Scan Me (Bottom)' },
                        { id: 'scan-me-top', label: lang === 'uz' ? 'Skanerlang (Tepada)' : 'Scan Me (Top)' },
                        { id: 'card', label: lang === 'uz' ? 'Karta Ramka' : 'Card Frame' },
                        { id: 'polaroid', label: 'Polaroid' },
                        { id: 'minimal-tag', label: lang === 'uz' ? 'Oddiy Belgi' : 'Minimal Tag' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setConfig({ ...config, frameStyle: item.id as any })}
                          className={`p-3 rounded-[16px] text-xs font-bold text-center transition-all cursor-pointer ${
                            config.frameStyle === item.id
                              ? 'bg-[#132A86] text-white shadow-sm'
                              : 'bg-white/70 text-[#0A143A] border border-[#132A86]/10 hover:bg-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {config.frameStyle !== 'none' && (
                    <div className="space-y-4 bg-white/80 p-4 rounded-[22px] border border-[#132A86]/10">
                      <div>
                        <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                          {lang === 'uz' ? 'Ramka Matni' : 'Frame Text'}
                        </label>
                        <div className="relative">
                          <Type className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                          <input
                            type="text"
                            value={config.frameText}
                            onChange={(e) => setConfig({ ...config, frameText: e.target.value })}
                            className="w-full bg-white border border-[#132A86]/15 rounded-[14px] px-4 py-2.5 pl-11 text-xs font-bold text-[#0A143A]"
                            placeholder="SCAN ME"
                            maxLength={24}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#4A577D] mb-1">
                            {lang === 'uz' ? 'Ramka Foni Rangi' : 'Frame Color'}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.frameColor}
                              onChange={(e) => setConfig({ ...config, frameColor: e.target.value })}
                              className="w-9 h-9 rounded-[10px] border cursor-pointer"
                            />
                            <span className="text-xs font-mono">{config.frameColor}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#4A577D] mb-1">
                            {lang === 'uz' ? 'Matn Rangi' : 'Text Color'}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.frameTextColor}
                              onChange={(e) => setConfig({ ...config, frameTextColor: e.target.value })}
                              className="w-9 h-9 rounded-[10px] border cursor-pointer"
                            />
                            <span className="text-xs font-mono">{config.frameTextColor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Background & Contrast */}
              {activeTab === 'background' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Background Type Choice */}
                  <div>
                    <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2.5">
                      {lang === 'uz' ? 'Orqa Fon Turi' : 'Background Type'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'solid', label: lang === 'uz' ? 'Bir Rangli' : 'Solid' },
                        { id: 'transparent', label: lang === 'uz' ? 'Shaffof' : 'Transparent' },
                        { id: 'gradient', label: 'Gradient' },
                        { id: 'image', label: lang === 'uz' ? 'Rasm Fon' : 'Image' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setConfig({ ...config, backgroundType: item.id as any })}
                          className={`p-3 rounded-[16px] text-xs font-bold text-center transition-all cursor-pointer ${
                            config.backgroundType === item.id
                              ? 'bg-[#132A86] text-white shadow-sm'
                              : 'bg-white/70 text-[#0A143A] border border-[#132A86]/10 hover:bg-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Solid Background Color */}
                  {config.backgroundType === 'solid' && (
                    <div className="bg-white/80 p-4 rounded-[20px] border border-[#132A86]/10">
                      <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                        {lang === 'uz' ? 'Fon Rangi' : 'Background Color'}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={config.backgroundColor}
                          onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                          className="w-11 h-11 rounded-[14px] border border-gray-200 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={config.backgroundColor}
                          onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                          className="w-36 bg-white border border-[#132A86]/15 rounded-[12px] px-3 py-2 text-xs font-mono font-bold text-[#0A143A]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gradient Background */}
                  {config.backgroundType === 'gradient' && (
                    <div className="bg-white/80 p-4 rounded-[20px] border border-[#132A86]/10 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#4A577D] mb-1">
                            {lang === 'uz' ? '1-Fon Rangi' : 'Bg Color 1'}
                          </label>
                          <input
                            type="color"
                            value={config.bgGradientColor1}
                            onChange={(e) => setConfig({ ...config, bgGradientColor1: e.target.value })}
                            className="w-full h-10 rounded-[10px] border cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#4A577D] mb-1">
                            {lang === 'uz' ? '2-Fon Rangi' : 'Bg Color 2'}
                          </label>
                          <input
                            type="color"
                            value={config.bgGradientColor2}
                            onChange={(e) => setConfig({ ...config, bgGradientColor2: e.target.value })}
                            className="w-full h-10 rounded-[10px] border cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Background */}
                  {config.backgroundType === 'image' && (
                    <div className="bg-white/80 p-4 rounded-[20px] border border-[#132A86]/10 space-y-3">
                      <input
                        ref={bgFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleBgImageUpload(e.target.files[0]);
                          }
                        }}
                      />
                      <div
                        onClick={() => bgFileInputRef.current?.click()}
                        className="p-5 rounded-[18px] border-2 border-dashed border-[#132A86]/20 bg-white/70 text-center cursor-pointer hover:bg-white"
                      >
                        <Upload className="w-6 h-6 text-[#132A86] mx-auto mb-1" />
                        <span className="text-xs font-bold text-[#0A143A] block">
                          {lang === 'uz' ? 'Orqa fon rasmini yuklash (JPG/PNG)' : 'Upload Background Image (JPG/PNG)'}
                        </span>
                      </div>

                      {config.bgImageUrl && (
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>{lang === 'uz' ? 'Rasm Shaffofligi (Opacity)' : 'Image Opacity'}</span>
                            <span className="font-mono">{Math.round(config.bgImageOpacity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={config.bgImageOpacity}
                            onChange={(e) => setConfig({ ...config, bgImageOpacity: Number(e.target.value) })}
                            className="w-full accent-[#132A86] cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Real-time Contrast Score & Warning */}
                  <div className="pt-2 border-t border-[#132A86]/10">
                    <ContrastWarning config={config} onAutoFix={autoFixContrast} />
                  </div>
                </div>
              )}

              {/* Tab 6: Logo */}
              {activeTab === 'logo' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Custom Logo Upload Drag and Drop */}
                  <div>
                    <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                      {t.builder.logo.uploadButton}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleLogoUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <div
                      onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleLogoUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full p-5 rounded-[20px] border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center ${
                        dragActive
                          ? 'border-[#1FD0C2] bg-[#EEF6FF]'
                          : 'border-[#132A86]/20 bg-white/60 hover:bg-white'
                      }`}
                    >
                      <Upload className="w-7 h-7 text-[#132A86] mb-2" />
                      <span className="text-xs font-bold text-[#0A143A]">
                        {config.customLogoFileName || t.builder.logo.uploadButton}
                      </span>
                      <span className="text-[10px] text-[#4A577D] mt-0.5">
                        {t.builder.logo.supportedFormats}
                      </span>
                    </div>

                    {config.logoType === 'custom' && (
                      <button
                        type="button"
                        onClick={() => setConfig({ ...config, logoType: 'none', customLogoUrl: null, customLogoFileName: null })}
                        className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        {t.builder.logo.removeLogo}
                      </button>
                    )}
                  </div>

                  {/* Popular Brand Presets */}
                  <div>
                    <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                      {t.builder.logo.presetLogos}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {PRESET_LOGOS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setConfig({
                            ...config,
                            logoType: 'preset',
                            presetLogoId: item.id
                          })}
                          className={`p-2.5 rounded-[14px] border text-center text-xs font-bold transition-all cursor-pointer ${
                            config.logoType === 'preset' && config.presetLogoId === item.id
                              ? 'border-[#132A86] bg-[#EEF6FF] text-[#132A86] shadow-sm'
                              : 'border-gray-200 bg-white/70 hover:bg-white text-[#0A143A]'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo Sizing and Safe Zone */}
                  {config.logoType !== 'none' && (
                    <div className="bg-white/80 p-4 rounded-[20px] border border-[#132A86]/10 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#132A86] uppercase">{t.builder.logo.logoSize}</span>
                          <span className="font-mono">{config.logoSize}%</span>
                        </div>
                        <input
                          type="range"
                          min={12}
                          max={32}
                          value={config.logoSize}
                          onChange={(e) => setConfig({ ...config, logoSize: Number(e.target.value) })}
                          className="w-full accent-[#132A86] cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0A143A]">
                          {t.builder.logo.safeZone}
                        </span>
                        <input
                          type="checkbox"
                          checked={config.logoBgPadding}
                          onChange={(e) => setConfig({ ...config, logoBgPadding: e.target.checked })}
                          className="w-4 h-4 accent-[#132A86] rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* Live Preview Column (Mobile: order-1 top, Desktop: order-2 right lg:col-span-5) */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="liquid-glass-elevated rounded-[26px] sm:rounded-[36px] p-4 sm:p-7 border border-white/90 shadow-xl">
              
              {/* Preview Header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-[#132A86]/8">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1FD0C2] animate-pulse" />
                  <span className="text-xs font-bold text-[#132A86] uppercase tracking-wider">
                    {t.common.livePreview}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {lang === 'uz' ? '100% Bepul' : '100% Free'}
                </span>
              </div>

              {/* Main SVG Render Display */}
              <div className="bg-white rounded-[22px] sm:rounded-[28px] p-2.5 sm:p-4 flex items-center justify-center mb-4 sm:mb-5 shadow-[inset_0_1px_3px_rgba(19,42,134,0.04)] border border-[#132A86]/6">
                <div className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px] flex items-center justify-center">
                  <QRRenderer value={qrValue} config={config} sizePx={260} svgId="scanforge-preview-svg" />
                </div>
              </div>

              {/* Quick Contrast Readability Ribbon */}
              <div className="mb-3.5 sm:mb-4">
                <ContrastWarning config={config} onAutoFix={autoFixContrast} />
              </div>

              {/* Big Primary Action: Open Liquid Glass Export Modal */}
              <button
                type="button"
                id="builder-download-btn"
                onClick={() => setExportModalOpen(true)}
                className="apple-glass-cta w-full py-3.5 sm:py-4 px-3 rounded-[18px] sm:rounded-[20px] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer mb-2.5 sm:mb-3 shadow-lg hover:shadow-xl transition-all touch-manipulation min-h-[46px]"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#1FD0C2]" />
                <span className="truncate">
                  {lang === 'uz' ? 'Yuklab Olish (PNG, JPG, PDF, SVG)' : 'Export & Download (PNG, JPG, PDF, SVG)'}
                </span>
              </button>

              {/* Secondary Action Grid: Copy, Share, Save */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="apple-glass-secondary py-2.5 rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  title={t.builder.export.copyClipboard}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t.common.copied : t.common.copy}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="apple-glass-secondary py-2.5 rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  title={t.builder.export.shareDesign}
                >
                  {shared ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{shared ? t.common.copied : t.common.share}</span>
                </button>

                <button
                  type="button"
                  onClick={onSaveToHistory}
                  className="apple-glass-secondary py-2.5 rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  title={t.builder.export.saveToHistory}
                >
                  {saveSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-[#132A86]" />
                  )}
                  <span>{saveSuccess ? t.common.saved : t.common.save}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Liquid Glass Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        qrValue={qrValue}
        config={config}
        onSuccessToast={(fmt, res) => {
          onShowToast(
            lang === 'uz' ? 'Muvaffaqiyatli yuklab olindi!' : 'Downloaded successfully!',
            `${fmt} (${res}px) — ${lang === 'uz' ? 'Fayl kompyuteringizga saqlandi.' : 'File saved to your device.'}`,
            'success'
          );
        }}
      />
    </section>
  );
};
