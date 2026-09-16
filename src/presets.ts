import { DesignPreset, AppleColorPreset, GradientPreset } from './types';

export const INITIAL_CONFIG: DesignPreset['config'] = {
  dotStyle: 'rounded',
  eyeOuterStyle: 'rounded',
  eyeInnerStyle: 'rounded',
  
  colorType: 'gradient',
  foregroundSolid: '#132A86',
  gradientColor1: '#132A86',
  gradientColor2: '#11AB9F', // slightly darker turquoise for maximum contrast/readability
  gradientAngle: 135,
  gradientType: 'linear',
  
  backgroundType: 'solid',
  backgroundColor: '#FFFFFF',
  bgGradientColor1: '#F8FAFC',
  bgGradientColor2: '#EEF6FF',
  bgGradientAngle: 135,
  bgImageUrl: null,
  bgImageOpacity: 0.85,
  
  customEyeColor: true,
  eyeOuterColor: '#132A86',
  eyeInnerColor: '#1FD0C2',
  
  logoType: 'none',
  presetLogoId: 'link',
  customLogoUrl: null,
  customLogoFileName: null,
  logoSize: 22,
  logoBgShape: 'circle',
  logoBgPadding: true,

  frameStyle: 'none',
  frameText: 'SCAN ME',
  frameColor: '#132A86',
  frameTextColor: '#FFFFFF',
  
  errorCorrectionLevel: 'Q',
  margin: 1,
  sizeScale: 1,
};

export const APPLE_COLORS: AppleColorPreset[] = [
  { id: 'soft-blue', nameUz: 'Yumshoq Ko\'k', nameEn: 'Soft Blue', hex: '#0071E3', textColor: '#FFFFFF' },
  { id: 'sky-blue', nameUz: 'Osmon Moviy', nameEn: 'Sky Blue', hex: '#2997FF', textColor: '#FFFFFF' },
  { id: 'deep-blue', nameUz: 'To\'q Ko\'k', nameEn: 'Deep Blue', hex: '#0B2545', textColor: '#FFFFFF' },
  { id: 'cyan', nameUz: 'Sian (Moviy)', nameEn: 'Cyan', hex: '#5AC8FA', textColor: '#0A143A' },
  { id: 'turquoise', nameUz: 'Feruza', nameEn: 'Turquoise', hex: '#2FD5C6', textColor: '#0A143A' },
  { id: 'teal', nameUz: 'Dengiz To\'lqini', nameEn: 'Teal', hex: '#30B0C7', textColor: '#0A143A' },
  { id: 'indigo', nameUz: 'Indigo', nameEn: 'Indigo', hex: '#5856D6', textColor: '#FFFFFF' },
  { id: 'violet', nameUz: 'Binafsharang', nameEn: 'Violet', hex: '#6B46C1', textColor: '#FFFFFF' },
  { id: 'soft-purple', nameUz: 'Yumshoq Siyohrang', nameEn: 'Soft Purple', hex: '#AF52DE', textColor: '#FFFFFF' },
  { id: 'pink', nameUz: 'Pushti', nameEn: 'Pink', hex: '#FF2D55', textColor: '#FFFFFF' },
  { id: 'orange', nameUz: 'Apelsinrang', nameEn: 'Orange', hex: '#FF9500', textColor: '#FFFFFF' },
  { id: 'yellow', nameUz: 'Sariq', nameEn: 'Yellow', hex: '#FFCC00', textColor: '#0A143A' },
  { id: 'green', nameUz: 'Yashil', nameEn: 'Green', hex: '#34C759', textColor: '#FFFFFF' },
  { id: 'red', nameUz: 'Qizil', nameEn: 'Red', hex: '#FF3B30', textColor: '#FFFFFF' },
];

export const GRADIENT_PRESETS: GradientPreset[] = [
  { id: 'liquid-marine', name: 'Liquid Marine', color1: '#132A86', color2: '#1FD0C2', angle: 135 },
  { id: 'apple-ocean', name: 'Apple Ocean', color1: '#0071E3', color2: '#5AC8FA', angle: 135 },
  { id: 'emerald-mint', name: 'Emerald Mint', color1: '#0F766E', color2: '#34C759', angle: 135 },
  { id: 'sunset-blaze', name: 'Sunset Blaze', color1: '#FF3B30', color2: '#FF9500', angle: 135 },
  { id: 'neon-violet', name: 'Neon Violet', color1: '#6366F1', color2: '#AF52DE', angle: 135 },
  { id: 'royal-indigo', name: 'Royal Indigo', color1: '#1E1B4B', color2: '#5856D6', angle: 135 },
  { id: 'cyber-dark', name: 'Cyber Slate', color1: '#0F172A', color2: '#334155', angle: 135 },
  { id: 'peach-glow', name: 'Peach Glow', color1: '#FF2D55', color2: '#FFCC00', angle: 135 },
  { id: 'deep-space', name: 'Deep Space', color1: '#030712', color2: '#132A86', angle: 135 },
  { id: 'glacier-teal', name: 'Glacier Teal', color1: '#0E7490', color2: '#67E8F9', angle: 135 },
];

export const PRESETS: DesignPreset[] = [
  {
    id: 'scanforge-classic',
    name: 'Liquid Glass',
    description: 'The official ScanForge signature look featuring smooth navy and turquoise gradient with rounded elements.',
    config: {
      ...INITIAL_CONFIG,
      colorType: 'gradient',
      gradientColor1: '#132A86',
      gradientColor2: '#1FD0C2',
      dotStyle: 'rounded',
      eyeOuterStyle: 'rounded',
      eyeInnerStyle: 'rounded',
      customEyeColor: true,
      eyeOuterColor: '#132A86',
      eyeInnerColor: '#1FD0C2',
    }
  },
  {
    id: 'oceanic',
    name: 'Oceanic Horizon',
    description: 'Deep marine solid tone with circular modules for high accuracy and precision scans.',
    config: {
      ...INITIAL_CONFIG,
      colorType: 'solid',
      foregroundSolid: '#132A86',
      dotStyle: 'dots',
      eyeOuterStyle: 'circular',
      eyeInnerStyle: 'circular',
      customEyeColor: false,
    }
  },
  {
    id: 'cyber-mint',
    name: 'Mint Breeze',
    description: 'Bright electric turquoise combined with deep slate accents, ideal for digital storefronts.',
    config: {
      ...INITIAL_CONFIG,
      colorType: 'gradient',
      gradientColor1: '#1FD0C2',
      gradientColor2: '#0D9488',
      dotStyle: 'classy',
      eyeOuterStyle: 'extra-rounded',
      eyeInnerStyle: 'circular',
      customEyeColor: true,
      eyeOuterColor: '#0F766E',
      eyeInnerColor: '#1FD0C2',
    }
  },
  {
    id: 'obsidian',
    name: 'Obsidian Minimalist',
    description: 'Pure, high-contrast monochrome design utilizing square shapes for timeless classic aesthetics.',
    config: {
      ...INITIAL_CONFIG,
      colorType: 'solid',
      foregroundSolid: '#0F172A',
      dotStyle: 'square',
      eyeOuterStyle: 'square',
      eyeInnerStyle: 'square',
      customEyeColor: false,
    }
  },
  {
    id: 'aurora',
    name: 'Nordic Aurora',
    description: 'Ethereal purple to turquoise flowing gradient with connected modules for creative profiles.',
    config: {
      ...INITIAL_CONFIG,
      colorType: 'gradient',
      gradientColor1: '#6366F1',
      gradientColor2: '#1FD0C2',
      dotStyle: 'fluid',
      eyeOuterStyle: 'extra-rounded',
      eyeInnerStyle: 'diamond',
      customEyeColor: true,
      eyeOuterColor: '#4F46E5',
      eyeInnerColor: '#1FD0C2',
    }
  }
];

export const PRESET_LOGOS = [
  { id: 'link', name: 'Web Link', icon: 'Link' },
  { id: 'telegram', name: 'Telegram', icon: 'Send' },
  { id: 'instagram', name: 'Instagram', icon: 'Instagram' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle' },
  { id: 'wifi', name: 'Wi-Fi Network', icon: 'Wifi' },
  { id: 'phone', name: 'Telephone', icon: 'Phone' },
  { id: 'mail', name: 'Email Address', icon: 'Mail' },
  { id: 'map', name: 'Location', icon: 'MapPin' },
  { id: 'calendar', name: 'Event', icon: 'Calendar' },
  { id: 'sms', name: 'SMS Message', icon: 'MessageSquare' },
  { id: 'apple', name: 'Apple', icon: 'Apple' },
  { id: 'github', name: 'GitHub', icon: 'Github' },
  { id: 'globe', name: 'Global Web', icon: 'Globe' },
];
