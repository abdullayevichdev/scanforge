import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../context/LanguageContext';
import { QRRenderer } from './QRRenderer';
import { QRStyleConfig } from '../types';
import { 
  FileImage, 
  Download, 
  Sparkles, 
  Layers, 
  Type, 
  Palette, 
  Check, 
  Calendar, 
  MapPin, 
  Tag, 
  Utensils, 
  Wifi, 
  Briefcase 
} from 'lucide-react';

interface PosterCreatorProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

type PosterTheme = 'corporate' | 'event' | 'sale' | 'cafe' | 'wifi';

export const PosterCreator: React.FC<PosterCreatorProps> = ({ onShowToast }) => {
  const { lang } = useLanguage();

  const [theme, setTheme] = useState<PosterTheme>('event');
  const [headline, setHeadline] = useState(lang === 'uz' ? 'Yillik Texnologiya Konferensiyasi' : 'Annual Tech Innovation Summit');
  const [subheadline, setSubheadline] = useState(lang === 'uz' ? 'Kelajak texnologiyalari va sun\'iy intellekt' : 'Exploring the Next Era of Modern Software');
  const [dateInfo, setDateInfo] = useState('25-26 October, 2026');
  const [locationInfo, setLocationInfo] = useState('Tashkent City Congress Hall');
  const [ctaText, setCtaText] = useState(lang === 'uz' ? 'Ro\'yxatdan o\'tish uchun skanerlang' : 'SCAN TO REGISTER');
  const [qrUrl, setQrUrl] = useState('https://scanforge.uz/summit');
  const [accentColor, setAccentColor] = useState('#132A86');
  const [exporting, setExporting] = useState(false);

  const posterPreviewRef = useRef<HTMLDivElement | null>(null);

  const posterQRConfig: QRStyleConfig = {
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded',
    eyeInnerStyle: 'rounded',
    colorType: 'solid',
    foregroundSolid: accentColor,
    gradientColor1: accentColor,
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
    eyeOuterColor: accentColor,
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
    frameColor: accentColor,
    frameTextColor: '#FFFFFF',
    errorCorrectionLevel: 'H',
    margin: 2,
    sizeScale: 1,
  };

  const handleApplyPreset = (preset: PosterTheme) => {
    setTheme(preset);
    if (preset === 'event') {
      setHeadline(lang === 'uz' ? 'Yillik Innovatsiya Sammiti' : 'Annual Tech Innovation Summit');
      setSubheadline(lang === 'uz' ? 'Texnologiyalar va kelajak startaplari' : 'Exploring the Next Era of Modern Software');
      setDateInfo('25-26 October, 2026');
      setLocationInfo('Tashkent City Congress Hall');
      setCtaText(lang === 'uz' ? 'Ro\'yxatdan o\'tish uchun skanerlang' : 'SCAN TO REGISTER');
      setAccentColor('#132A86');
    } else if (preset === 'sale') {
      setHeadline(lang === 'uz' ? 'Katta Mavsumiy Chegirma -50%' : 'MEGA SEASON SALE 50% OFF');
      setSubheadline(lang === 'uz' ? 'Barcha yangi to\'plamlar uchun maxsus taklif' : 'Exclusive VIP Discount on All New Collections');
      setDateInfo(lang === 'uz' ? 'Cheklangan vaqt' : 'Limited Time Offer');
      setLocationInfo(lang === 'uz' ? 'Barcha ScanForge do\'konlarida' : 'Available In-Store & Online');
      setCtaText(lang === 'uz' ? 'Kuponni olish uchun skanerlang' : 'SCAN TO CLAIM PROMO');
      setAccentColor('#DC2626');
    } else if (preset === 'cafe') {
      setHeadline(lang === 'uz' ? 'Artisan Qahva & Shiringliklar' : 'Artisan Coffee & Bakery');
      setSubheadline(lang === 'uz' ? 'Tabiiy donalardan tayyorlangan lazzatli qahva' : 'Freshly Roasted Beans & Homemade Pastries');
      setDateInfo('Har kuni: 08:00 - 23:00');
      setLocationInfo('Amir Temur shoh ko\'chasi, 42');
      setCtaText(lang === 'uz' ? 'Menyuni ko\'rish uchun skanerlang' : 'SCAN TO VIEW MENU');
      setAccentColor('#854D0E');
    } else if (preset === 'wifi') {
      setHeadline(lang === 'uz' ? 'Mehmonlar Uchun Bepul Wi-Fi' : 'Complimentary Guest Wi-Fi');
      setSubheadline(lang === 'uz' ? 'Tezkor va xavfsiz optik tolali internet' : 'High-speed Fiber Wireless Internet Connection');
      setDateInfo('SSID: ScanForge_Guest_5G');
      setLocationInfo('Parolsiz / Avtomatik ulanish');
      setCtaText(lang === 'uz' ? 'Darhol ulanish uchun skanerlang' : 'SCAN TO CONNECT WI-FI');
      setAccentColor('#0D9488');
    } else {
      setHeadline(lang === 'uz' ? 'Biznes Hamkorlik & Xizmatlar' : 'Enterprise Solutions & Services');
      setSubheadline(lang === 'uz' ? 'Kompaniyangiz uchun raqamli transformatsiya' : 'Transforming Business Through Digital Excellence');
      setDateInfo('ScanForge Business Suite');
      setLocationInfo('www.scanforge.uz');
      setCtaText(lang === 'uz' ? 'Batafsil ma\'lumot uchun skanerlang' : 'SCAN FOR DETAILS');
      setAccentColor('#1E1B4B');
    }
  };

  const handleExportPoster = async (format: 'png' | 'pdf') => {
    if (!posterPreviewRef.current) return;
    setExporting(true);

    try {
      const container = posterPreviewRef.current;
      const width = 1200;
      const height = 1600;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (theme === 'sale') {
        bgGrad.addColorStop(0, '#FEF2F2');
        bgGrad.addColorStop(1, '#FEE2E2');
      } else if (theme === 'cafe') {
        bgGrad.addColorStop(0, '#FEFCE8');
        bgGrad.addColorStop(1, '#FEF3C7');
      } else if (theme === 'wifi') {
        bgGrad.addColorStop(0, '#F0FDFA');
        bgGrad.addColorStop(1, '#CCFBF1');
      } else {
        bgGrad.addColorStop(0, '#FFFFFF');
        bgGrad.addColorStop(1, '#EEF6FF');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw decorative header banner
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(60, 60, width - 120, 16, 8);
      ctx.fill();

      // Draw Title
      ctx.fillStyle = '#0A143A';
      ctx.font = 'bold 56px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(headline, width / 2, 220, width - 180);

      // Draw Subtitle
      ctx.fillStyle = '#4A577D';
      ctx.font = '32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(subheadline, width / 2, 290, width - 200);

      // Draw details box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.roundRect(140, 350, width - 280, 120, 24);
      ctx.fill();

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${dateInfo}  •  ${locationInfo}`, width / 2, 420);

      // Render QR code onto poster canvas
      const svgElement = container.querySelector('svg');
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const blobURL = (window.URL || window.webkitURL).createObjectURL(svgBlob);

        const qrImg = new Image();
        await new Promise((resolve) => {
          qrImg.onload = resolve;
          qrImg.src = blobURL;
        });

        // Draw QR Container Card
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(19, 42, 134, 0.12)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 16;
        ctx.beginPath();
        ctx.roundRect(width / 2 - 280, 530, 560, 640, 36);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Draw QR Code Image
        ctx.drawImage(qrImg, width / 2 - 220, 570, 440, 440);

        // Draw CTA text inside QR card
        ctx.fillStyle = accentColor;
        ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(ctaText, width / 2, 1090);

        (window.URL || window.webkitURL).revokeObjectURL(blobURL);
      }

      // Draw Brand Footer
      ctx.fillStyle = '#132A86';
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SCANFORGE  •  FREE HIGH-RESOLUTION QR CODES', width / 2, 1460);

      if (format === 'png') {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `ScanForge_Poster_${theme}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        pdf.save(`ScanForge_Poster_${theme}.pdf`);
      }

      onShowToast?.(
        lang === 'uz' ? 'Poster muvaffaqiyatli saqlandi!' : 'Poster exported successfully!',
        `${format.toUpperCase()} formatida yuklab olindi`,
        'success'
      );
    } catch (err) {
      console.error('Poster export error:', err);
      onShowToast?.(
        lang === 'uz' ? 'Eksportda xatolik yuz berdi' : 'Export failed',
        undefined,
        'warning'
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <section id="poster-creator" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-bold text-[#132A86] mb-2.5">
            <FileImage className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'Poster va Flayer Studiyasi' : 'Poster & Flyer Studio'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-2">
            {lang === 'uz' ? 'Bosma Posterlar va E\'lonlar Yarating' : 'Create Printable Posters with QR Codes'}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D]">
            {lang === 'uz'
              ? 'Tadbirlar, chegirmalar, menyu va Wi-Fi stendlari uchun A4 formatidagi chiroyli posterlarni yarating va PDF yoki PNG formatda chop eting.'
              : 'Design ready-to-print posters for events, sales, menus, and Wi-Fi signages. Export in ultra HD PNG or print-ready PDF.'}
          </p>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Theme Selector */}
            <div className="liquid-glass rounded-[26px] p-5 border border-white/90 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#132A86] block">
                {lang === 'uz' ? 'Poster Mavzusini Tanlang' : 'Choose Poster Theme'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'event', label: lang === 'uz' ? 'Tadbir / Sammit' : 'Event / Summit', icon: Calendar },
                  { id: 'sale', label: lang === 'uz' ? 'Aksiya / Chegirma' : 'Sale / Discount', icon: Tag },
                  { id: 'cafe', label: lang === 'uz' ? 'Kafe & Restoran' : 'Cafe & Restaurant', icon: Utensils },
                  { id: 'wifi', label: lang === 'uz' ? 'Wi-Fi Stend' : 'Wi-Fi Sign', icon: Wifi },
                  { id: 'corporate', label: lang === 'uz' ? 'Biznes / Kompaniya' : 'Corporate', icon: Briefcase },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleApplyPreset(item.id as PosterTheme)}
                      className={`p-3 rounded-[18px] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[#132A86] text-white border-[#132A86] shadow-sm'
                          : 'bg-white/80 text-[#0A143A] border-[#132A86]/10 hover:bg-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#1FD0C2]' : 'text-[#132A86]'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Fields */}
            <div className="liquid-glass rounded-[26px] p-5 sm:p-6 border border-white/90 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#132A86] block">
                {lang === 'uz' ? 'Poster Matnlari' : 'Poster Content & Details'}
              </span>

              <div>
                <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                  {lang === 'uz' ? 'Asosiy Sarlavha' : 'Main Headline'}
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-white border border-[#132A86]/15 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                  {lang === 'uz' ? 'Qo\'shimcha Tavsif' : 'Subheadline / Description'}
                </label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full bg-white border border-[#132A86]/15 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                    {lang === 'uz' ? 'Vaqt / Sana' : 'Date / Detail'}
                  </label>
                  <input
                    type="text"
                    value={dateInfo}
                    onChange={(e) => setDateInfo(e.target.value)}
                    className="w-full bg-white border border-[#132A86]/15 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                    {lang === 'uz' ? 'Manzil / Joy' : 'Location / Place'}
                  </label>
                  <input
                    type="text"
                    value={locationInfo}
                    onChange={(e) => setLocationInfo(e.target.value)}
                    className="w-full bg-white border border-[#132A86]/15 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                  {lang === 'uz' ? 'QR Kod Havolasi (URL / Ma\'lumot)' : 'QR Code Destination Link'}
                </label>
                <input
                  type="text"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  className="w-full bg-white border border-[#132A86]/15 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                  {lang === 'uz' ? 'QR Kod Tagidagi Matn (CTA)' : 'Call To Action Label'}
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-white border border-[#132A86]/15 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                />
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={exporting}
                onClick={() => handleExportPoster('png')}
                className="apple-glass-cta flex-1 py-3.5 rounded-[18px] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4 text-[#1FD0C2]" />
                <span>{lang === 'uz' ? 'PNG Rasm Sifatida Yuklash' : 'Export HD PNG'}</span>
              </button>

              <button
                type="button"
                disabled={exporting}
                onClick={() => handleExportPoster('pdf')}
                className="apple-glass-secondary flex-1 py-3.5 rounded-[18px] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer text-[#132A86]"
              >
                <Download className="w-4 h-4 text-[#132A86]" />
                <span>{lang === 'uz' ? 'A4 PDF Chop Etish' : 'Printable A4 PDF'}</span>
              </button>
            </div>

          </div>

          {/* Poster Live Preview (lg:col-span-6) */}
          <div className="lg:col-span-6 flex justify-center">
            <div 
              ref={posterPreviewRef}
              className="w-full max-w-[420px] aspect-[1/1.38] rounded-[32px] p-6 sm:p-8 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl border border-white/90"
              style={{
                background: theme === 'sale'
                  ? 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)'
                  : theme === 'cafe'
                  ? 'linear-gradient(135deg, #FEFCE8 0%, #FEF3C7 100%)'
                  : theme === 'wifi'
                  ? 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)'
                  : 'linear-gradient(135deg, #FFFFFF 0%, #EEF6FF 100%)'
              }}
            >
              {/* Decorative accent top line */}
              <div 
                className="w-20 h-1.5 rounded-full mb-2" 
                style={{ backgroundColor: accentColor }} 
              />

              {/* Poster Heading */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0A143A] leading-tight tracking-tight mb-1.5">
                  {headline}
                </h3>
                <p className="text-xs text-[#4A577D] font-medium leading-relaxed max-w-xs mx-auto">
                  {subheadline}
                </p>
              </div>

              {/* Event/Info Badge */}
              <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-[16px] border border-black/5 shadow-xs text-xs font-bold flex items-center gap-2" style={{ color: accentColor }}>
                <span>{dateInfo}</span>
                <span>•</span>
                <span>{locationInfo}</span>
              </div>

              {/* QR Code Embedded Display Card */}
              <div className="bg-white rounded-[26px] p-4.5 shadow-[0_12px_32px_rgba(19,42,134,0.08)] border border-black/5 flex flex-col items-center">
                <div className="w-40 h-40 flex items-center justify-center">
                  <QRRenderer value={qrUrl} config={posterQRConfig} sizePx={160} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider mt-2.5" style={{ color: accentColor }}>
                  {ctaText}
                </span>
              </div>

              {/* Poster Footer Brand */}
              <div className="text-[10px] font-bold text-[#132A86]/70 uppercase tracking-widest pt-2">
                SCANFORGE • FREE HD QR STUDIO
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
