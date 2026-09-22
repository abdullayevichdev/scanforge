import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import jsQR from 'jsqr';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Scan, 
  Camera, 
  Upload, 
  Copy, 
  ExternalLink, 
  Check, 
  Sparkles, 
  RotateCcw, 
  AlertCircle,
  FileText,
  Link as LinkIcon,
  Wifi,
  Phone,
  Mail,
  User,
  Zap,
  Bookmark
} from 'lucide-react';
import { QRType, QRStyleConfig } from '../types';

interface QRScannerSectionProps {
  onLoadIntoBuilder?: (content: string, type: QRType) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const QRScannerSection: React.FC<QRScannerSectionProps> = ({
  onLoadIntoBuilder,
  onShowToast,
}) => {
  const { lang } = useLanguage();
  const { saveQRRecord } = useAuth();

  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<QRType>('text');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting or switching modes
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const detectQRType = (text: string): QRType => {
    const trimmed = text.trim();
    if (/^https?:\/\//i.test(trimmed)) return 'url';
    if (/^WIFI:/i.test(trimmed)) return 'wifi';
    if (/^tel:/i.test(trimmed) || /^\+?[0-9\s\-()]{7,20}$/.test(trimmed)) return 'phone';
    if (/^mailto:/i.test(trimmed) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'email';
    if (/^BEGIN:VCARD/i.test(trimmed)) return 'vcard';
    if (/^SMSTO:/i.test(trimmed) || /^sms:/i.test(trimmed)) return 'sms';
    if (/^https?:\/\/t\.me\//i.test(trimmed)) return 'telegram';
    if (/^https?:\/\/(www\.)?instagram\.com\//i.test(trimmed)) return 'instagram';
    return 'text';
  };

  const handleResultFound = (data: string) => {
    setScanResult(data);
    const type = detectQRType(data);
    setDetectedType(type);
    setSaved(false);
    onShowToast?.(
      lang === 'uz' ? 'QR Kod muvaffaqiyatli aniqlandi!' : 'QR Code decoded successfully!',
      data.length > 40 ? data.slice(0, 40) + '...' : data,
      'success'
    );
  };

  // Start Camera Stream & Scan Loop
  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        scanFrame();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        lang === 'uz'
          ? 'Kameraga ruxsat berilmadi yoki kamera mavjud emas. Iltimos ruxsatni tekshiring yoki rasm yuklashdan foydalaning.'
          : 'Camera access denied or camera not found. Please check browser permissions or upload an image.'
      );
      setCameraActive(false);
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        handleResultFound(code.data);
        stopCamera();
        return;
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  // Scan from Uploaded Image
  const handleImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data) {
          handleResultFound(code.data);
        } else {
          onShowToast?.(
            lang === 'uz' ? 'QR kod topilmadi' : 'No QR code detected',
            lang === 'uz' ? 'Rasmda aniq ko\'rinadigan QR kod mavjudligiga ishonch hosil qiling.' : 'Please ensure the image contains a clear QR code.',
            'warning'
          );
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast?.(lang === 'uz' ? 'Nusxalandi!' : 'Copied to clipboard!', undefined, 'success');
  };

  const handleOpenLink = () => {
    if (!scanResult) return;
    const url = /^https?:\/\//i.test(scanResult) ? scanResult : `https://${scanResult}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEditInBuilder = () => {
    if (!scanResult || !onLoadIntoBuilder) return;
    onLoadIntoBuilder(scanResult, detectedType);
    const builderEl = document.getElementById('builder');
    if (builderEl) {
      builderEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveScanned = () => {
    if (!scanResult) return;
    saveQRRecord({
      name: `Scanned ${detectedType.toUpperCase()} (${new Date().toLocaleDateString()})`,
      type: detectedType,
      content: scanResult,
      config: {
        dotStyle: 'rounded',
        eyeOuterStyle: 'rounded',
        eyeInnerStyle: 'rounded',
        colorType: 'gradient',
        foregroundSolid: '#132A86',
        gradientColor1: '#132A86',
        gradientColor2: '#1FD0C2',
        gradientAngle: 135,
        gradientType: 'linear',
        backgroundType: 'solid',
        backgroundColor: '#FFFFFF',
        bgGradientColor1: '#FFFFFF',
        bgGradientColor2: '#EEF6FF',
        bgGradientAngle: 135,
        bgImageUrl: null,
        bgImageOpacity: 0.85,
        customEyeColor: true,
        eyeOuterColor: '#132A86',
        eyeInnerColor: '#1FD0C2',
        logoType: 'none',
        presetLogoId: 'link',
        customLogoUrl: null,
        customLogoFileName: null,
        logoSize: 22,
        logoBgShape: 'circle',
        logoBgPadding: true,
        frameStyle: 'none',
        frameText: 'SCAN ME',
        frameColor: '#132A86',
        frameTextColor: '#FFFFFF',
        errorCorrectionLevel: 'Q',
        margin: 2,
        sizeScale: 1,
      },
      favorite: false,
    });
    setSaved(true);
    onShowToast?.(
      lang === 'uz' ? 'Saqlanganlar ro\'yxatiga qo\'shildi!' : 'Saved to your QR collection!',
      undefined,
      'success'
    );
  };

  return (
    <section id="scanner" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-bold text-[#132A86] mb-2.5">
            <Scan className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'QR Skaner Studiyasi' : 'QR Scanner Studio'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-2">
            {lang === 'uz' ? 'QR Kodlarni Kamera yoki Rasm Orqali O\'qing' : 'Decode Any QR via Camera or Image'}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D]">
            {lang === 'uz'
              ? 'Istalgan QR kodni qurilma kamerasi orqali skanerlang yoki rasmini yuklang. Matn, havola, Wi-Fi paroli yoki vizitkani darhol oching.'
              : 'Scan QR codes using your device camera or upload an image file. Instantly extract links, Wi-Fi credentials, text, and vCards.'}
          </p>
        </div>

        {/* Scanner Card */}
        <div className="max-w-3xl mx-auto">
          <div className="liquid-glass-elevated bg-white/95 backdrop-blur-2xl rounded-[26px] sm:rounded-[36px] p-4 sm:p-8 border border-white/90 shadow-xl space-y-5 sm:space-y-6">
            
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-[16px] sm:rounded-[20px] bg-[#EEF6FF]/70 border border-[#132A86]/10 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  setMode('upload');
                  stopCamera();
                }}
                className={`py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-[13px] sm:rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer touch-manipulation min-h-[40px] ${
                  mode === 'upload'
                    ? 'bg-white text-[#132A86] shadow-sm'
                    : 'text-[#4A577D] hover:text-[#0A143A]'
                }`}
              >
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1FD0C2]" />
                <span>{lang === 'uz' ? 'Rasm Yuklash' : 'Upload Image'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('camera');
                  startCamera();
                }}
                className={`py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-[13px] sm:rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer touch-manipulation min-h-[40px] ${
                  mode === 'camera'
                    ? 'bg-white text-[#132A86] shadow-sm'
                    : 'text-[#4A577D] hover:text-[#0A143A]'
                }`}
              >
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1FD0C2]" />
                <span>{lang === 'uz' ? 'Kamera' : 'Live Camera'}</span>
              </button>
            </div>

            {/* Camera Scanner View */}
            {mode === 'camera' && (
              <div className="space-y-4">
                <div className="relative aspect-video max-h-[380px] bg-slate-900 rounded-[28px] overflow-hidden border border-[#132A86]/20 flex items-center justify-center shadow-inner">
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Scanning Crosshair Overlay */}
                  {cameraActive && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-[#1FD0C2]/50 rounded-[28px] relative shadow-[0_0_35px_rgba(31,208,194,0.35)] overflow-hidden">
                        {/* High-Tech Glowing Corner Reticles */}
                        <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-[#1FD0C2] rounded-tl-[14px]" />
                        <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-[#1FD0C2] rounded-tr-[14px]" />
                        <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-[#1FD0C2] rounded-bl-[14px]" />
                        <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-[#1FD0C2] rounded-br-[14px]" />
                        
                        {/* Sweeping Laser Scanner Beam */}
                        <div className="laser-scanner-beam" />

                        {/* Subtle target grid center reticle */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                          <div className="w-8 h-8 border border-white/80 rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}

                  {!cameraActive && (
                    <div className="text-center p-6 text-white space-y-3 z-10">
                      <Camera className="w-10 h-10 text-white/60 mx-auto" />
                      <p className="text-xs text-white/80">
                        {lang === 'uz' ? 'Kamerani ishga tushirish uchun tugmani bosing' : 'Click start to activate camera stream'}
                      </p>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="apple-glass-cta py-2.5 px-5 rounded-[16px] text-xs font-bold cursor-pointer"
                      >
                        {lang === 'uz' ? 'Kamerani Yoqish' : 'Start Camera'}
                      </button>
                    </div>
                  )}
                </div>

                {cameraError && (
                  <div className="p-3.5 rounded-[18px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{cameraError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Image Upload Scanner View */}
            {mode === 'upload' && (
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                  className={`border-2 border-dashed rounded-[28px] p-8 sm:p-12 text-center transition-all ${
                    dragActive
                      ? 'border-[#1FD0C2] bg-[#EEF6FF]'
                      : 'border-[#132A86]/20 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <div className="w-16 h-16 rounded-[24px] bg-[#132A86]/10 text-[#132A86] flex items-center justify-center mx-auto mb-4 shadow-xs">
                    <Upload className="w-8 h-8 text-[#132A86]" />
                  </div>
                  <h4 className="text-base font-extrabold text-[#0A143A] mb-1">
                    {lang === 'uz' ? 'QR kod rasmini yuklang yoki tashlang' : 'Drop your QR code image here'}
                  </h4>
                  <p className="text-xs text-[#4A577D] mb-4 max-w-sm mx-auto">
                    {lang === 'uz' ? 'PNG, JPG, WEBP yoki SVG formatidagi rasmlar qo\'llab-quvvatlanadi.' : 'Supports PNG, JPG, WEBP, or SVG screenshot and camera captures.'}
                  </p>

                  <label className="apple-glass-cta py-3 px-6 rounded-[18px] text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-md">
                    <Upload className="w-4 h-4 text-[#1FD0C2]" />
                    <span>{lang === 'uz' ? 'Faylni Tanlash' : 'Select Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Scan Result Card */}
            <AnimatePresence>
              {scanResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="p-5 sm:p-6 rounded-[26px] bg-white border border-[#132A86]/15 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#132A86]/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#132A86]">
                        {lang === 'uz' ? 'QR Kod Natijasi' : 'Decoded Result'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#132A86]/10 text-[#132A86] uppercase">
                        {detectedType}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {lang === 'uz' ? '100% O\'qildi' : '100% Decoded'}
                    </span>
                  </div>

                  {/* Content Box */}
                  <div className="p-4 rounded-[18px] bg-slate-50 border border-slate-200/80 font-mono text-xs text-[#0A143A] break-all select-all leading-relaxed max-h-40 overflow-y-auto">
                    {scanResult}
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCopy}
                      className="apple-glass-secondary py-2.5 px-4 rounded-[14px] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#132A86]" />}
                      <span>{copied ? (lang === 'uz' ? 'Nusxalandi' : 'Copied') : (lang === 'uz' ? 'Nusxa Olish' : 'Copy Text')}</span>
                    </motion.button>

                    {detectedType === 'url' && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleOpenLink}
                        className="apple-glass-secondary py-2.5 px-4 rounded-[14px] text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[#132A86]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{lang === 'uz' ? 'Havolaga O\'tish' : 'Open Link'}</span>
                      </motion.button>
                    )}

                    {onLoadIntoBuilder && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleEditInBuilder}
                        className="apple-glass-cta py-2.5 px-4 rounded-[14px] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#1FD0C2]" />
                        <span>{lang === 'uz' ? 'Konstruktorda Qayta Dizayn Qilish' : 'Restyle in Builder'}</span>
                      </motion.button>
                    )}

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSaveScanned}
                      className="apple-glass-secondary py-2.5 px-4 rounded-[14px] text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
                    >
                      {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-[#132A86]" />}
                      <span>{saved ? (lang === 'uz' ? 'Saqlandi' : 'Saved') : (lang === 'uz' ? 'Saqlab Qo\'yish' : 'Save QR')}</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
};
