import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../context/LanguageContext';
import { downloadCanvasAsImage, downloadCanvasAsPDF } from '../utils/cardExportUtils';
import { 
  UtensilsCrossed, 
  Download, 
  Sparkles, 
  Globe, 
  FileText, 
  Coffee, 
  Wine, 
  Pizza
} from 'lucide-react';

interface RestaurantMenuData {
  restaurantName: string;
  tagline: string;
  menuUrl: string;
  tableNumber: string;
  ctaText: string;
  theme: 'bistro' | 'gastro-modern' | 'golden-luxury' | 'cafe-clean';
}

const INITIAL_MENU: RestaurantMenuData = {
  restaurantName: 'La Bottega Ristorante',
  tagline: 'Artisanal Italian Cuisine & Wine',
  menuUrl: 'https://restaurant.uz/menu',
  tableNumber: '12',
  ctaText: 'Scan for Digital Menu & Daily Specials',
  theme: 'gastro-modern',
};

interface RestaurantMenuGeneratorProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const RestaurantMenuGenerator: React.FC<RestaurantMenuGeneratorProps> = ({ onShowToast }) => {
  const { lang } = useLanguage();
  const [data, setData] = useState<RestaurantMenuData>(INITIAL_MENU);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    QRCode.toDataURL(data.menuUrl || 'https://restaurant.uz/menu', {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 380,
      color: {
        dark: data.theme === 'golden-luxury' ? '#C5A880' : data.theme === 'bistro' ? '#800020' : '#132A86',
        light: '#FFFFFF',
      },
    })
      .then(setQrDataUrl)
      .catch((err) => console.error('Error generating menu QR:', err));
  }, [data.menuUrl, data.theme]);

  // High-Res Portrait Table Tent: 800 x 1100 px
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !qrDataUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 800;
    const H = 1100;
    canvas.width = W;
    canvas.height = H;

    // 1. Draw Background Theme
    if (data.theme === 'gastro-modern') {
      // Liquid Slate / Glass
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#0E172A');
      grad.addColorStop(1, '#1E293B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Card plate
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(40, 40, W - 80, H - 80, 24);
      ctx.fill();

      // Border
      ctx.strokeStyle = '#1FD0C2';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (data.theme === 'golden-luxury') {
      // Black & Warm Gold
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, W, H);

      // Gold dual frame
      ctx.strokeStyle = '#C5A880';
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, W - 72, H - 72);

      ctx.strokeStyle = 'rgba(197, 168, 128, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(48, 48, W - 96, H - 96);
    } else if (data.theme === 'bistro') {
      // Warm Burgundy / Cream
      ctx.fillStyle = '#FCF8F5';
      ctx.fillRect(0, 0, W, H);

      // Top burgundy bar
      ctx.fillStyle = '#6E1226';
      ctx.fillRect(0, 0, W, 24);

      ctx.strokeStyle = '#6E1226';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 45, W - 60, H - 75);
    } else {
      // Clean Cafe
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, W - 60, H - 60);

      ctx.fillStyle = '#132A86';
      ctx.fillRect(40, 40, W - 80, 10);
    }

    // 2. Text & Content
    const isDark = data.theme === 'gastro-modern' || data.theme === 'golden-luxury';
    const primaryColor = isDark ? '#FFFFFF' : '#0A143A';
    const secondaryColor = isDark ? '#94A3B8' : '#64748B';
    const accentColor = data.theme === 'golden-luxury' ? '#C5A880' : data.theme === 'bistro' ? '#6E1226' : '#1FD0C2';

    ctx.textAlign = 'center';

    // Table badge (if entered)
    if (data.tableNumber) {
      const badgeY = 95;
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect((W - 160) / 2, badgeY, 160, 36, 18);
      ctx.fill();

      ctx.fillStyle = data.theme === 'golden-luxury' ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`TABLE  #${data.tableNumber}`, W / 2, badgeY + 24);
    }

    // Restaurant Name
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Georgia", serif';
    ctx.fillText(data.restaurantName || 'Restaurant Name', W / 2, 195);

    // Tagline
    ctx.fillStyle = secondaryColor;
    ctx.font = 'italic 20px -apple-system, BlinkMacSystemFont, "Georgia", serif';
    ctx.fillText(data.tagline || 'Fine Dining & Hospitality', W / 2, 235);

    // Subtle divider
    ctx.fillStyle = accentColor;
    ctx.fillRect((W - 120) / 2, 265, 120, 2);

    // 3. QR Code with card plate
    const qrImg = new Image();
    qrImg.onload = () => {
      const qrSize = 360;
      const qrX = (W - qrSize) / 2;
      const qrY = 320;

      // Card plate behind QR
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48, 28);
      ctx.fill();

      // Delicate border
      ctx.strokeStyle = isDark ? accentColor : 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Call to action
      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(data.ctaText || 'Scan for Digital Menu', W / 2, 770);

      // Helper subtitle
      ctx.fillStyle = secondaryColor;
      ctx.font = '400 18px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(lang === 'uz' ? 'Smartfon kamerasini qaratishingiz kifoya' : 'Point smartphone camera to view', W / 2, 805);

      // Features row at bottom (Touchless, Multilingual, Allergy safe)
      const featsY = 880;
      const featBoxW = 640;
      const featBoxX = (W - featBoxW) / 2;

      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9';
      ctx.beginPath();
      ctx.roundRect(featBoxX, featsY, featBoxW, 80, 16);
      ctx.fill();

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('⚡ CONTACTLESS  •  🌐 MULTILINGUAL  •  ✨ LIVE PRICING', W / 2, featsY + 48);

      // Footer
      ctx.fillStyle = secondaryColor;
      ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Crafted with ScanForge QR Studio', W / 2, H - 70);
    };
    qrImg.src = qrDataUrl;
  }, [data, qrDataUrl, lang]);

  const handleExport = (format: 'png' | 'jpg' | 'pdf') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    const filename = `Menu_QR_${(data.restaurantName || 'table').replace(/\s+/g, '_')}`;

    setTimeout(() => {
      try {
        if (format === 'png' || format === 'jpg') {
          downloadCanvasAsImage(canvas, filename, format);
        } else {
          // Standard A5 Table Tent
          downloadCanvasAsPDF(canvas, filename, {
            orientation: 'portrait',
            format: 'a5',
          });
        }
        onShowToast?.(
          lang === 'uz' ? 'Menyu stendi yuklab olindi' : 'Restaurant menu stand exported',
          `${filename}.${format.toUpperCase()}`,
          'success'
        );
      } catch (err) {
        console.error('Export error:', err);
      } finally {
        setIsExporting(false);
      }
    }, 150);
  };

  return (
    <section id="restaurant-menu" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-semibold text-[#132A86] mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'Stol Usti Menyu Stendi' : 'Restaurant Table Stand QR'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-3">
            {lang === 'uz' ? 'Restoran & Kafe Menyu QR Studiyasi' : 'Restaurant Menu QR Studio'}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D]">
            {lang === 'uz'
              ? 'Onlayn menyu havolangizni kiriting, stol raqamini belgilang va mehmonlar uchun nafis stend tayyorlang.'
              : 'Link to your digital menu, assign table numbers, and generate elegant table tents.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 liquid-glass rounded-[28px] p-6 sm:p-7 border border-white/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0A143A] flex items-center gap-2 pb-3 border-b border-[#132A86]/8">
              <UtensilsCrossed className="w-4 h-4 text-[#132A86]" />
              <span>{lang === 'uz' ? 'Muassasa & Menyu Havolasi' : 'Restaurant Details'}</span>
            </h3>

            {/* Theme Selector */}
            <div>
              <label className="text-xs font-semibold text-[#0A143A] mb-2 block">
                {lang === 'uz' ? 'Muassasa Uslubi' : 'Atmosphere Style'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'gastro-modern', name: 'Gastro Modern', desc: lang === 'uz' ? 'Qora & Neokosmik' : 'Dark & Modern' },
                  { id: 'golden-luxury', name: 'Golden Luxury', desc: lang === 'uz' ? 'Premium Tilla' : 'Gold & Luxury' },
                  { id: 'bistro', name: 'French Bistro', desc: lang === 'uz' ? 'Klassik Vino' : 'Classic Wine' },
                  { id: 'cafe-clean', name: 'Clean Cafe', desc: lang === 'uz' ? 'Oq & Minimal' : 'Light & Minimal' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setData({ ...data, theme: th.id as any })}
                    className={`p-2.5 rounded-[14px] text-left border text-xs transition-all cursor-pointer ${
                      data.theme === th.id
                        ? 'bg-[#132A86] text-white border-[#132A86]'
                        : 'bg-white/70 text-[#0A143A] border-[#132A86]/10 hover:bg-white'
                    }`}
                  >
                    <p className="font-bold">{th.name}</p>
                    <p className={`text-[10px] ${data.theme === th.id ? 'text-white/80' : 'text-[#4A577D]'}`}>{th.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div>
              <label className="text-xs font-medium text-[#4A577D] block mb-1">
                {lang === 'uz' ? 'Restoran / Kafe Nomi' : 'Restaurant Name'}
              </label>
              <input
                type="text"
                value={data.restaurantName}
                onChange={(e) => setData({ ...data, restaurantName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                placeholder="La Bottega"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#4A577D] block mb-1">
                {lang === 'uz' ? 'Shior / Tavsif' : 'Tagline / Cuisine'}
              </label>
              <input
                type="text"
                value={data.tagline}
                onChange={(e) => setData({ ...data, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                placeholder="Artisanal Italian Cuisine"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#4A577D] block mb-1">
                {lang === 'uz' ? 'Raqamli Menyu Havolasi (URL)' : 'Digital Menu URL'}
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                <input
                  type="text"
                  value={data.menuUrl}
                  onChange={(e) => setData({ ...data, menuUrl: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                  placeholder="https://myrestaurant.com/menu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#4A577D] block mb-1">
                  {lang === 'uz' ? 'Stol raqami (ixtiyoriy)' : 'Table Number'}
                </label>
                <input
                  type="text"
                  value={data.tableNumber}
                  onChange={(e) => setData({ ...data, tableNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#4A577D] block mb-1">
                  {lang === 'uz' ? 'Haraktga chorlov (CTA)' : 'Call To Action'}
                </label>
                <input
                  type="text"
                  value={data.ctaText}
                  onChange={(e) => setData({ ...data, ctaText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                  placeholder="Scan for Menu"
                />
              </div>
            </div>

          </div>

          {/* Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full liquid-glass-elevated rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-lg flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-[#132A86]/8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#132A86] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
                  {lang === 'uz' ? 'Stol Stendi Namoyishi' : 'Table Tent Live Preview'}
                </span>
                <span className="text-[11px] font-mono text-[#4A577D]">
                  {lang === 'uz' ? 'A5 / Tik Stol Stendi' : 'A5 / Portrait Table Tent'}
                </span>
              </div>

              <div className="w-full max-w-[400px] rounded-[22px] overflow-hidden shadow-md border border-black/5 bg-slate-900/5">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto rounded-[20px] object-contain"
                />
              </div>

              <div className="w-full mt-6 pt-5 border-t border-[#132A86]/8">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExport('png')}
                    className="apple-glass-secondary py-3 px-4 rounded-[16px] text-xs font-bold text-[#132A86] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <Download className="w-4 h-4" />
                    <span>PNG (High)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExport('jpg')}
                    className="apple-glass-secondary py-3 px-4 rounded-[16px] text-xs font-bold text-[#132A86] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <Download className="w-4 h-4" />
                    <span>JPG</span>
                  </button>

                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExport('pdf')}
                    className="apple-glass-primary py-3 px-4 rounded-[16px] text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <FileText className="w-4 h-4" />
                    <span>PDF (A5 Print)</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
