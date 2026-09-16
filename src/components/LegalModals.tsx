import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, FileText, X, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { t, lang } = useLanguage();

  if (!type) return null;

  const content = type === 'privacy' ? t.privacyPolicy : t.termsOfService;
  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="liquid-glass-elevated w-full max-w-2xl max-h-[85vh] rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-2xl overflow-y-auto flex flex-col">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#132A86]/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[14px] bg-[#132A86]/8 flex items-center justify-center text-[#132A86]">
              {isPrivacy ? <Shield className="w-5 h-5 text-[#1FD0C2]" /> : <FileText className="w-5 h-5 text-[#132A86]" />}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A143A]">
                {content.title}
              </h3>
              <p className="text-[11px] text-[#4A577D]">{content.lastUpdated}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-[14px] bg-white/70 hover:bg-white text-[#4A577D] hover:text-[#0A143A] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Intro */}
        <p className="text-sm text-[#4A577D] leading-relaxed mb-6 font-medium">
          {content.intro}
        </p>

        {/* Sections */}
        <div className="space-y-5 flex-1 pr-1">
          {content.sections.map((sec, idx) => (
            <div key={idx} className="p-4 rounded-[20px] bg-white/60 border border-[#132A86]/8">
              <h4 className="text-sm font-bold text-[#0A143A] mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1FD0C2] shrink-0" />
                <span>{sec.heading}</span>
              </h4>
              <p className="text-xs text-[#4A577D] leading-relaxed">
                {sec.text}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Close */}
        <div className="mt-6 pt-4 border-t border-[#132A86]/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="apple-glass-primary py-2 px-6 rounded-[16px] text-xs font-bold text-white cursor-pointer"
          >
            {lang === 'uz' ? 'Tushunarli & Yopish' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
