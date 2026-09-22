import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Repeat, 
  ExternalLink, 
  Edit3, 
  Check, 
  Copy, 
  Download, 
  BarChart2, 
  Sparkles, 
  AlertCircle,
  Plus,
  Trash2,
  HelpCircle
} from 'lucide-react';

export interface DynamicQRItem {
  id: string;
  title: string;
  targetUrl: string;
  shortCode: string;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'scanforge_dynamic_qrs';

interface DynamicQRSectionProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const DynamicQRSection: React.FC<DynamicQRSectionProps> = ({ onShowToast }) => {
  const { lang } = useLanguage();
  const [items, setItems] = useState<DynamicQRItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'dyn_sample_1',
        title: 'Official Website & Catalog',
        targetUrl: 'https://scanforge.uz',
        shortCode: 'sf-2026',
        scanCount: 42,
        createdAt: '2026-03-10',
        updatedAt: '2026-03-14',
      },
      {
        id: 'dyn_sample_2',
        title: 'Spring Campaign Promotion',
        targetUrl: 'https://telegram.org',
        shortCode: 'spring-promo',
        scanCount: 118,
        createdAt: '2026-03-12',
        updatedAt: '2026-03-15',
      },
    ];
  });

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [previewQrMap, setPreviewQrMap] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  // Generate QR for each dynamic item directly encoding targetUrl
  useEffect(() => {
    items.forEach((item) => {
      const directUrl = item.targetUrl.startsWith('http') ? item.targetUrl : `https://${item.targetUrl}`;
      QRCode.toDataURL(directUrl, {
        width: 320,
        margin: 1,
        color: { dark: '#132A86', light: '#FFFFFF' },
      }).then((url) => {
        setPreviewQrMap((prev) => ({ ...prev, [item.id]: url }));
      });
    });
  }, [items]);

  // Handle URL hash or search redirect if user scans a dynamic QR
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    const dest = searchParams.get('dest');
    if (dest) {
      window.location.replace(dest.startsWith('http') ? dest : `https://${dest}`);
      return;
    }

    if (hash.startsWith('#r=')) {
      const code = hash.replace('#r=', '').split('&')[0];
      const matched = items.find((i) => i.shortCode === code || i.id === code);
      if (matched && matched.targetUrl) {
        // Increment scan count
        setItems((prev) =>
          prev.map((i) => (i.id === matched.id ? { ...i, scanCount: i.scanCount + 1 } : i))
        );
        // Promptly redirect
        const target = matched.targetUrl.startsWith('http') ? matched.targetUrl : `https://${matched.targetUrl}`;
        window.location.replace(target);
      }
    }
  }, [items]);

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetUrl) return;

    const short = Math.random().toString(36).substring(2, 8);
    const newItem: DynamicQRItem = {
      id: `dyn_${Date.now()}`,
      title: newTitle.trim() || (lang === 'uz' ? 'Yangi Dinamik Havola' : 'New Dynamic Link'),
      targetUrl: newTargetUrl.startsWith('http') ? newTargetUrl : `https://${newTargetUrl}`,
      shortCode: short,
      scanCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setItems([newItem, ...items]);
    setNewTitle('');
    setNewTargetUrl('');
    setIsCreating(false);
    onShowToast?.(
      lang === 'uz' ? 'Dinamik QR yaratildi' : 'Dynamic QR created',
      lang === 'uz' ? 'Manzilni istalgan payt o\'zgartirishingiz mumkin' : 'Target URL can be changed anytime',
      'success'
    );
  };

  const handleSaveEdit = (id: string, updatedTarget: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              targetUrl: updatedTarget.startsWith('http') ? updatedTarget : `https://${updatedTarget}`,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );
    setEditingId(null);
    onShowToast?.(
      lang === 'uz' ? 'Manzil muvaffaqiyatli yangilandi' : 'Target URL updated',
      lang === 'uz' ? 'Chop etilgan QR kodni o\'zgartirish shart emas' : 'No need to reprint your physical QR codes',
      'success'
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    onShowToast?.(lang === 'uz' ? 'O\'chirildi' : 'Deleted', '', 'info');
  };

  const handleDownloadSingle = (item: DynamicQRItem) => {
    const dataUrl = previewQrMap[item.id];
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `Dynamic_QR_${item.shortCode}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="dynamic-qr" className="py-14 sm:py-20 relative bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-semibold text-[#132A86] mb-3">
            <Repeat className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{lang === 'uz' ? 'Dinamik Yo\'naltirish Tizimi' : 'Dynamic Redirection Engine'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-3">
            {lang === 'uz' ? 'Dinamik QR Kodlar' : 'Dynamic QR Codes'}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D]">
            {lang === 'uz'
              ? 'QR kodni bir marta chop eting, uning boradigan manzilini (URL) esa istalgan vaqtda qayta chop etmasdan o\'zgartiring.'
              : 'Print your QR code once on flyers or banners. Change destination URLs anytime without reprinting.'}
          </p>
        </div>

        {/* Static vs Dynamic Comparison Callout */}
        <div className="liquid-glass rounded-[24px] p-5 sm:p-6 mb-10 border border-white/90 shadow-xs max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-[18px] bg-white/70 border border-[#132A86]/8">
              <span className="text-xs font-bold text-[#4A577D] uppercase tracking-wider block mb-1">
                {lang === 'uz' ? 'Oddiy (Statik) QR' : 'Static QR Codes'}
              </span>
              <p className="text-xs text-[#4A577D] leading-relaxed">
                {lang === 'uz'
                  ? 'Havola bevosita qora va oq piksellarga doimiy shifrlanadi. Agar saytingiz manzili o\'zgarsa, hamma flayerlarni qayta chop etish kerak bo\'ladi.'
                  : 'Destination is permanently hardcoded into the barcode pixels. If your website changes, all printed materials must be reprinted.'}
              </p>
            </div>

            <div className="p-4 rounded-[18px] bg-[#132A86]/5 border border-[#132A86]/15">
              <span className="text-xs font-bold text-[#132A86] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
                {lang === 'uz' ? 'ScanForge Dinamik QR' : 'ScanForge Dynamic QR'}
              </span>
              <p className="text-xs text-[#0A143A] leading-relaxed font-medium">
                {lang === 'uz'
                  ? 'QR kod xavfsiz qisqa havolaga yo\'naltiradi. Siz istalgan vaqtda boshqaruv panelida maqsad manzilini o\'zgartirasiz — chop etilgan kodlar darhol yangi manzilga o\'tadi!'
                  : 'QR code directs through a smart shortlink. You can redirect the target URL at any time — without touching previously printed QR codes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h3 className="text-base sm:text-lg font-bold text-[#0A143A]">
            {lang === 'uz' ? 'Sizning Dinamik QR Kodlaringiz' : 'Your Dynamic QR Codes'}
          </h3>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsCreating(!isCreating)}
            className="apple-glass-primary shimmer-button py-2.5 px-4 rounded-[16px] text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs w-full sm:w-auto touch-manipulation min-h-[42px]"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'uz' ? 'Yangi Dinamik QR' : 'Create Dynamic QR'}</span>
          </motion.button>
        </div>

        {/* Create Modal / Accordion */}
        <AnimatePresence>
          {isCreating && (
            <motion.form 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleCreateNew} 
              className="liquid-glass-elevated rounded-[24px] p-6 mb-8 border border-[#132A86]/20 shadow-md overflow-hidden"
            >
              <h4 className="text-sm font-bold text-[#0A143A] mb-4">
                {lang === 'uz' ? 'Yangi Dinamik QR yaratish' : 'Create New Dynamic QR'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-[#4A577D] block mb-1">
                    {lang === 'uz' ? 'Nomi (o\'zingiz uchun)' : 'Title / Campaign Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Restoran Flayeri 2026"
                    className="w-full px-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#4A577D] block mb-1">
                    {lang === 'uz' ? 'Boradigan Manzil (Target URL)' : 'Target Destination URL'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTargetUrl}
                    onChange={(e) => setNewTargetUrl(e.target.value)}
                    placeholder="https://mysite.uz/promo"
                    className="w-full px-3 py-2 text-xs rounded-[14px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreating(false)}
                  className="py-2 px-4 rounded-[14px] text-xs font-semibold text-[#4A577D] hover:bg-slate-200/50 cursor-pointer"
                >
                  {lang === 'uz' ? 'Bekor qilish' : 'Cancel'}
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="apple-glass-primary py-2 px-5 rounded-[14px] text-xs font-bold text-white cursor-pointer"
                >
                  {lang === 'uz' ? 'Yaratish' : 'Save & Generate'}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Dynamic Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => {
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://scanforge.uz';
            const redirectLink = `${origin}/#r=${item.shortCode}`;
            const isEditing = editingId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="liquid-glass rounded-[24px] p-5 border border-white/90 shadow-sm flex flex-col sm:flex-row gap-5 items-center justify-between"
              >
                {/* QR preview */}
                <div className="w-28 h-28 rounded-[16px] bg-white p-2 shadow-xs border border-[#132A86]/8 flex items-center justify-center shrink-0">
                  {previewQrMap[item.id] ? (
                    <img
                      src={previewQrMap[item.id]}
                      alt="Dynamic QR"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full animate-pulse bg-slate-100 rounded-[10px]" />
                  )}
                </div>

                {/* Info & URL */}
                <div className="flex-1 w-full min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-[#0A143A] truncate">{item.title}</h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#132A86] bg-[#132A86]/8 px-2 py-0.5 rounded-full">
                      <BarChart2 className="w-3 h-3 text-[#1FD0C2]" />
                      <span>{item.scanCount} {lang === 'uz' ? 'skanerlash' : 'scans'}</span>
                    </span>
                  </div>

                  {/* Destination URL row */}
                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <input
                        type="text"
                        defaultValue={item.targetUrl}
                        id={`edit-input-${item.id}`}
                        className="w-full px-2.5 py-1.5 text-xs rounded-[10px] bg-white border border-[#132A86] focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById(`edit-input-${item.id}`) as HTMLInputElement;
                            if (input) handleSaveEdit(item.id, input.value);
                          }}
                          className="py-1 px-3 rounded-[10px] bg-[#132A86] text-white text-xs font-bold cursor-pointer"
                        >
                          {lang === 'uz' ? 'Saqlash' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="py-1 px-2 rounded-[10px] text-xs text-[#4A577D] hover:bg-slate-200/50 cursor-pointer"
                        >
                          {lang === 'uz' ? 'Bekor' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-[#4A577D] truncate mb-1">
                        <span className="font-semibold text-[#0A143A]">{lang === 'uz' ? 'Hozirgi manzil:' : 'Current URL:'}</span>{' '}
                        {item.targetUrl}
                      </p>
                      <p className="text-[11px] font-mono text-[#94A3B8] truncate mb-3">
                        {redirectLink}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {!isEditing && (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#132A86]/8">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setEditingId(item.id)}
                        className="p-1.5 rounded-[10px] bg-white border border-[#132A86]/10 text-[#132A86] text-xs font-medium flex items-center gap-1 hover:bg-[#132A86]/5 cursor-pointer"
                        title={lang === 'uz' ? 'Manzilni o\'zgartirish' : 'Change Target URL'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{lang === 'uz' ? 'O\'zgartirish' : 'Edit URL'}</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => handleDownloadSingle(item)}
                        className="p-1.5 rounded-[10px] bg-white border border-[#132A86]/10 text-[#132A86] text-xs font-medium flex items-center gap-1 hover:bg-[#132A86]/5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-[11px]">PNG</span>
                      </motion.button>

                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        href={item.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-[10px] bg-white border border-[#132A86]/10 text-[#4A577D] hover:text-[#132A86] cursor-pointer"
                        title="Open Target"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </motion.a>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-[10px] bg-white border border-[#132A86]/10 text-red-500 hover:bg-red-50 ml-auto cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
