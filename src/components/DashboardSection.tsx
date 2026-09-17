import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Plus, 
  Scan, 
  LayoutTemplate, 
  Sparkles, 
  Clock, 
  Heart, 
  Trash2, 
  Copy, 
  Edit3, 
  ExternalLink,
  Check,
  Zap,
  Bookmark,
  Share2,
  Settings as SettingsIcon,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SavedQRCodeRecord, QRType, QRStyleConfig } from '../types';
import { QRRenderer } from './QRRenderer';

interface DashboardSectionProps {
  onNewQR: () => void;
  onScanQR: () => void;
  onExploreTemplates: () => void;
  onOpenSettings: () => void;
  onEditQR: (record: SavedQRCodeRecord) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  onNewQR,
  onScanQR,
  onExploreTemplates,
  onOpenSettings,
  onEditQR,
  onShowToast,
}) => {
  const { lang, t } = useLanguage();
  const { 
    user, 
    dailyUsageCount, 
    dailyLimit, 
    remainingCount, 
    savedQRs, 
    deleteQRRecord, 
    toggleFavoriteQR,
    saveQRRecord
  } = useAuth();

  const handleDuplicate = (record: SavedQRCodeRecord) => {
    saveQRRecord({
      name: `${record.name} (Copy)`,
      type: record.type,
      content: record.content,
      config: record.config,
      favorite: false,
    });
    onShowToast?.(
      lang === 'uz' ? 'Nusxa yaratildi' : 'QR code duplicated',
      undefined,
      'success'
    );
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    onShowToast?.(
      lang === 'uz' ? 'Havola nusxalandi' : 'Content copied to clipboard',
      undefined,
      'success'
    );
  };

  return (
    <section id="dashboard" className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Dashboard Glass Container */}
        <div className="liquid-glass-elevated bg-white/95 backdrop-blur-2xl rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-white/90 shadow-xl space-y-8">
          
          {/* Top Welcome & Quick Stats Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#132A86]/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[22px] bg-gradient-to-tr from-[#132A86] to-[#1FD0C2] text-white flex items-center justify-center text-xl font-black shadow-lg shrink-0">
                {user ? `${user.firstName[0]?.toUpperCase()}${user.lastName[0]?.toUpperCase()}` : <Sparkles className="w-7 h-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A143A]">
                    {user 
                      ? (lang === 'uz' ? `Xush kelibsiz, ${user.firstName}!` : `Welcome back, ${user.firstName}!`)
                      : (lang === 'uz' ? 'Boshqaruv Paneli' : 'ScanForge Studio Dashboard')}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1FD0C2]/20 text-[#132A86]">
                    Free Plan
                  </span>
                </div>
                <p className="text-xs text-[#4A577D] mt-0.5">
                  {lang === 'uz'
                    ? 'QR kodlaringizni boshqaring, yangi dizaynlar yarating va eksport qiling.'
                    : 'Manage your QR codes, launch new designs, and export in ultra high-resolution.'}
                </p>
              </div>
            </div>

            {/* Daily Usage Progress Badge */}
            <div className="bg-[#EEF6FF]/90 rounded-[22px] p-3.5 sm:px-5 sm:py-3 border border-[#132A86]/10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <div>
                <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#132A86] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
                    {lang === 'uz' ? 'Bugungi QR Limit' : 'Daily QR Limit'}
                  </span>
                  <span>{dailyUsageCount} / {dailyLimit}</span>
                </div>
                <div className="w-40 sm:w-48 h-2 bg-white rounded-full overflow-hidden border border-[#132A86]/10">
                  <div 
                    className="h-full bg-gradient-to-r from-[#132A86] to-[#1FD0C2] rounded-full transition-all duration-300"
                    style={{ width: `${(dailyUsageCount / dailyLimit) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#4A577D]">
                {lang === 'uz' ? `${remainingCount} ta qoldi` : `${remainingCount} left today`}
              </span>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onNewQR}
              className="p-4 rounded-[22px] bg-[#132A86] text-white hover:bg-[#0E216B] transition-all cursor-pointer shadow-md flex flex-col justify-between text-left group"
            >
              <div className="w-10 h-10 rounded-[14px] bg-white/15 flex items-center justify-center text-[#1FD0C2] mb-3 group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-extrabold block">
                  {lang === 'uz' ? 'Yangi QR Yaratish' : 'Create New QR'}
                </span>
                <span className="text-[11px] text-white/70">
                  {lang === 'uz' ? '12 xil formatda' : '12 customizable formats'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={onScanQR}
              className="p-4 rounded-[22px] bg-white border border-[#132A86]/10 hover:border-[#132A86]/30 hover:bg-[#EEF6FF]/50 transition-all cursor-pointer shadow-xs flex flex-col justify-between text-left group"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#132A86]/8 flex items-center justify-center text-[#132A86] mb-3 group-hover:scale-105 transition-transform">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-[#0A143A] block">
                  {lang === 'uz' ? 'QR Skanerlash' : 'Scan QR Code'}
                </span>
                <span className="text-[11px] text-[#4A577D]">
                  {lang === 'uz' ? 'Kamera yoki rasm' : 'Camera or image upload'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={onExploreTemplates}
              className="p-4 rounded-[22px] bg-white border border-[#132A86]/10 hover:border-[#132A86]/30 hover:bg-[#EEF6FF]/50 transition-all cursor-pointer shadow-xs flex flex-col justify-between text-left group"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#132A86]/8 flex items-center justify-center text-[#132A86] mb-3 group-hover:scale-105 transition-transform">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-[#0A143A] block">
                  {lang === 'uz' ? 'Shablonlar' : 'Browse Templates'}
                </span>
                <span className="text-[11px] text-[#4A577D]">
                  {lang === 'uz' ? '30+ tayyor uslub' : '30+ curated styles'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-4 rounded-[22px] bg-white border border-[#132A86]/10 hover:border-[#132A86]/30 hover:bg-[#EEF6FF]/50 transition-all cursor-pointer shadow-xs flex flex-col justify-between text-left group"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#132A86]/8 flex items-center justify-center text-[#132A86] mb-3 group-hover:scale-105 transition-transform">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-[#0A143A] block">
                  {lang === 'uz' ? 'Sozlamalar' : 'User Settings'}
                </span>
                <span className="text-[11px] text-[#4A577D]">
                  {lang === 'uz' ? 'Profil, til va format' : 'Profile, language & format'}
                </span>
              </div>
            </button>
          </div>

          {/* Recent QR Codes Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#0A143A]">
                  {lang === 'uz' ? 'Mening Saqlangan QR Kodlarim' : 'Saved QR Codes Collection'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#132A86]/8 text-[#132A86]">
                  {savedQRs.length}
                </span>
              </div>
            </div>

            {savedQRs.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-[28px] bg-slate-50/70 border border-[#132A86]/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-[18px] bg-[#132A86]/8 text-[#132A86] flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0A143A]">
                  {lang === 'uz' ? 'Hozircha saqlangan QR kodlar yo\'q' : 'No saved QR codes yet'}
                </h4>
                <p className="text-xs text-[#4A577D] max-w-sm mx-auto">
                  {lang === 'uz'
                    ? 'QR konstruktorda xohlagan QR kodingizni yarating va "Saqlash" tugmasini bosing.'
                    : 'Create any QR in the builder and click "Save" to build your private collection.'}
                </p>
                <button
                  type="button"
                  onClick={onNewQR}
                  className="apple-glass-cta py-2.5 px-5 rounded-[16px] text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#1FD0C2]" />
                  <span>{lang === 'uz' ? 'Birinchi QR Kodni Yaratish' : 'Create First QR Code'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedQRs.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-[24px] bg-white border border-[#132A86]/10 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-16 h-16 rounded-[16px] bg-slate-50 p-1.5 border border-slate-100 flex items-center justify-center shrink-0">
                        <QRRenderer value={item.content} config={item.config} sizePx={56} svgId={`scanforge-dashboard-${item.id}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[#0A143A] truncate">{item.name}</h4>
                          {item.favorite && <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 shrink-0" />}
                        </div>
                        <span className="text-[10px] font-semibold text-[#132A86] bg-[#132A86]/6 px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase">
                          {item.type}
                        </span>
                        <p className="text-[11px] text-[#4A577D] truncate mt-1 font-mono">
                          {item.content}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#132A86]/8">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleFavoriteQR(item.id)}
                          className={`p-1.5 rounded-[10px] hover:bg-slate-100 transition-colors cursor-pointer ${
                            item.favorite ? 'text-red-500' : 'text-[#4A577D]'
                          }`}
                          title={lang === 'uz' ? 'Sevimli' : 'Favorite'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${item.favorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyContent(item.content)}
                          className="p-1.5 rounded-[10px] text-[#4A577D] hover:text-[#0A143A] hover:bg-slate-100 transition-colors cursor-pointer"
                          title={lang === 'uz' ? 'Nusxa olish' : 'Copy link'}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(item)}
                          className="p-1.5 rounded-[10px] text-[#4A577D] hover:text-[#0A143A] hover:bg-slate-100 transition-colors cursor-pointer"
                          title={lang === 'uz' ? 'Nusxasini yaratish' : 'Duplicate'}
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteQRRecord(item.id)}
                          className="p-1.5 rounded-[10px] text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title={lang === 'uz' ? 'O\'chirish' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onEditQR(item)}
                        className="py-1.5 px-3 rounded-[12px] bg-[#132A86]/8 hover:bg-[#132A86] hover:text-white text-xs font-bold text-[#132A86] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{lang === 'uz' ? 'Tahrirlash' : 'Edit'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
