import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { QRRenderer } from './QRRenderer';
import { TEMPLATES_DATA } from '../data/templatesData';
import { TemplateItem, TemplateCategory, QRStyleConfig, QRType } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Search, 
  Layers, 
  Briefcase, 
  Utensils, 
  Wifi, 
  Instagram, 
  Send, 
  Youtube, 
  Share2, 
  GraduationCap, 
  Calendar, 
  Palette, 
  User, 
  Package, 
  CreditCard, 
  FileImage, 
  BookOpen, 
  Award,
  Star
} from 'lucide-react';

interface TemplatesSectionProps {
  onSelectTemplate: (config: QRStyleConfig, content: string, type: QRType) => void;
}

const FAVORITES_STORAGE_KEY = 'scanforge_favorite_templates_v1';

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  onSelectTemplate,
}) => {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['tpl_biz_1', 'tpl_wifi_1', 'tpl_insta_1'];
    } catch {
      return ['tpl_biz_1', 'tpl_wifi_1'];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const categories: { id: string; labelUz: string; labelEn: string; icon: React.ElementType }[] = [
    { id: 'all', labelUz: 'Barchasi', labelEn: 'All', icon: Layers },
    { id: 'favorites', labelUz: 'Sevimlilar', labelEn: 'Favorites', icon: Star },
    { id: 'business', labelUz: 'Biznes', labelEn: 'Business', icon: Briefcase },
    { id: 'restaurant', labelUz: 'Restoran', labelEn: 'Restaurant', icon: Utensils },
    { id: 'menu', labelUz: 'Menyu', labelEn: 'Menu', icon: BookOpen },
    { id: 'wifi', labelUz: 'Wi-Fi', labelEn: 'Wi-Fi', icon: Wifi },
    { id: 'instagram', labelUz: 'Instagram', labelEn: 'Instagram', icon: Instagram },
    { id: 'telegram', labelUz: 'Telegram', labelEn: 'Telegram', icon: Send },
    { id: 'youtube', labelUz: 'YouTube', labelEn: 'YouTube', icon: Youtube },
    { id: 'social', labelUz: 'Ijtimoiy', labelEn: 'Social Media', icon: Share2 },
    { id: 'education', labelUz: 'Ta\'lim', labelEn: 'Education', icon: GraduationCap },
    { id: 'event', labelUz: 'Tadbirlar', labelEn: 'Events', icon: Calendar },
    { id: 'portfolio', labelUz: 'Portfolio', labelEn: 'Portfolio', icon: Palette },
    { id: 'contact', labelUz: 'Kontaktlar', labelEn: 'Contacts', icon: User },
    { id: 'product', labelUz: 'Mahsulotlar', labelEn: 'Products', icon: Package },
    { id: 'payment', labelUz: 'To\'lovlar', labelEn: 'Payments', icon: CreditCard },
    { id: 'poster', labelUz: 'Posterlar', labelEn: 'Posters', icon: FileImage },
    { id: 'personal', labelUz: 'Shaxsiy Brend', labelEn: 'Personal Brand', icon: Award },
  ];

  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATA.filter((tpl) => {
      // Category filter
      if (selectedCategory === 'favorites') {
        if (!favorites.includes(tpl.id)) return false;
      } else if (selectedCategory !== 'all' && tpl.category !== selectedCategory) {
        return false;
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        tpl.nameUz.toLowerCase().includes(q) ||
        tpl.nameEn.toLowerCase().includes(q) ||
        tpl.categoryNameUz.toLowerCase().includes(q) ||
        tpl.categoryNameEn.toLowerCase().includes(q) ||
        tpl.content.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery, favorites]);

  const handleApplyTemplate = (tpl: TemplateItem) => {
    onSelectTemplate(tpl.config, tpl.content, tpl.type);
    const builderEl = document.getElementById('builder');
    if (builderEl) {
      builderEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="templates" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-bold text-[#132A86] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
              <span>{t.templates.title}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight">
              {t.templates.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#4A577D] mt-1">
              {lang === 'uz'
                ? 'Har qanday maqsad uchun 30+ tayyor, professional va to\'liq moslashtiriladigan shablonlar'
                : '30+ professionally designed, fully customizable templates across 16 categories'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#132A86]/50 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'uz' ? 'Shablonlarni qidirish...' : 'Search templates...'}
              className="w-full bg-white/90 border border-[#132A86]/15 rounded-[18px] py-2.5 pr-4 pl-11 text-xs font-semibold text-[#0A143A] focus:outline-hidden focus:border-[#132A86] shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-xs text-[#4A577D] hover:text-[#0A143A]"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const favCount = cat.id === 'favorites' ? favorites.length : null;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-[16px] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#132A86] text-white shadow-md'
                    : 'bg-white/80 text-[#4A577D] hover:text-[#0A143A] border border-[#132A86]/10 hover:bg-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? (cat.id === 'favorites' ? 'text-amber-300' : 'text-[#1FD0C2]') : 'text-[#132A86]'}`} />
                <span>{lang === 'uz' ? cat.labelUz : cat.labelEn}</span>
                {favCount !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-[#132A86]/10 text-[#132A86]'}`}>
                    {favCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="liquid-glass rounded-[32px] p-12 text-center max-w-md mx-auto border border-white/90">
            <div className="w-14 h-14 rounded-[20px] bg-[#EEF6FF] text-[#132A86] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Star className="w-6 h-6 text-[#132A86]" />
            </div>
            <h3 className="text-base font-extrabold text-[#0A143A] mb-1">
              {selectedCategory === 'favorites'
                ? (lang === 'uz' ? 'Sevimlilar ro\'yxati bo\'sh' : 'No favorites saved yet')
                : (lang === 'uz' ? 'Mos keluvchi shablon topilmadi' : 'No matching templates')}
            </h3>
            <p className="text-xs text-[#4A577D] mb-5">
              {selectedCategory === 'favorites'
                ? (lang === 'uz' ? 'Shablonlar ustidagi yurakcha belgisini bosib, ularni sevimlilarga qo\'shishingiz mumkin.' : 'Click the heart icon on any template card to save it to your favorites.')
                : (lang === 'uz' ? 'Qidiruv so\'zini o\'zgartirib ko\'ring yoki boshqa toifani tanlang.' : 'Try adjusting your search keywords or select another category.')}
            </p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="apple-glass-secondary px-5 py-2.5 rounded-[16px] text-xs font-bold cursor-pointer"
            >
              {lang === 'uz' ? 'Barcha shablonlarni ko\'rish' : 'View all templates'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((tpl) => {
              const isFav = favorites.includes(tpl.id);
              return (
                <div
                  key={tpl.id}
                  className="liquid-glass-elevated bg-white/95 rounded-[28px] p-5 border border-white/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative"
                >
                  {/* Card Top: Category Pill & Favorite Toggle */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#132A86]/8 text-[#132A86]">
                      {lang === 'uz' ? tpl.categoryNameUz : tpl.categoryNameEn}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(tpl.id, e)}
                      className={`p-2 rounded-full transition-all cursor-pointer ${
                        isFav 
                          ? 'bg-rose-50 text-rose-600 scale-110' 
                          : 'text-[#4A577D] hover:text-rose-500 hover:bg-rose-50/50'
                      }`}
                      title={lang === 'uz' ? 'Sevimlilarga qo\'shish' : 'Add to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* QR Preview Showcase */}
                  <div className="bg-slate-50/70 rounded-[22px] p-3 flex items-center justify-center mb-4 border border-[#132A86]/8 shadow-inner group-hover:bg-white transition-colors h-[175px] overflow-hidden">
                    <div className="flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                      <QRRenderer value={tpl.content} config={tpl.config} sizePx={135} />
                    </div>
                  </div>

                  {/* Title & Type */}
                  <div className="mb-4">
                    <h4 className="text-sm font-extrabold text-[#0A143A] group-hover:text-[#132A86] transition-colors truncate">
                      {lang === 'uz' ? tpl.nameUz : tpl.nameEn}
                    </h4>
                    <p className="text-[11px] font-mono text-[#4A577D] truncate mt-0.5">
                      {tpl.content}
                    </p>
                  </div>

                  {/* "Use Template" CTA */}
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="apple-glass-cta w-full py-2.5 rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group-hover:shadow-md"
                  >
                    <span>{lang === 'uz' ? 'Shablondan Foydalanish' : 'Use Template'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1FD0C2] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
