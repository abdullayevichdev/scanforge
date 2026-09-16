import React from 'react';

interface BrandLogoProps {
  variant?: 'compact' | 'standard' | 'large' | 'navbar';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'standard', className = '' }) => {
  // Brand Colors:
  // Navy: #132A86
  // Turquoise: #1FD0C2
  
  const renderIcon = (size: number) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
    >
      {/* Background soft glow or clean design */}
      <rect width="100" height="100" rx="22" fill="#FFFFFF" />
      <rect width="100" height="100" rx="22" fill="#EEF6FF" opacity="0.6" />
      <rect x="2" y="2" width="96" height="96" rx="20" stroke="rgba(19, 42, 134, 0.05)" strokeWidth="4" />
      
      {/* Top-Left Eye */}
      <rect x="16" y="16" width="28" height="28" rx="7" stroke="#132A86" strokeWidth="6" fill="none" />
      <rect x="25" y="25" width="10" height="10" rx="2" fill="#1FD0C2" />
      
      {/* Top-Right Eye */}
      <rect x="56" y="16" width="28" height="28" rx="7" stroke="#132A86" strokeWidth="6" fill="none" />
      <rect x="65" y="25" width="10" height="10" rx="2" fill="#1FD0C2" />
      
      {/* Bottom-Left Eye */}
      <rect x="16" y="56" width="28" height="28" rx="7" stroke="#132A86" strokeWidth="6" fill="none" />
      <rect x="25" y="65" width="10" height="10" rx="2" fill="#1FD0C2" />
      
      {/* Floating QR-like Modules on Bottom-Right */}
      <rect x="56" y="56" width="8" height="8" rx="2" fill="#132A86" />
      <rect x="68" y="56" width="8" height="8" rx="2" fill="#1FD0C2" />
      <rect x="78" y="66" width="8" height="8" rx="2" fill="#132A86" />
      <rect x="56" y="68" width="8" height="18" rx="2" fill="#132A86" />
      <rect x="68" y="68" width="18" height="8" rx="2" fill="#1FD0C2" />
      <rect x="68" y="80" width="8" height="8" rx="2" fill="#132A86" />
      <rect x="80" y="80" width="8" height="8" rx="2" fill="#1FD0C2" />
    </svg>
  );

  if (variant === 'compact' || variant === 'navbar') {
    return (
      <div className={`flex items-center gap-2 select-none shrink-0 ${className}`} id="brand-logo-navbar">
        {renderIcon(28)}
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm sm:text-base tracking-tight text-brand-navy font-sans leading-none">
              ScanForge
            </span>
            <span className="hidden xs:inline text-[8px] sm:text-[9px] font-bold text-brand-navy bg-[#1FD0C2]/20 border border-[#1FD0C2]/30 px-1 py-0.2 rounded-full uppercase tracking-wider leading-none font-sans">
              PRO
            </span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-medium text-text-secondary tracking-wider font-sans -mt-0.5 hidden sm:block">
            by Abdulhay
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`} id="brand-logo-large">
        {renderIcon(72)}
        <h2 className="font-extrabold text-3xl tracking-tight text-brand-navy font-sans mt-4 leading-none">
          ScanForge
        </h2>
        <p className="text-xs font-bold text-brand-turquoise uppercase tracking-[0.25em] mt-1 font-sans">
          QR Code Builder
        </p>
        <div className="flex items-center gap-1.5 mt-2 justify-center">
          <span className="text-xs text-text-secondary">Designed with precision</span>
          <span className="w-1 h-1 rounded-full bg-brand-turquoise/60"></span>
          <span className="text-xs font-semibold text-brand-navy tracking-wide">by Abdulhay</span>
        </div>
      </div>
    );
  }

  // Standard Variant
  return (
    <div className={`flex items-center gap-4 select-none ${className}`} id="brand-logo-standard">
      {renderIcon(46)}
      <div className="flex flex-col">
        <h1 className="font-extrabold text-2xl tracking-tight text-brand-navy font-sans leading-none flex items-center gap-1.5">
          ScanForge
          <span className="text-[10px] bg-brand-ice text-brand-navy font-bold px-2 py-0.5 rounded-full border border-brand-navy/10 tracking-normal uppercase">
            v1.0
          </span>
        </h1>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px] font-bold text-brand-turquoise uppercase tracking-[0.2em] font-sans">
            QR CODE BUILDER
          </span>
          <span className="text-[10px] text-text-secondary/60">|</span>
          <span className="text-[10px] font-medium text-text-secondary tracking-wide font-sans">
            by Abdulhay
          </span>
        </div>
      </div>
    </div>
  );
};
