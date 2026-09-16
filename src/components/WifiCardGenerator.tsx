import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../context/LanguageContext';
import { downloadCanvasAsImage, downloadCanvasAsPDF } from '../utils/cardExportUtils';
import { 
  Wifi, 
  Download, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText, 
  Check, 
  Copy,
  Printer
} from 'lucide-react';

interface WifiCardData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
  style: 'minimal-cafe' | 'liquid-blue' | 'dark-lounge';
  placeName: string;
}

const INITIAL_WIFI: WifiCardData = {
  ssid: 'ScanForge_Guest_5G',
  password: 'guest@password2026',
  encryption: 'WPA',
  hidden: false,
  style: 'liquid-blue',
  placeName: 'Coffee & Lounge Space',
};

interface WifiCardGeneratorProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const WifiCardGenerator: React.FC<WifiCardGeneratorProps> = ({ onShowToast }) => {
  const { lang } = useLanguage();
  const [data, setData] = useState<WifiCardData>(INITIAL_WIFI);
  const [showPassword, setShowPassword] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Standard Wi-Fi QR encoding
  // WIFI:S:MySSID;T:WPA;P:MyPassword;H:false;;
  const wifiString = `WIFI:S:${data.ssid};T:${data.encryption};P:${data.password};H:${data.hidden};;`;

  useEffect(() => {
    QRCode.toDataURL(wifiString, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: data.style === 'dark-lounge' ? '#00F2FE' : '#132A86',
        light: '#FFFFFF',
      },
    })
      .then(setQrDataUrl)
      .catch((err) => console.error('Error generating wifi QR:', err));
  }, [wifiString, data.style]);

  // Render high-res printable table plaque canvas: 800 x 1000 px (Portrait table stand 4:5 ratio)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !qrDataUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 800;
    const H = 1000;
    canvas.width = W;
    canvas.height = H;

    // 1. Draw Background & Frame
    if (data.style === 'liquid-blue') {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#E8F1FC');
      grad.addColorStop(1, '#F4F9FF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Card plate
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(40, 40, W - 80, H - 80, 28);
      ctx.fill();

      // Delicate cyan glass border
      ctx.strokeStyle = '#1FD0C2';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Top cyan bar
      ctx.fillStyle = '#132A86';
      ctx.beginPath();
      ctx.roundRect(40, 40, W - 80, 20, [28, 28, 0, 0]);
      ctx.fill();
    } else if (data.style === 'minimal-cafe') {
      ctx.fillStyle = '#FFFDF9';
      ctx.fillRect(0, 0, W, H);

      // Warm double border
      ctx.strokeStyle = '#E7E0D3';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, W - 60, H - 60);

      ctx.strokeStyle = '#A27B5C';
      ctx.lineWidth = 2;
      ctx.strokeRect(42, 42, W - 84, H - 84);
    } else {
      // Dark Lounge
      ctx.fillStyle = '#0B0F19';
      ctx.fillRect(0, 0, W, H);

      // Glowing center aura
      const rad = ctx.createRadialGradient(W / 2, 450, 50, W / 2, 450, 400);
      rad.addColorStop(0, 'rgba(0, 242, 254, 0.15)');
      rad.addColorStop(1, 'rgba(11, 15, 25, 0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(30, 30, W - 60, H - 60, 24);
      ctx.stroke();
    }

    // 2. Draw Header Icon and Text
    const isDark = data.style === 'dark-lounge';
    const primaryColor = isDark ? '#FFFFFF' : '#0A143A';
    const secondaryColor = isDark ? '#94A3B8' : '#4A577D';
    const accentColor = data.style === 'dark-lounge' ? '#00F2FE' : '#132A86';

    ctx.textAlign = 'center';

    // Wi-Fi Icon representation & Place Name
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('FREE WI-FI', W / 2, 130);

    ctx.fillStyle = secondaryColor;
    ctx.font = '500 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(data.placeName || 'Welcome & Enjoy Our Connection', W / 2, 175);

    // 3. Draw QR code
    const qrImg = new Image();
    qrImg.onload = () => {
      const qrSize = 340;
      const qrX = (W - qrSize) / 2;
      const qrY = 220;

      // Clean card plate behind QR code
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 24);
      ctx.fill();
      ctx.strokeStyle = isDark ? '#00F2FE' : 'rgba(19, 42, 134, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // "SCAN TO CONNECT" pill below QR
      ctx.fillStyle = accentColor;
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(lang === 'uz' ? 'ULANISH UCHUN SKANERLANG' : 'POINT CAMERA TO CONNECT', W / 2, 625);

      // 4. Details Box (SSID & Password in clear printable format)
      const boxY = 665;
      const boxW = 600;
      const boxH = 190;
      const boxX = (W - boxW) / 2;

      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 18);
      ctx.fill();

      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Network SSID line
      ctx.textAlign = 'left';
      ctx.fillStyle = secondaryColor;
      ctx.font = '500 18px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(lang === 'uz' ? 'TARMOQ NOMI (SSID):' : 'NETWORK NAME (SSID):', boxX + 30, boxY + 45);

      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(data.ssid, boxX + 30, boxY + 80);

      // Password line
      ctx.fillStyle = secondaryColor;
      ctx.font = '500 18px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(lang === 'uz' ? 'PAROL:' : 'PASSWORD:', boxX + 30, boxY + 130);

      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Courier New", monospace';
      ctx.fillText(data.password || (lang === 'uz' ? '(Ochiq tarmoq)' : '(Open network)'), boxX + 30, boxY + 165);

      // Footer branding
      ctx.textAlign = 'center';
      ctx.fillStyle = secondaryColor;
      ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('ScanForge • Instant Smart Connection', W / 2, H - 70);
    };
    qrImg.src = qrDataUrl;
  }, [data, qrDataUrl, lang]);

  const handleExport = (format: 'png' | 'jpg' | 'pdf') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    const filename = `WiFi_Card_${data.ssid.replace(/\s+/g, '_')}`;

    setTimeout(() => {
      try {
        if (format === 'png' || format === 'jpg') {
          downloadCanvasAsImage(canvas, filename, format);
        } else {
          // Standard A5 portrait table tent size
          downloadCanvasAsPDF(canvas, filename, {
            orientation: 'portrait',
            format: 'a5',
          });
        }
        onShowToast?.(
          lang === 'uz' ? 'Wi-Fi kartasi yuklab olindi' : 'Wi-Fi card exported',
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
    <section id="wifi-card" className="py-14 sm:py-20 relative bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-semibold text-[#132A86] mb-3">
            <Wifi className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'Chop etiladigan Wi-Fi Stend' : 'Printable Wi-Fi Table Card'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-3">
            {lang === 'uz' ? 'Wi-Fi Karta Generatori' : 'Wi-Fi Card Generator'}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D]">
            {lang === 'uz'
              ? 'Mijozlaringiz yoki mehmonlaringiz uchun bir zumda ulanadigan stol usti Wi-Fi kartalarini tayyorlang.'
              : 'Create beautiful printable table cards with embedded QR codes so guests can connect instantly.'}
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Settings Panel (5 cols) */}
          <div className="lg:col-span-5 liquid-glass rounded-[28px] p-6 sm:p-7 border border-white/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0A143A] flex items-center gap-2 pb-3 border-b border-[#132A86]/8">
              <Wifi className="w-4 h-4 text-[#132A86]" />
              <span>{lang === 'uz' ? 'Tarmoq Sozlamalari' : 'Network Credentials'}</span>
            </h3>

            {/* Template Style */}
            <div>
              <label className="text-xs font-semibold text-[#0A143A] mb-2 block">
                {lang === 'uz' ? 'Karta Uslubi' : 'Card Design Style'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'liquid-blue', name: 'Liquid Blue' },
                  { id: 'minimal-cafe', name: 'Warm Cafe' },
                  { id: 'dark-lounge', name: 'Dark Lounge' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setData({ ...data, style: st.id as any })}
                    className={`py-2 px-2.5 rounded-[14px] text-center border text-xs font-semibold transition-all cursor-pointer ${
                      data.style === st.id
                        ? 'bg-[#132A86] text-white border-[#132A86]'
                        : 'bg-white/70 text-[#0A143A] border-[#132A86]/10 hover:bg-white'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Place / Header Name */}
            <div>
              <label className="text-xs font-medium text-[#4A577D] block mb-1">
                {lang === 'uz' ? 'Muassasa yoki Xona nomi' : 'Venue / Business Title'}
              </label>
              <input
                type="text"
                value={data.placeName}
                onChange={(e) => setData({ ...data, placeName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                placeholder="Central Cafe & Coworking"
              />
            </div>

            {/* SSID */}
            <div>
              <label className="text-xs font-medium text-[#4A577D] block mb-1">
                {lang === 'uz' ? 'Tarmoq Nomi (SSID)' : 'Network Name (SSID)'}
              </label>
              <div className="relative">
                <Wifi className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                <input
                  type="text"
                  value={data.ssid}
                  onChange={(e) => setData({ ...data, ssid: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                  placeholder="MyHome_5G"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-[#4A577D] block mb-1">
                {lang === 'uz' ? 'Tarmoq Paroli' : 'Wi-Fi Password'}
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#132A86] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="w-full pl-9 pr-9 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none font-mono"
                  placeholder="SecretPass123"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#4A577D] hover:text-[#132A86] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Security Type & Hidden Toggle */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-[#4A577D] block mb-1">
                  {lang === 'uz' ? 'Shifrlash turi' : 'Security'}
                </label>
                <select
                  value={data.encryption}
                  onChange={(e) => setData({ ...data, encryption: e.target.value as any })}
                  className="w-full px-2.5 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">{lang === 'uz' ? 'Ochiq (Parolsiz)' : 'Open (No pass)'}</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 rounded-[14px] bg-white border border-[#132A86]/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.hidden}
                    onChange={(e) => setData({ ...data, hidden: e.target.checked })}
                    className="rounded text-[#132A86] focus:ring-[#132A86]"
                  />
                  <span className="text-[11px] font-medium text-[#0A143A]">
                    {lang === 'uz' ? 'Yashirin tarmoq' : 'Hidden SSID'}
                  </span>
                </label>
              </div>
            </div>

          </div>

          {/* Preview & Print (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div className="w-full liquid-glass-elevated rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-lg flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-[#132A86]/8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#132A86] flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-[#1FD0C2]" />
                  {lang === 'uz' ? 'Chop etish uchun tayyor ko\'rinish' : 'Printable Display Stand'}
                </span>
                <span className="text-[11px] font-mono text-[#4A577D]">
                  A5 / Stol stendi
                </span>
              </div>

              {/* Canvas render */}
              <div className="w-full max-w-[420px] rounded-[22px] overflow-hidden shadow-md border border-black/5 bg-slate-900/5">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto rounded-[20px] object-contain"
                />
              </div>

              {/* Export actions */}
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
