import React, { useMemo, useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  Link as LinkIcon, 
  Wifi as WifiIcon, 
  Phone as PhoneIcon, 
  Mail as MailIcon, 
  MessageSquare as SmsIcon, 
  Share2 as ShareIcon, 
  Github as GithubIcon, 
  Globe as GlobeIcon,
  Send as TelegramIcon,
  Instagram as InstagramIcon,
  MapPin as MapIcon,
  Calendar as CalendarIcon,
  Apple as AppleIcon
} from 'lucide-react';
import { QRStyleConfig } from '../types';

interface QRRendererProps {
  value: string;
  config: QRStyleConfig;
  sizePx?: number;
  svgId?: string;
  onSvgStringGenerated?: (svgString: string) => void;
}

const PRESET_ICONS: Record<string, React.ComponentType<any>> = {
  link: LinkIcon,
  wifi: WifiIcon,
  phone: PhoneIcon,
  mail: MailIcon,
  sms: SmsIcon,
  social: ShareIcon,
  github: GithubIcon,
  globe: GlobeIcon,
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  whatsapp: SmsIcon,
  map: MapIcon,
  calendar: CalendarIcon,
  apple: AppleIcon,
};

export const QRRenderer: React.FC<QRRendererProps> = ({
  value,
  config,
  sizePx = 360,
  svgId,
  onSvgStringGenerated,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = React.useId ? React.useId().replace(/[^a-zA-Z0-9]/g, '') : '';
  const instanceId = useMemo(() => svgId || `sf-qr-${reactId || Math.random().toString(36).slice(2, 8)}`, [svgId, reactId]);

  const [qrCodeData, setQrCodeData] = useState<{
    size: number;
    modules: { get: (r: number, c: number) => number };
  } | null>(null);

  // Generate QR matrix using node-qrcode with configured error correction
  useEffect(() => {
    try {
      // If a logo is present, boost error correction to Q or H if currently L or M
      let ecLevel = config.errorCorrectionLevel;
      if (config.logoType !== 'none' && (ecLevel === 'L' || ecLevel === 'M')) {
        ecLevel = 'Q';
      }

      const contentToEncode = (value && value.trim().length > 0) ? value.trim() : 'https://scanforge.uz';
      const qr = QRCode.create(contentToEncode, {
        errorCorrectionLevel: ecLevel,
      });
      setQrCodeData({
        size: qr.modules.size,
        modules: qr.modules,
      });
    } catch (err) {
      console.error('Error generating QR matrix:', err);
    }
  }, [value, config.errorCorrectionLevel, config.logoType]);

  // Dimensions with Frame support - proportional scaling
  const hasFrame = config.frameStyle && config.frameStyle !== 'none';
  // Scale frame height proportionally to sizePx so small previews don't break
  const frameHeight = hasFrame ? Math.round(sizePx * (config.frameStyle === 'polaroid' ? 0.16 : 0.13)) : 0;
  const isTopFrame = config.frameStyle === 'scan-me-top';

  // Check if a module is part of the 3 finder eyes (7x7 modules)
  const isEyeModule = (row: number, col: number, size: number): boolean => {
    if (row < 7 && col < 7) return true; // Top-left
    if (row < 7 && col >= size - 7) return true; // Top-right
    if (row >= size - 7 && col < 7) return true; // Bottom-left
    return false;
  };

  // Center logo clearing area in module units
  const clearingZone = useMemo(() => {
    if (!qrCodeData || config.logoType === 'none') return null;

    const size = qrCodeData.size;
    const s = sizePx / size;
    
    const lw = (config.logoSize / 100) * sizePx;
    const lh = (config.logoSize / 100) * sizePx;
    
    let colMin = Math.floor((sizePx - lw) / 2 / s);
    let colMax = Math.ceil((sizePx + lw) / 2 / s);
    let rowMin = Math.floor((sizePx - lh) / 2 / s);
    let rowMax = Math.ceil((sizePx + lh) / 2 / s);

    if (config.logoBgPadding) {
      colMin -= 1;
      colMax += 1;
      rowMin -= 1;
      rowMax += 1;
    }

    return { colMin, colMax, rowMin, rowMax };
  }, [qrCodeData, config.logoType, config.logoSize, config.logoBgPadding, sizePx]);

  // SVG Elements rendering
  const svgElements = useMemo(() => {
    if (!qrCodeData) return null;

    const size = qrCodeData.size;
    const grid = qrCodeData.modules;
    const s = sizePx / size;

    const bodyPaths: string[] = [];
    const eyeElements: React.ReactNode[] = [];

    const getRoundedModulePath = (x: number, y: number, s: number, tl: number, tr: number, br: number, bl: number) => {
      return `M ${x + tl} ${y} ` +
             `L ${x + s - tr} ${y} ` +
             `A ${tr} ${tr} 0 0 1 ${x + s} ${y + tr} ` +
             `L ${x + s} ${y + s - br} ` +
             `A ${br} ${br} 0 0 1 ${x + s - br} ${y + s} ` +
             `L ${x + bl} ${y + s} ` +
             `A ${bl} ${bl} 0 0 1 ${x} ${y + s - bl} ` +
             `L ${x} ${y + tl} ` +
             `A ${tl} ${tl} 0 0 1 ${x + tl} ${y} Z`;
    };

    // Render body modules
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (isEyeModule(row, col, size)) continue;

        if (clearingZone) {
          if (row >= clearingZone.rowMin && row <= clearingZone.rowMax &&
              col >= clearingZone.colMin && col <= clearingZone.colMax) {
            continue;
          }
        }

        if (grid.get(row, col)) {
          const x = col * s;
          const y = row * s;

          switch (config.dotStyle) {
            case 'square':
              bodyPaths.push(`M ${x} ${y} h ${s} v ${s} h -${s} Z`);
              break;

            case 'rounded':
              bodyPaths.push(getRoundedModulePath(x, y, s, s * 0.35, s * 0.35, s * 0.35, s * 0.35));
              break;

            case 'dots': {
              const r = s * 0.42;
              const cx = x + s / 2;
              const cy = y + s / 2;
              bodyPaths.push(`M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 -${r * 2} 0`);
              break;
            }

            case 'fluid': {
              const top = row > 0 && grid.get(row - 1, col) && !isEyeModule(row - 1, col, size);
              const bottom = row < size - 1 && grid.get(row + 1, col) && !isEyeModule(row + 1, col, size);
              const left = col > 0 && grid.get(row, col - 1) && !isEyeModule(row, col - 1, size);
              const right = col < size - 1 && grid.get(row, col + 1) && !isEyeModule(row, col + 1, size);

              const rVal = s * 0.45;
              const tl = (!top && !left) ? rVal : 0;
              const tr = (!top && !right) ? rVal : 0;
              const br = (!bottom && !right) ? rVal : 0;
              const bl = (!bottom && !left) ? rVal : 0;

              bodyPaths.push(getRoundedModulePath(x, y, s, tl, tr, br, bl));
              break;
            }

            case 'classy': {
              bodyPaths.push(getRoundedModulePath(x, y, s, s * 0.5, 0, s * 0.5, 0));
              break;
            }
          }
        }
      }
    }

    // Render Finder Eyes (3 locations)
    const eyeLocations = [
      { r: 0, c: 0 },
      { r: 0, c: size - 7 },
      { r: size - 7, c: 0 },
    ];

    const eyeOuterColor = config.customEyeColor ? config.eyeOuterColor : (config.colorType === 'solid' ? config.foregroundSolid : config.gradientColor1);
    const eyeInnerColor = config.customEyeColor ? config.eyeInnerColor : (config.colorType === 'solid' ? config.foregroundSolid : config.gradientColor2);

    eyeLocations.forEach((loc, idx) => {
      const ox = loc.c * s;
      const oy = loc.r * s;
      const outerSize = 7 * s;

      const ix = ox + 2 * s;
      const iy = oy + 2 * s;
      const innerSize = 3 * s;

      // Outer Frame
      let outerNode: React.ReactNode = null;
      if (config.eyeOuterStyle === 'square') {
        outerNode = (
          <path
            key={`outer-${idx}`}
            d={`M ${ox} ${oy} h ${outerSize} v ${outerSize} h -${outerSize} Z M ${ox + s} ${oy + s} v ${5 * s} h ${5 * s} v -${5 * s} Z`}
            fill={eyeOuterColor}
            fillRule="evenodd"
          />
        );
      } else if (config.eyeOuterStyle === 'rounded') {
        const outerR = outerSize * 0.25;
        const innerR = 5 * s * 0.2;
        outerNode = (
          <g key={`outer-${idx}`}>
            <rect x={ox} y={oy} width={outerSize} height={outerSize} rx={outerR} ry={outerR} fill={eyeOuterColor} />
            <rect x={ox + s} y={oy + s} width={5 * s} height={5 * s} rx={innerR} ry={innerR} fill={config.backgroundType === 'solid' ? config.backgroundColor : '#FFFFFF'} />
          </g>
        );
      } else if (config.eyeOuterStyle === 'extra-rounded') {
        const outerR = outerSize * 0.42;
        const innerR = 5 * s * 0.35;
        outerNode = (
          <g key={`outer-${idx}`}>
            <rect x={ox} y={oy} width={outerSize} height={outerSize} rx={outerR} ry={outerR} fill={eyeOuterColor} />
            <rect x={ox + s} y={oy + s} width={5 * s} height={5 * s} rx={innerR} ry={innerR} fill={config.backgroundType === 'solid' ? config.backgroundColor : '#FFFFFF'} />
          </g>
        );
      } else if (config.eyeOuterStyle === 'circular') {
        const r = outerSize / 2;
        const ir = (5 * s) / 2;
        outerNode = (
          <g key={`outer-${idx}`}>
            <circle cx={ox + r} cy={oy + r} r={r} fill={eyeOuterColor} />
            <circle cx={ox + r} cy={oy + r} r={ir} fill={config.backgroundType === 'solid' ? config.backgroundColor : '#FFFFFF'} />
          </g>
        );
      }

      // Inner Pupil
      let innerNode: React.ReactNode = null;
      if (config.eyeInnerStyle === 'square') {
        innerNode = (
          <rect key={`inner-${idx}`} x={ix} y={iy} width={innerSize} height={innerSize} fill={eyeInnerColor} />
        );
      } else if (config.eyeInnerStyle === 'rounded') {
        innerNode = (
          <rect key={`inner-${idx}`} x={ix} y={iy} width={innerSize} height={innerSize} rx={innerSize * 0.35} ry={innerSize * 0.35} fill={eyeInnerColor} />
        );
      } else if (config.eyeInnerStyle === 'circular') {
        const ir = innerSize / 2;
        innerNode = (
          <circle key={`inner-${idx}`} cx={ix + ir} cy={iy + ir} r={ir} fill={eyeInnerColor} />
        );
      } else if (config.eyeInnerStyle === 'diamond') {
        const cx = ix + innerSize / 2;
        const cy = iy + innerSize / 2;
        const half = innerSize / 2;
        innerNode = (
          <polygon key={`inner-${idx}`} points={`${cx},${cy - half} ${cx + half},${cy} ${cx},${cy + half} ${cx - half},${cy}`} fill={eyeInnerColor} />
        );
      }

      eyeElements.push(
        <g key={`eye-group-${idx}`}>
          {outerNode}
          {innerNode}
        </g>
      );
    });

    return {
      bodyPathString: bodyPaths.join(' '),
      eyeElements,
    };
  }, [qrCodeData, config, sizePx, clearingZone]);

  // Center logo element
  const logoElement = useMemo(() => {
    if (config.logoType === 'none') return null;

    const lw = (config.logoSize / 100) * sizePx;
    const lh = (config.logoSize / 100) * sizePx;
    const lx = (sizePx - lw) / 2;
    const ly = (sizePx - lh) / 2;
    const lcx = sizePx / 2;
    const lcy = sizePx / 2;

    let bgNode: React.ReactNode = null;
    const bgFill = config.backgroundType === 'solid' ? config.backgroundColor : '#FFFFFF';

    if (config.logoBgShape === 'circle') {
      const radius = lw / 2 + (config.logoBgPadding ? 6 : 0);
      bgNode = <circle cx={lcx} cy={lcy} r={radius} fill={bgFill} stroke="rgba(19, 42, 134, 0.08)" strokeWidth="1" />;
    } else if (config.logoBgShape === 'square') {
      const side = lw + (config.logoBgPadding ? 12 : 0);
      const bx = (sizePx - side) / 2;
      const by = (sizePx - side) / 2;
      const rx = side * 0.22;
      bgNode = <rect x={bx} y={by} width={side} height={side} rx={rx} ry={rx} fill={bgFill} stroke="rgba(19, 42, 134, 0.08)" strokeWidth="1" />;
    }

    let logoContentNode: React.ReactNode = null;
    if (config.logoType === 'preset') {
      const IconComp = PRESET_ICONS[config.presetLogoId];
      if (IconComp) {
        const iconSize = lw * 0.65;
        const ix = lcx - iconSize / 2;
        const iy = lcy - iconSize / 2;
        const iconColor = config.colorType === 'solid' ? config.foregroundSolid : config.gradientColor1;
        logoContentNode = (
          <g transform={`translate(${ix}, ${iy})`}>
            <IconComp size={iconSize} color={iconColor} stroke={iconColor} style={{ color: iconColor }} />
          </g>
        );
      }
    } else if (config.logoType === 'custom' && config.customLogoUrl) {
      logoContentNode = (
        <image 
          href={config.customLogoUrl} 
          xlinkHref={config.customLogoUrl}
          x={lx} 
          y={ly} 
          width={lw} 
          height={lh} 
          preserveAspectRatio="xMidYMid meet"
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <g id={`${instanceId}-logo-container`}>
        {bgNode}
        {logoContentNode}
      </g>
    );
  }, [config, sizePx, instanceId]);

  if (!qrCodeData || !svgElements) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#132A86]" />
        <p className="text-[#132A86]/60 text-sm mt-3 font-medium">Generating matrix...</p>
      </div>
    );
  }

  // Calculate SVG ViewBox with Frame
  const totalSvgWidth = sizePx + 24;
  const totalSvgHeight = sizePx + 24 + frameHeight;
  const qrTranslateX = 12;
  const qrTranslateY = isTopFrame ? frameHeight + 12 : 12;

  const qrGradientId = `${instanceId}-qr-gradient`;
  const bgGradientId = `${instanceId}-bg-gradient`;
  const bgImgPatternId = `${instanceId}-bg-img-pattern`;

  const fillStyle = config.colorType === 'gradient' ? `url(#${qrGradientId})` : config.foregroundSolid;

  // Background style
  let backgroundFill = 'transparent';
  if (config.backgroundType === 'solid') {
    backgroundFill = config.backgroundColor;
  } else if (config.backgroundType === 'gradient') {
    backgroundFill = `url(#${bgGradientId})`;
  }

  return (
    <div 
      ref={containerRef} 
      className="relative flex flex-col items-center justify-center p-3 rounded-[32px] bg-white/90 shadow-2xl border border-white/90 select-none overflow-hidden max-w-full"
      id={`${instanceId}-card`}
    >
      <svg 
        id={instanceId}
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 ${totalSvgWidth} ${totalSvgHeight}`}
        width="100%"
        height="100%"
        className="select-none max-w-full max-h-[460px]"
        style={{
          background: backgroundFill,
          borderRadius: '24px'
        }}
      >
        <defs>
          {/* QR Code Foreground Gradient */}
          {config.colorType === 'gradient' && (
            <linearGradient 
              id={qrGradientId} 
              x1="0%" 
              y1="0%" 
              x2={Math.cos((config.gradientAngle * Math.PI) / 180) > 0 ? '100%' : '0%'} 
              y2={Math.sin((config.gradientAngle * Math.PI) / 180) > 0 ? '100%' : '0%'}
            >
              <stop offset="0%" stopColor={config.gradientColor1} />
              <stop offset="100%" stopColor={config.gradientColor2} />
            </linearGradient>
          )}

          {/* Background Gradient */}
          {config.backgroundType === 'gradient' && (
            <linearGradient id={bgGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.bgGradientColor1} />
              <stop offset="100%" stopColor={config.bgGradientColor2} />
            </linearGradient>
          )}

          {/* Background Image Pattern */}
          {config.backgroundType === 'image' && config.bgImageUrl && (
            <pattern id={bgImgPatternId} patternUnits="userSpaceOnUse" width={totalSvgWidth} height={totalSvgHeight}>
              <image href={config.bgImageUrl} xlinkHref={config.bgImageUrl} x="0" y="0" width={totalSvgWidth} height={totalSvgHeight} opacity={config.bgImageOpacity} preserveAspectRatio="xMidYMid slice" />
            </pattern>
          )}
        </defs>

        {/* Background Image Layer if active */}
        {config.backgroundType === 'image' && config.bgImageUrl && (
          <rect width={totalSvgWidth} height={totalSvgHeight} fill={`url(#${bgImgPatternId})`} rx="24" />
        )}

        {/* Frame Rendering with proportional dimensions */}
        {hasFrame && (() => {
          const pillWidth = Math.min(totalSvgWidth * 0.72, totalSvgWidth - 24);
          const pillHeight = Math.max(18, Math.round(frameHeight * 0.7));
          const textLength = (config.frameText || 'SCAN ME').length;
          const dynamicFontSize = Math.max(8, Math.min(13, Math.floor((pillWidth / (textLength || 7)) * 1.05), Math.floor(pillHeight * 0.52)));

          return (
            <g id="qr-frame-layer">
              {/* Polaroid frame bottom card */}
              {config.frameStyle === 'polaroid' && (
                <rect
                  x="8"
                  y={totalSvgHeight - frameHeight + 4}
                  width={totalSvgWidth - 16}
                  height={frameHeight - 8}
                  rx="10"
                  fill={config.frameColor || '#132A86'}
                />
              )}

              {/* Pill badge frame (scan-me-bottom) */}
              {config.frameStyle === 'scan-me-bottom' && (
                <rect
                  x={(totalSvgWidth - pillWidth) / 2}
                  y={totalSvgHeight - pillHeight - 6}
                  width={pillWidth}
                  height={pillHeight}
                  rx={pillHeight / 2}
                  fill={config.frameColor || '#132A86'}
                />
              )}

              {/* Pill badge frame (scan-me-top) */}
              {config.frameStyle === 'scan-me-top' && (
                <rect
                  x={(totalSvgWidth - pillWidth) / 2}
                  y="6"
                  width={pillWidth}
                  height={pillHeight}
                  rx={pillHeight / 2}
                  fill={config.frameColor || '#132A86'}
                />
              )}

              {/* Card frame */}
              {config.frameStyle === 'card' && (
                <rect
                  x="8"
                  y={totalSvgHeight - frameHeight + 4}
                  width={totalSvgWidth - 16}
                  height={frameHeight - 8}
                  rx="8"
                  fill={config.frameColor || '#132A86'}
                />
              )}

              {/* Minimal tag */}
              {config.frameStyle === 'minimal-tag' && (
                <rect
                  x={(totalSvgWidth - Math.min(pillWidth * 0.85, totalSvgWidth - 30)) / 2}
                  y={totalSvgHeight - pillHeight - 4}
                  width={Math.min(pillWidth * 0.85, totalSvgWidth - 30)}
                  height={pillHeight}
                  rx={pillHeight / 2}
                  fill={config.frameColor || '#132A86'}
                />
              )}

              {/* Frame Text - Vertically & Horizontally Centered */}
              <text
                x={totalSvgWidth / 2}
                y={
                  isTopFrame
                    ? 6 + pillHeight / 2 + dynamicFontSize * 0.35
                    : (config.frameStyle === 'polaroid' || config.frameStyle === 'card'
                        ? (totalSvgHeight - frameHeight + 4) + (frameHeight - 8) / 2 + dynamicFontSize * 0.35
                        : (totalSvgHeight - pillHeight - 6) + pillHeight / 2 + dynamicFontSize * 0.35)
                }
                fill={config.frameTextColor || '#FFFFFF'}
                fontSize={dynamicFontSize}
                fontWeight="800"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                textAnchor="middle"
                letterSpacing="0.8"
              >
                {config.frameText || 'SCAN ME'}
              </text>
            </g>
          );
        })()}

        {/* QR Code Graphic Group */}
        <g transform={`translate(${qrTranslateX}, ${qrTranslateY})`}>
          {/* Main Module Paths */}
          <path 
            d={svgElements.bodyPathString} 
            fill={fillStyle} 
            className="transition-all duration-300 ease-in-out"
          />

          {/* Finder Eyes */}
          <g id="qr-eyes-wrapper" className="transition-all duration-300 ease-in-out">
            {svgElements.eyeElements}
          </g>

          {/* Center Logo */}
          <g id="qr-logo-wrapper">
            {logoElement}
          </g>
        </g>
      </svg>
    </div>
  );
};
