import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, ArrowRight, X, Clock, Search, Tag, Sparkles } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const articles = t.blog.articles as Array<{
    id?: string;
    title: string;
    desc: string;
    category: string;
    readTime: string;
    content?: string[];
  }>;

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category));
    return ['all', ...Array.from(set)];
  }, [articles]);

  // Filtered list
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCat = selectedCategory === 'all' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || article.title.toLowerCase().includes(q) || article.desc.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

  const currentArticle = articles.find((a) => (a.id || a.title) === selectedArticleId);

  return (
    <section id="blog" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-[#132A86]/10 text-xs font-semibold text-[#132A86] mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#1FD0C2]" />
            <span>{t.blog.title}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A143A] tracking-tight mb-3">
            {t.blog.title}
          </h2>
          <p className="text-sm sm:text-base text-[#4A577D]">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="liquid-glass rounded-[24px] p-4 sm:p-5 mb-10 border border-white/90 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#132A86] text-white shadow-xs'
                    : 'bg-white/70 text-[#4A577D] hover:bg-white hover:text-[#0A143A]'
                }`}
              >
                {cat === 'all' ? (t.blog.allCategories || 'All') : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#4A577D] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.blog.searchPlaceholder || 'Search articles...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-white/80 border border-[#132A86]/12 focus:border-[#132A86] focus:outline-none"
            />
          </div>

        </div>

        {/* Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((article, idx) => (
            <div
              key={article.id || idx}
              className="liquid-glass rounded-[28px] p-6 border border-white/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-[#132A86]/30"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#132A86]/8 text-[#132A86]">
                    {article.category}
                  </span>
                  <span className="text-[11px] text-[#4A577D] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#132A86]" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0A143A] group-hover:text-[#132A86] transition-colors mb-2.5 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-[#4A577D] leading-relaxed mb-6 line-clamp-3">
                  {article.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticleId(article.id || article.title)}
                className="apple-glass-secondary w-full py-2.5 rounded-[16px] text-xs font-bold text-[#132A86] flex items-center justify-center gap-1.5 cursor-pointer group/btn hover:scale-[1.02] transition-transform"
              >
                <span>{t.blog.readMore}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-[#1FD0C2]" />
              </button>
            </div>
          ))}
        </div>

        {/* Article Reader Modal */}
        {currentArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="liquid-glass-elevated rounded-[32px] max-w-2xl w-full max-h-[85vh] p-6 sm:p-8 border border-white/90 shadow-2xl relative overflow-y-auto flex flex-col">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#132A86]/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#132A86]/10 text-[#132A86]">
                    {currentArticle.category}
                  </span>
                  <span className="text-xs text-[#4A577D] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#132A86]" />
                    {currentArticle.readTime}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedArticleId(null)}
                  className="p-2 rounded-full bg-white/80 text-[#0A143A] hover:bg-white transition-colors cursor-pointer"
                  aria-label={t.common.close}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A143A] tracking-tight mb-4 leading-tight">
                {currentArticle.title}
              </h3>

              <div className="text-sm text-[#4A577D] space-y-4 leading-relaxed mb-6 font-normal">
                {currentArticle.content && currentArticle.content.length > 0 ? (
                  currentArticle.content.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <>
                    <p>{currentArticle.desc}</p>
                    <p>
                      QR kodlar zamonaviy aloqa va vizual axborot uzatishning asosi hisoblanadi. ScanForge platformasida har bir kod xalqaro standartlarga to'liq mos kelishi va barcha mobil kameralarda tez o'qilishi kafolatlanadi.
                    </p>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-[#132A86]/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedArticleId(null)}
                  className="apple-glass-primary py-2 px-6 rounded-[16px] text-xs font-bold text-white cursor-pointer"
                >
                  {t.common.close}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
