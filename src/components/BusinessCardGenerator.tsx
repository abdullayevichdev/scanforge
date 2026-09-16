import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../context/LanguageContext';
import { downloadCanvasAsImage, downloadCanvasAsPDF } from '../utils/cardExportUtils';
import { 
  CreditCard, 
  Download, 
  Sparkles, 
  Phone, 
  Mail, 
  Globe, 
  Send, 
  Instagram, 
  Building2, 
  User, 
  Briefcase,
  Check,
  FileText
} from 'lucide-react';

export interface BusinessCardData {
  name: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  telegram: string;
  instagram: string;
  template: 'executive' | 'minimal' | 'glass' | 'midnight';
}

const INITIAL_CARD: BusinessCardData = {
  name: 'Abdulhay Avazxanov',
  jobTitle: 'Lead Software Architect',
  company: 'ScanForge Technologies',
  phone: '+998933223580',
  email: 'contact@scanforge.uz',
  website: 'https://scanforge.uz',
  telegram: 'avazxanovvv_700',
  instagram: 'avazxanovvv_700',
  template: 'executive',
};

interface BusinessCardGeneratorProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const BusinessCardGenerator: React.FC<BusinessCardGeneratorProps> = ({ onShowToast }) => {
  const { lang } = useLanguage();
  const [data, setData] = useState<BusinessCardData>(INITIAL_CARD);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate vCard format string
  const vCardString = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    `TITLE:${data.jobTitle}`,
    `ORG:${data.company}`,
    `TEL;TYPE=CELL:${data.phone}`,
    `EMAIL:${data.email}`,
    `URL:${data.website}`,
    'END:VCARD',
  ].join('\n');

  // Generate QR Code data URL when data changes (Standard classic black & white QR code for 100% scanning reliability)
  useEffect(() => {
    QRCode.toDataURL(vCardString, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then(setQrDataUrl)
      .catch((err) => console.error('Error generating card QR:', err));
  }, [vCardString]);

  // Render Card to High-Res Canvas for Live Preview & Export
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !qrDataUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas: 1050 x 600 px (3.5" x 2.0" @ 300 DPI ratio)
    const W = 1050;
    const H = 600;
    canvas.width = W;
    canvas.height = H;

    // 1. Draw Background based on template
    if (data.template === 'executive') {
      // Deep Navy gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#0F1D4A');
      grad.addColorStop(1, '#1A337E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle cyan accent bar
      ctx.fillStyle = '#1FD0C2';
      ctx.fillRect(0, 0, 16, H);

      // Decorative diagonal subtle line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W * 0.6, 0);
      ctx.lineTo(W * 0.45, H);
      ctx.stroke();
    } else if (data.template === 'minimal') {
      // Clean off-white
      ctx.fillStyle = '#FAFBFC';
      ctx.fillRect(0, 0, W, H);

      // Delicate border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, W - 12, H - 12);

      // Accent pill
      ctx.fillStyle = '#132A86';
      ctx.fillRect(60, 60, 8, 80);
    } else if (data.template === 'glass') {
      // Soft Liquid Glass gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#E8F1FC');
      grad.addColorStop(1, '#F5F9FF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Glass frost card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillRect(30, 30, W - 60, H - 60);

      // Glass gradient border
      ctx.strokeStyle = '#1FD0C2';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, W - 60, H - 60);
    } else {
      // Midnight Luxury
      ctx.fillStyle = '#090D1A';
      ctx.fillRect(0, 0, W, H);

      // Glowing mesh gradient circle
      const rad = ctx.createRadialGradient(W * 0.85, H * 0.2, 50, W * 0.85, H * 0.2, 350);
      rad.addColorStop(0, 'rgba(0, 242, 254, 0.2)');
      rad.addColorStop(1, 'rgba(9, 13, 26, 0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, W, H);

      // Neon accent line
      ctx.fillStyle = '#00F2FE';
      ctx.fillRect(0, H - 12, W, 12);
    }

    // 2. Draw Typography & Information
    const isDark = data.template === 'executive' || data.template === 'midnight';
    const primaryColor = isDark ? '#FFFFFF' : '#0A143A';
    const secondaryColor = isDark ? '#94A3B8' : '#475569';
    const accentColor = data.template === 'midnight' ? '#00F2FE' : '#1FD0C2';

    // Name
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(data.name || 'Your Full Name', 70, 110);

    // Job Title
    ctx.fillStyle = accentColor;
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(data.jobTitle ? data.jobTitle.toUpperCase() : 'JOB TITLE', 70, 155);

    // Company
    ctx.fillStyle = secondaryColor;
    ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(data.company || 'Company Name', 70, 190);

    // Divider
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(19, 42, 134, 0.1)';
    ctx.fillRect(70, 220, 520, 2);

    // Contact Details
    let lineY = 270;
    const lineHeight = 46;

    ctx.font = '400 21px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = primaryColor;

    if (data.phone) {
      ctx.fillStyle = accentColor;
      ctx.fillText('📞', 70, lineY);
      ctx.fillStyle = primaryColor;
      ctx.fillText(data.phone, 115, lineY);
      lineY += lineHeight;
    }

    if (data.email) {
      ctx.fillStyle = accentColor;
      ctx.fillText('✉️', 70, lineY);
      ctx.fillStyle = primaryColor;
      ctx.fillText(data.email, 115, lineY);
      lineY += lineHeight;
    }

    if (data.website) {
      ctx.fillStyle = accentColor;
      ctx.fillText('🌐', 70, lineY);
      ctx.fillStyle = primaryColor;
      ctx.fillText(data.website.replace(/^https?:\/\//, ''), 115, lineY);
      lineY += lineHeight;
    }

    if (data.telegram || data.instagram) {
      const socials = [
        data.telegram ? `@${data.telegram.replace('@', '')}` : '',
        data.instagram ? `IG: @${data.instagram.replace('@', '')}` : '',
      ].filter(Boolean).join('  •  ');
      ctx.fillStyle = secondaryColor;
      ctx.font = '500 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`💬  ${socials}`, 70, lineY);
    }

    // 3. Draw QR Code Container on Right
    const qrImg = new Image();
    qrImg.onload = () => {
      const qrBoxSize = 250;
      const qrX = W - qrBoxSize - 70;
      const qrY = (H - qrBoxSize) / 2;

      // Card plate behind QR
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(qrX - 12, qrY - 12, qrBoxSize + 24, qrBoxSize + 48, 20);
      ctx.fill();

      // Shadow border
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(19, 42, 134, 0.08)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw QR Image
      ctx.drawImage(qrImg, qrX, qrY, qrBoxSize, qrBoxSize);

      // "SCAN VCARD" label beneath QR
      ctx.fillStyle = '#132A86';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lang === 'uz' ? 'KONTAKTNI SAQLASH' : 'SCAN TO SAVE VCARD', qrX + qrBoxSize / 2, qrY + qrBoxSize + 24);
      ctx.textAlign = 'left';
    };
    qrImg.src = qrDataUrl;
  }, [data, qrDataUrl, lang]);

  const handleExport = (format: 'png' | 'jpg' | 'pdf') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    const filename = `BusinessCard_${(data.name || 'contact').replace(/\s+/g, '_')}`;

    setTimeout(() => {
      try {
        if (format === 'png' || format === 'jpg') {
          downloadCanvasAsImage(canvas, filename, format);
        } else {
          // Standard business card size: 85 x 55 mm
          downloadCanvasAsPDF(canvas, filename, {
            orientation: 'landscape',
            format: [85, 55],
          });
        }
        onShowToast?.(
          lang === 'uz' ? 'Vizitka yuklab olindi' : 'Business card exported',
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
    <section id="business-card" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-semibold text-[#132A86] mb-3">
            <CreditCard className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'Raqamli & Chop etish uchun Vizitka' : 'Digital & Print Business Card'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-3">
            {lang === 'uz' ? 'Professional Vizitka Generatori' : 'Business Card Generator'}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D]">
            {lang === 'uz'
              ? 'Kontaktlaringizni kiriting, dizayn shablonini tanlang va bir zumda chop etishga tayyor vCard vizitkani yuklab oling.'
              : 'Enter your credentials, choose an executive template, and export a print-ready vCard business card in seconds.'}
          </p>
        </div>

        {/* Studio Grid: Controls on Left, Live Canvas Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 liquid-glass rounded-[28px] p-6 sm:p-7 border border-white/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0A143A] flex items-center gap-2 pb-3 border-b border-[#132A86]/8">
              <User className="w-4 h-4 text-[#132A86]" />
              <span>{lang === 'uz' ? 'Vizitka Ma\'lumotlari' : 'Contact Information'}</span>
            </h3>

            {/* Template Selector */}
            <div>
              <label className="text-xs font-semibold text-[#0A143A] mb-2 block">
                {lang === 'uz' ? 'Dizayn Shabloni' : 'Template Style'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'executive', name: 'Executive Navy', desc: lang === 'uz' ? "Ko'k & Tilla" : 'Navy & Gold' },
                  { id: 'minimal', name: 'Minimal White', desc: lang === 'uz' ? 'Oq & Klassik' : 'Clean & Classic' },
                  { id: 'glass', name: 'Liquid Glass', desc: lang === 'uz' ? 'Zamonaviy Muz' : 'Modern Frost' },
                  { id: 'midnight', name: 'Midnight Neon', desc: lang === 'uz' ? 'Qora & Kiber' : 'Dark Cyber' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setData({ ...data, template: tpl.id as any })}
                    className={`p-2.5 rounded-[16px] text-left border transition-all cursor-pointer ${
                      data.template === tpl.id
                        ? 'bg-[#132A86] text-white border-[#132A86] shadow-sm'
                        : 'bg-white/70 text-[#0A143A] border-[#132A86]/10 hover:bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{tpl.name}</p>
                    <p className={`text-[10px] mt-0.5 ${data.template === tpl.id ? 'text-white/80' : 'text-[#4A577D]'}`}>
                      {tpl.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-medium text-[#4A577D] block mb-1">
                  {lang === 'uz' ? 'To\'liq Ism-sharif' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                    placeholder="Abdulhay Avazxanov"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#4A577D] block mb-1">
                    {lang === 'uz' ? 'Lavozim' : 'Job Title'}
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={data.jobTitle}
                      onChange={(e) => setData({ ...data, jobTitle: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                      placeholder="Software Architect"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#4A577D] block mb-1">
                    {lang === 'uz' ? 'Kompaniya' : 'Company'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={data.company}
                      onChange={(e) => setData({ ...data, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                      placeholder="ScanForge"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#4A577D] block mb-1">
                    {lang === 'uz' ? 'Telefon raqami' : 'Phone'}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={data.phone}
                      onChange={(e) => setData({ ...data, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                      placeholder="+998 93 322 35 80"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#4A577D] block mb-1">
                    {lang === 'uz' ? 'Email manzili' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                      placeholder="contact@domain.uz"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#4A577D] block mb-1">
                  {lang === 'uz' ? 'Veb-sayt' : 'Website'}
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={data.website}
                    onChange={(e) => setData({ ...data, website: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                    placeholder="https://scanforge.uz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#4A577D] block mb-1">Telegram</label>
                  <div className="relative">
                    <Send className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={data.telegram}
                      onChange={(e) => setData({ ...data, telegram: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                      placeholder="username"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#4A577D] block mb-1">Instagram</label>
                  <div className="relative">
                    <Instagram className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={data.instagram}
                      onChange={(e) => setData({ ...data, instagram: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Live Card Preview & Export Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Visual Canvas Display Frame */}
            <div className="w-full liquid-glass-elevated rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-lg flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-[#132A86]/8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#132A86] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
                  {lang === 'uz' ? 'Jonli Vizitka Ko\'rinishi (300 DPI)' : 'Live High-Res Preview (300 DPI)'}
                </span>
                <span className="text-[11px] font-mono text-[#4A577D]">
                  {lang === 'uz' ? '85mm × 55mm (Standart)' : '85mm × 55mm (Standard)'}
                </span>
              </div>

              {/* Canvas rendered element */}
              <div className="w-full overflow-hidden rounded-[20px] shadow-md border border-black/5 flex justify-center bg-slate-900/5">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto max-w-[620px] rounded-[18px] object-contain"
                />
              </div>

              {/* Export Buttons */}
              <div className="w-full mt-6 pt-5 border-t border-[#132A86]/8">
                <p className="text-xs font-semibold text-[#0A143A] mb-3 text-center">
                  {lang === 'uz' ? 'Chop etish yoki raqamli ulashish uchun yuklab oling:' : 'Export for printing or digital sharing:'}
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExport('png')}
                    className="apple-glass-secondary py-3 px-4 rounded-[16px] text-xs font-bold text-[#132A86] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <Download className="w-4 h-4" />
                    <span>PNG (4K)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExport('jpg')}
                    className="apple-glass-secondary py-3 px-4 rounded-[16px] text-xs font-bold text-[#132A86] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <Download className="w-4 h-4" />
                    <span>JPG (Clean)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExport('pdf')}
                    className="apple-glass-primary py-3 px-4 rounded-[16px] text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <FileText className="w-4 h-4" />
                    <span>PDF (Print 85×55)</span>
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
