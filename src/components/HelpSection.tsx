import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HelpCircle, ChevronDown, Search, Wrench, Download, Layout, QrCode, History, User, Clock, AlertCircle } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  all: HelpCircle,
  builder: Wrench,
  downloads: Download,
  templates: Layout,
  scanner: QrCode,
  history: History,
  account: User,
  dailyLimit: Clock,
  troubleshooting: AlertCircle,
};

export const HelpSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const rawList = t.help.faqList as Array<{
    category?: string;
    q: string;
    a: string;
  }>;

  const categories = useMemo(() => {
    return [
      { id: 'all', label: lang === 'uz' ? 'Barcha savollar' : 'All Topics' },
      { id: 'builder', label: t.help.categories?.builder || 'QR Builder' },
      { id: 'downloads', label: t.help.categories?.downloads || 'Downloads' },
      { id: 'templates', label: t.help.categories?.templates || 'Templates' },
      { id: 'account', label: t.help.categories?.account || 'Account' },
      { id: 'dailyLimit', label: t.help.categories?.dailyLimit || 'Daily Limit' },
      { id: 'troubleshooting', label: t.help.categories?.troubleshooting || 'Troubleshooting' },
    ];
  }, [t, lang]);

  const filteredFaq = useMemo(() => {
    return rawList.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [rawList, selectedCategory, searchQuery]);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="help" className="py-14 sm:py-20 relative bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-semibold text-[#132A86] mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{t.help.title}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-3">
            {t.help.title}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D]">
            {t.help.subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8 relative">
          <Search className="w-4 h-4 text-[#4A577D] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.help.searchPlaceholder || 'Search topics or questions...'}
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-[18px] bg-white border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none shadow-xs"
          />
        </div>

        {/* Categories Carousel / Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || HelpCircle;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOpenIdx(null);
                }}
                className={`py-2 px-3.5 rounded-[14px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#132A86] text-white shadow-xs'
                    : 'bg-white/80 text-[#4A577D] hover:bg-white hover:text-[#0A143A] border border-[#132A86]/8'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1FD0C2]' : 'text-[#132A86]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        {filteredFaq.length > 0 ? (
          <div className="space-y-3.5">
            {filteredFaq.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="liquid-glass rounded-[22px] border border-white/90 overflow-hidden transition-all duration-200 shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-[#0A143A]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#132A86] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#4A577D] leading-relaxed border-t border-[#132A86]/6">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 liquid-glass rounded-[24px] border border-white/80">
            <p className="text-sm font-semibold text-[#4A577D]">
              {lang === 'uz' ? 'Hech qanday savol topilmadi.' : 'No matching questions found.'}
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
