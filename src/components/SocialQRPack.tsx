import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Send, 
  Instagram, 
  Youtube, 
  Globe, 
  Share2, 
  Download, 
  Copy, 
  Check,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';

interface SocialChannel {
  id: string;
  name: string;
  brandColor: string;
  bgGradient: [string, string];
  prefix: string;
  placeholder: string;
  icon: string;
}

const CHANNELS: SocialChannel[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    brandColor: '#229ED9',
    bgGradient: ['#EBF7FD', '#FFFFFF'],
    prefix: 'https://t.me/',
    placeholder: 'username / kanal',
    icon: 'telegram',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    brandColor: '#E1306C',
    bgGradient: ['#FDF2F7', '#FFFFFF'],
    prefix: 'https://instagram.com/',
    placeholder: 'username',
    icon: 'instagram',
  },
];

interface SocialQRPackProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SocialQRPack: React.FC<SocialQRPackProps> = ({ onShowToast }) => {
  const { lang } = useLanguage();
  const [selectedChannel, setSelectedChannel] = useState<string>('telegram');
  const [handles, setHandles] = useState<Record<string, string>>({
    telegram: 'avazxanovvv_700',
    instagram: 'avazxanovvv_700',
  });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const activeChannel = CHANNELS.find((c) => c.id === selectedChannel) || CHANNELS[0];
  const activeValue = `${activeChannel.prefix}${handles[selectedChannel] || ''}`;

  const handleDownload = async (channel: SocialChannel) => {
    setDownloadingId(channel.id);
    const rawVal = handles[channel.id];
    if (!rawVal) {
      onShowToast?.(
        lang === 'uz' ? 'Iltimos, avval havolani kiriting' : 'Please enter handle first',
        '',
        'warning'
      );
      setDownloadingId(null);
      return;
    }

    const fullUrl = `${channel.prefix}${rawVal}`;
    try {
      // Generate Canvas with stylized frame & brand badge
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, fullUrl, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: channel.brandColor,
          light: '#FFFFFF',
        },
      });

      // Composite final card on high-res canvas
      const finalCanvas = document.createElement('canvas');
      const W = 1080;
      const H = 1350; // 4:5 Instagram Portrait ratio
      finalCanvas.width = W;
      finalCanvas.height = H;
      const ctx = finalCanvas.getContext('2d');

      if (ctx) {
        // Gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, channel.bgGradient[0]);
        grad.addColorStop(1, channel.bgGradient[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Header brand bar
        ctx.fillStyle = channel.brandColor;
        ctx.fillRect(0, 0, W, 24);

        // Title
        ctx.fillStyle = '#0A143A';
        ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        const titleText = lang === 'uz' ? `${channel.name.toUpperCase()}DA BIZGA OBUNA BO'LING` : `FOLLOW US ON ${channel.name.toUpperCase()}`;
        ctx.fillText(titleText, W / 2, 160);

        // Handle text
        ctx.fillStyle = channel.brandColor;
        ctx.font = '600 32px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(`@${rawVal.replace('@', '')}`, W / 2, 220);

        // QR Card plate
        const qrSize = 700;
        const qrX = (W - qrSize) / 2;
        const qrY = 300;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(qrX - 30, qrY - 30, qrSize + 60, qrSize + 60, 40);
        ctx.fill();

        ctx.strokeStyle = channel.brandColor;
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

        // Footer Call To Action
        ctx.fillStyle = '#4A577D';
        ctx.font = '500 28px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(lang === 'uz' ? 'Kamerani qaratib sahifaga o\'ting' : 'Scan with camera to visit profile', W / 2, 1140);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '20px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('Created with ScanForge • High Definition', W / 2, 1220);
      }

      const dataUrl = finalCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ScanForge_${channel.name}_${rawVal}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onShowToast?.(
        lang === 'uz' ? `${channel.name} QR kodi yuklandi` : `${channel.name} QR downloaded`,
        '1080×1350 High-Res Card',
        'success'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section id="social-pack" className="py-14 sm:py-20 relative bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-semibold text-[#132A86] mb-3">
            <Share2 className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'Ijtimoiy Tarmoqlar To\'plami' : 'Social Media Quick Pack'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-3">
            {lang === 'uz' ? 'Tezkor Ijtimoiy Tarmoq QR Paketi' : 'Social Media QR Pack'}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D]">
            {lang === 'uz'
              ? 'Telegram va Instagram sahifalaringiz uchun maxsus brend ranglariga mos yuqori sifatli QR kartalarni bir zumda yarating.'
              : 'Effortlessly generate branded QR cards with official color themes for Telegram and Instagram.'}
          </p>
        </div>

        {/* 2 Channels Symmetrical Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {CHANNELS.map((channel) => {
            const handle = handles[channel.id] || '';
            const isSelected = selectedChannel === channel.id;
            const Icon = channel.id === 'telegram' ? Send : Instagram;

            return (
              <div
                key={channel.id}
                className={`liquid-glass rounded-[24px] sm:rounded-[28px] p-4 sm:p-7 border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg ${
                  isSelected
                    ? 'border-[#132A86]/30 bg-white'
                    : 'border-white/80 hover:border-[#132A86]/20 bg-white/80'
                }`}
              >
                <div>
                  {/* Card top badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div 
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-[12px] sm:rounded-[14px] flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: channel.brandColor }}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-[#0A143A]">
                        {channel.name}
                      </span>
                    </div>
                    <span 
                      className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold text-white"
                      style={{ backgroundColor: channel.brandColor }}
                    >
                      Official Pack
                    </span>
                  </div>

                  {/* Input handle */}
                  <div className="mb-5 sm:mb-6">
                    <label className="text-xs font-semibold text-[#4A577D] block mb-1.5">
                      {lang === 'uz' ? 'Foydalanuvchi nomi yoki havola:' : 'Username or link:'} <span className="text-[#94A3B8] font-normal font-mono">({channel.prefix})</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs text-[#94A3B8] font-mono select-none">
                        @
                      </span>
                      <input
                        type="text"
                        value={handle.replace(/^@/, '')}
                        onChange={(e) => {
                          setHandles({ ...handles, [channel.id]: e.target.value });
                          setSelectedChannel(channel.id);
                        }}
                        placeholder={channel.placeholder}
                        className="w-full pl-8 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-[14px] bg-slate-50/80 border border-[#132A86]/15 focus:border-[#132A86] focus:bg-white focus:outline-none font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Instant Action */}
                <button
                  type="button"
                  disabled={downloadingId === channel.id}
                  onClick={() => handleDownload(channel)}
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-[14px] sm:rounded-[16px] text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 transition-all shadow-md active:scale-[0.99] touch-manipulation min-h-[44px]"
                  style={{ backgroundColor: channel.brandColor }}
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span className="truncate">{downloadingId === channel.id ? (lang === 'uz' ? 'Yuklanmoqda...' : 'Exporting...') : lang === 'uz' ? `${channel.name} QR Kartani Yuklash` : `Download ${channel.name} QR`}</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
