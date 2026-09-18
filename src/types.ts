export type QRType = 
  | 'url' 
  | 'text' 
  | 'phone' 
  | 'email' 
  | 'whatsapp' 
  | 'telegram' 
  | 'instagram' 
  | 'wifi' 
  | 'vcard' 
  | 'location' 
  | 'event' 
  | 'sms';

export interface WIFIConfig {
  ssid: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface SMSConfig {
  phone: string;
  message?: string;
}

export interface EmailConfig {
  email: string;
  subject?: string;
  body?: string;
}

export interface VCardConfig {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  url?: string;
}

export interface WhatsAppConfig {
  phone: string;
  message?: string;
}

export interface TelegramConfig {
  username: string;
}

export interface InstagramConfig {
  username: string;
}

export interface LocationConfig {
  latitude: string;
  longitude: string;
  query?: string;
}

export interface EventConfig {
  title: string;
  startDate: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  description?: string;
}

export type DotStyle = 'square' | 'rounded' | 'dots' | 'fluid' | 'classy';
export type EyeOuterStyle = 'square' | 'rounded' | 'extra-rounded' | 'circular';
export type EyeInnerStyle = 'square' | 'rounded' | 'circular' | 'diamond';

export type FrameStyle = 
  | 'none' 
  | 'scan-me-bottom' 
  | 'scan-me-top' 
  | 'card' 
  | 'polaroid' 
  | 'phone' 
  | 'minimal-tag';

export interface QRStyleConfig {
  dotStyle: DotStyle;
  eyeOuterStyle: EyeOuterStyle;
  eyeInnerStyle: EyeInnerStyle;
  
  // Colors
  colorType: 'solid' | 'gradient';
  foregroundSolid: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientAngle: number;
  gradientType: 'linear' | 'radial';
  
  // Background
  backgroundType: 'solid' | 'transparent' | 'gradient' | 'image';
  backgroundColor: string;
  bgGradientColor1: string;
  bgGradientColor2: string;
  bgGradientAngle: number;
  bgImageUrl: string | null;
  bgImageOpacity: number;
  
  // Custom eye coloring
  customEyeColor: boolean;
  eyeOuterColor: string;
  eyeInnerColor: string;
  
  // Logo settings
  logoType: 'none' | 'preset' | 'custom';
  presetLogoId: string;
  customLogoUrl: string | null;
  customLogoFileName: string | null;
  logoSize: number; // Percentage 10 to 35
  logoBgShape: 'none' | 'circle' | 'square';
  logoBgPadding: boolean;
  
  // Frame settings
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  frameTextColor: string;

  // Advanced
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number; // Quiet zone
  sizeScale: number;
}

export interface QRConfig extends QRStyleConfig {
  content: string;
}

export interface DesignPreset {
  id: string;
  name: string;
  description: string;
  config: QRStyleConfig;
}

export interface AppleColorPreset {
  id: string;
  nameUz: string;
  nameEn: string;
  hex: string;
  textColor: string;
}

export interface GradientPreset {
  id: string;
  name: string;
  color1: string;
  color2: string;
  angle: number;
}

export interface UserSettings {
  language: 'en' | 'uz';
  defaultExportFormat: 'png' | 'svg' | 'pdf' | 'jpg';
  defaultErrorCorrection: 'L' | 'M' | 'Q' | 'H';
  defaultSize: number;
  defaultMargin: number;
  autoSave: boolean;
  highResolution: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  tier?: 'free' | 'pro' | 'enterprise';
  createdAt: number;
  settings?: UserSettings;
  isOnline?: boolean;
  currentSessionId?: string;
  loginAt?: string;
  lastSeenAt?: string;
  logoutAt?: string | null;
  sessionCount?: number;
}

export interface UserSession {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  loginAt: string;
  lastSeenAt: string;
  logoutAt?: string | null;
  status: 'online' | 'offline' | 'force_signed_out';
  device?: string;
  userAgent?: string;
}

export interface AdminActionRecord {
  id: string;
  action: string;
  actionType: string;
  targetUserId: string;
  targetUserName?: string;
  details?: string;
  timestamp: string;
  adminRole?: string;
}

export interface SavedQRCodeRecord {
  id: string;
  userId?: string;
  name: string;
  type: QRType;
  content: string;
  config: QRStyleConfig;
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
  templateId?: string;
  scanCount?: number;
}

export interface DailyUsage {
  date: string; // YYYY-MM-DD (Asia/Tashkent UTC+5)
  count: number; // Max 15 per day
  createdQrIds: string[];
}

export interface HistoryItem {
  id: string;
  title: string;
  type: QRType;
  createdAt: number;
  updatedAt?: number;
  config: QRStyleConfig;
  content: string;
}

export type TemplateCategory = 
  | 'business'
  | 'restaurant'
  | 'wifi'
  | 'instagram'
  | 'telegram'
  | 'youtube'
  | 'social'
  | 'education'
  | 'event'
  | 'portfolio'
  | 'contact'
  | 'product'
  | 'payment'
  | 'poster'
  | 'menu'
  | 'personal';

export interface TemplateItem {
  id: string;
  nameUz: string;
  nameEn: string;
  category: TemplateCategory;
  categoryNameUz: string;
  categoryNameEn: string;
  content: string;
  type: QRType;
  config: QRStyleConfig;
  isPopular?: boolean;
}

