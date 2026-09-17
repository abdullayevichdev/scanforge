import React, { useEffect, useState } from 'react';
import { 
  Link as LinkIcon, 
  FileText, 
  Mail, 
  Phone, 
  Wifi, 
  MessageSquare, 
  User, 
  Building, 
  MapPin, 
  Globe, 
  Briefcase,
  Lock,
  Unlock,
  Send,
  Instagram,
  Calendar,
  Compass,
  Navigation
} from 'lucide-react';
import { 
  QRType, 
  WIFIConfig, 
  SMSConfig, 
  EmailConfig, 
  VCardConfig, 
  WhatsAppConfig, 
  TelegramConfig, 
  InstagramConfig, 
  LocationConfig, 
  EventConfig 
} from '../types';
import { 
  formatWifiString, 
  formatSMSString, 
  formatEmailString, 
  formatVCardString,
  formatWhatsAppString,
  formatTelegramString,
  formatInstagramString,
  formatLocationString,
  formatEventString 
} from '../utils/qrUtils';
import { useLanguage } from '../context/LanguageContext';

interface QRInputFormProps {
  activeType: QRType;
  value?: string;
  onValueChange: (formattedValue: string) => void;
}

export const QRInputForm: React.FC<QRInputFormProps> = ({ activeType, value, onValueChange }) => {
  const { lang, t } = useLanguage();

  const lastEmittedValue = React.useRef<string>('');

  // Local state for all 12 QR types
  const [url, setUrl] = useState(() => {
    return value || 'https://scanforge.uz';
  });

  const [text, setText] = useState(() => {
    if (value && !/^https?:\/\//i.test(value) && !/^tel:/i.test(value) && !/^mailto:/i.test(value) && !/^WIFI:/i.test(value)) {
      return value;
    }
    return '';
  });
  
  const [phone, setPhone] = useState('+998901234567');

  const [email, setEmail] = useState<EmailConfig>({
    email: 'contact@scanforge.uz',
    subject: lang === 'uz' ? 'ScanForge QR Kodingiz' : 'ScanForge QR Inquiry',
    body: lang === 'uz' ? 'Assalomu alaykum! ScanForge orqali yuborildi.' : 'Hello! Sent via ScanForge.',
  });

  const [whatsapp, setWhatsapp] = useState<WhatsAppConfig>({
    phone: '+998901234567',
    message: lang === 'uz' ? 'Assalomu alaykum! Siz bilan bog\'lanmoqdaman.' : 'Hello! I am reaching out to you.',
  });

  const [telegram, setTelegram] = useState<TelegramConfig>({
    username: 'scanforge_uz',
  });

  const [instagram, setInstagram] = useState<InstagramConfig>({
    username: 'scanforge.uz',
  });

  const [wifi, setWifi] = useState<WIFIConfig>({
    ssid: 'ScanForge_Guest_WiFi',
    password: 'securepassword123',
    security: 'WPA',
    hidden: false,
  });

  const [vcard, setVcard] = useState<VCardConfig>({
    firstName: 'Abdulhay',
    lastName: 'Avazxanov',
    organization: 'ScanForge',
    title: lang === 'uz' ? 'Dastur Arxitektori' : 'Software Architect',
    phone: '+998933223580',
    email: 'abdulhay@scanforge.uz',
    address: lang === 'uz' ? 'Toshkent, O\'zbekiston' : 'Tashkent, Uzbekistan',
    url: 'https://scanforge.uz',
  });

  const [location, setLocation] = useState<LocationConfig>({
    latitude: '41.311081',
    longitude: '69.240562',
    query: lang === 'uz' ? 'Amir Temur Xiyoboni, Toshkent' : 'Amir Temur Square, Tashkent',
  });

  const [event, setEvent] = useState<EventConfig>({
    title: lang === 'uz' ? 'ScanForge Taqdimoti 2026' : 'ScanForge Launch 2026',
    startDate: '2026-10-15',
    startTime: '10:00',
    endDate: '2026-10-15',
    endTime: '12:30',
    location: lang === 'uz' ? 'Toshkent, Kongress Zali' : 'Tashkent, Congress Hall',
    description: lang === 'uz' ? 'ScanForge QR tizimining rasmiy taqdimoti.' : 'The official presentation of ScanForge QR platform.',
  });

  const [sms, setSms] = useState<SMSConfig>({
    phone: '+998901234567',
    message: lang === 'uz' ? 'ScanForge orqali yuborilgan xabar' : 'Message sent via ScanForge',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Sync state when value prop changes externally (e.g. from history or template)
  useEffect(() => {
    if (value !== undefined && value !== lastEmittedValue.current) {
      lastEmittedValue.current = value;
      if (activeType === 'url') {
        setUrl(value);
      } else if (activeType === 'text') {
        setText(value);
      } else if (activeType === 'phone') {
        setPhone(value.replace(/^tel:/i, ''));
      } else if (activeType === 'telegram') {
        const clean = value.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '');
        setTelegram({ username: clean });
      } else if (activeType === 'instagram') {
        const clean = value.replace(/^https?:\/\/instagram\.com\//i, '').replace(/^@/, '');
        setInstagram({ username: clean });
      }
    }
  }, [value, activeType]);

  // Compute the final payload string whenever inputs or type change
  useEffect(() => {
    let formatted = '';
    switch (activeType) {
      case 'url': {
        const trimmed = url.trim();
        if (!trimmed) {
          formatted = '';
        } else if (!/^https?:\/\//i.test(trimmed) && !/^mailto:/i.test(trimmed) && !/^tel:/i.test(trimmed)) {
          formatted = `https://${trimmed}`;
        } else {
          formatted = trimmed;
        }
        break;
      }
      case 'text':
        formatted = text || '';
        break;
      case 'phone':
        formatted = phone.trim() ? `tel:${phone.trim()}` : '';
        break;
      case 'email':
        formatted = email.email ? formatEmailString(email) : '';
        break;
      case 'whatsapp':
        formatted = whatsapp.phone ? formatWhatsAppString(whatsapp) : '';
        break;
      case 'telegram':
        formatted = telegram.username ? formatTelegramString(telegram) : '';
        break;
      case 'instagram':
        formatted = instagram.username ? formatInstagramString(instagram) : '';
        break;
      case 'wifi':
        formatted = wifi.ssid ? formatWifiString(wifi) : '';
        break;
      case 'vcard':
        formatted = (vcard.firstName || vcard.lastName) ? formatVCardString(vcard) : '';
        break;
      case 'location':
        formatted = formatLocationString(location);
        break;
      case 'event':
        formatted = formatEventString(event);
        break;
      case 'sms':
        formatted = sms.phone ? formatSMSString(sms) : '';
        break;
    }
    lastEmittedValue.current = formatted;
    onValueChange(formatted);
  }, [activeType, url, text, phone, email, whatsapp, telegram, instagram, wifi, vcard, location, event, sms]);

  const inputBaseStyle = "w-full bg-white/90 border border-[#132A86]/15 rounded-[14px] px-4 py-3 pl-11 text-[#0A143A] placeholder:text-[#4A577D]/50 focus:outline-none focus:border-[#1FD0C2] focus:ring-2 focus:ring-[#1FD0C2]/20 transition-all text-xs sm:text-sm font-medium shadow-xs";

  return (
    <div className="w-full" id="qr-input-form-container">
      {/* 1. WEBSITE URL */}
      {activeType === 'url' && (
        <div className="space-y-4 animate-fadeIn" id="form-url">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.urlLabel}
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="text"
                className={inputBaseStyle}
                placeholder={t.builder.fields.urlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                id="input-url-field"
              />
            </div>
            <p className="text-[11px] text-[#4A577D] mt-1.5 leading-relaxed">
              <span className="font-semibold text-[#132A86]">URL:</span>{' '}
              {lang === 'uz' ? 'Istalgan havola yoki domen manzilini kiriting' : 'Enter any website link or web address'}
            </p>
          </div>
        </div>
      )}

      {/* 2. PLAIN TEXT */}
      {activeType === 'text' && (
        <div className="space-y-4 animate-fadeIn" id="form-text">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.textLabel}
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <textarea
                className={`${inputBaseStyle} min-h-[120px] resize-none py-3`}
                placeholder={t.builder.fields.textPlaceholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
                id="input-text-field"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#4A577D] mt-1.5">
              <span>{lang === 'uz' ? 'QR kodga istalgan matn yoki eslatmani joylashtiring' : 'Embed any text or note inside the QR code'}</span>
              <span className="font-mono">{text.length}/500</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. PHONE NUMBER */}
      {activeType === 'phone' && (
        <div className="space-y-4 animate-fadeIn" id="form-phone">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.phoneNumber}
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="tel"
                className={inputBaseStyle}
                placeholder={t.builder.fields.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="input-phone-field"
              />
            </div>
            <p className="text-[11px] text-[#4A577D] mt-1.5">
              {lang === 'uz' ? 'Skanerlanganda to\'g\'ridan-to\'g\'ri raqam terish ilovasi ochiladi.' : 'Scanning will instantly open the native phone dialer.'}
            </p>
          </div>
        </div>
      )}

      {/* 4. EMAIL */}
      {activeType === 'email' && (
        <div className="space-y-4 animate-fadeIn" id="form-email">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.emailTo}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="email"
                className={inputBaseStyle}
                placeholder="name@example.com"
                value={email.email}
                onChange={(e) => setEmail({ ...email, email: e.target.value })}
                id="input-email-address"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.emailSubject}
            </label>
            <input
              type="text"
              className={inputBaseStyle.replace('pl-11', 'pl-4')}
              placeholder={lang === 'uz' ? 'Xat mavzusi' : 'Subject line'}
              value={email.subject || ''}
              onChange={(e) => setEmail({ ...email, subject: e.target.value })}
              id="input-email-subject"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.emailBody}
            </label>
            <textarea
              className={`${inputBaseStyle.replace('pl-11', 'pl-4')} min-h-[90px] resize-none`}
              placeholder={lang === 'uz' ? 'Xat mazmuni...' : 'Email message body...'}
              value={email.body || ''}
              onChange={(e) => setEmail({ ...email, body: e.target.value })}
              id="input-email-body"
            />
          </div>
        </div>
      )}

      {/* 5. WHATSAPP */}
      {activeType === 'whatsapp' && (
        <div className="space-y-4 animate-fadeIn" id="form-whatsapp">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.whatsappPhone}
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="tel"
                className={inputBaseStyle}
                placeholder="+998 90 123 45 67"
                value={whatsapp.phone}
                onChange={(e) => setWhatsapp({ ...whatsapp, phone: e.target.value })}
                id="input-whatsapp-phone"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.whatsappMessage}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="text"
                className={inputBaseStyle}
                placeholder={lang === 'uz' ? 'Salom, mahsulot bo\'yicha ma\'lumot olmoqchi edim...' : 'Hello, I would like to learn more about your services...'}
                value={whatsapp.message || ''}
                onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })}
                id="input-whatsapp-message"
              />
            </div>
            <p className="text-[11px] text-[#4A577D] mt-1.5">
              {lang === 'uz' ? 'Skanerlanganda to\'g\'ridan-to\'g\'ri WhatsApp ilovasi ochiladi.' : 'Scanning directly opens WhatsApp with this pre-filled message.'}
            </p>
          </div>
        </div>
      )}

      {/* 6. TELEGRAM */}
      {activeType === 'telegram' && (
        <div className="space-y-4 animate-fadeIn" id="form-telegram">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.telegramUsername}
            </label>
            <div className="relative">
              <Send className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="text"
                className={inputBaseStyle}
                placeholder={lang === 'uz' ? '@foydalanuvchi yoki https://t.me/kanal' : '@username or https://t.me/channel'}
                value={telegram.username}
                onChange={(e) => setTelegram({ username: e.target.value })}
                id="input-telegram-username"
              />
            </div>
            <p className="text-[11px] text-[#4A577D] mt-1.5">
              {lang === 'uz' ? 'Shaxsiy profil, guruh, bot yoki kanal havolasini kiriting.' : 'Enter a personal profile, group, bot, or public channel username.'}
            </p>
          </div>
        </div>
      )}

      {/* 7. INSTAGRAM */}
      {activeType === 'instagram' && (
        <div className="space-y-4 animate-fadeIn" id="form-instagram">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.instagramUsername}
            </label>
            <div className="relative">
              <Instagram className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="text"
                className={inputBaseStyle}
                placeholder={lang === 'uz' ? '@foydalanuvchi yoki https://instagram.com/profil' : '@username or https://instagram.com/profile'}
                value={instagram.username}
                onChange={(e) => setInstagram({ username: e.target.value })}
                id="input-instagram-username"
              />
            </div>
            <p className="text-[11px] text-[#4A577D] mt-1.5">
              {lang === 'uz' ? 'Skanerlanganda foydalanuvchini Instagram sahifangizga yo\'naltiradi.' : 'Scanning will redirect users straight to your Instagram profile.'}
            </p>
          </div>
        </div>
      )}

      {/* 8. WI-FI */}
      {activeType === 'wifi' && (
        <div className="space-y-4 animate-fadeIn" id="form-wifi">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.wifiSsid}
            </label>
            <div className="relative">
              <Wifi className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="text"
                className={inputBaseStyle}
                placeholder={t.builder.fields.wifiSsidPlaceholder}
                value={wifi.ssid}
                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                id="input-wifi-ssid"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.wifiSecurity}
              </label>
              <select
                value={wifi.security}
                onChange={(e) => setWifi({ ...wifi, security: e.target.value as any })}
                className="w-full bg-white/90 border border-[#132A86]/15 rounded-[14px] px-4 py-3 text-[#0A143A] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#1FD0C2]"
                id="input-wifi-security"
              >
                <option value="WPA">{lang === 'uz' ? 'WPA / WPA2 / WPA3 (Tavsiya)' : 'WPA / WPA2 / WPA3 (Recommended)'}</option>
                <option value="WEP">{lang === 'uz' ? 'WEP (Eski standart)' : 'WEP (Legacy)'}</option>
                <option value="nopass">{lang === 'uz' ? 'Ochiq Tarmoq (Parolsiz)' : 'Open Network (No password)'}</option>
              </select>
            </div>

            {wifi.security !== 'nopass' && (
              <div>
                <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                  {t.builder.fields.wifiPassword}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#132A86]/60 hover:text-[#132A86] cursor-pointer"
                  >
                    {showPassword ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={inputBaseStyle.replace('pl-11', 'pl-4 pr-10')}
                    placeholder={t.builder.fields.wifiPasswordPlaceholder}
                    value={wifi.password || ''}
                    onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                    id="input-wifi-password"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="wifi-hidden"
              checked={wifi.hidden || false}
              onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
              className="w-4 h-4 rounded text-[#132A86] focus:ring-[#1FD0C2] cursor-pointer"
            />
            <label htmlFor="wifi-hidden" className="text-xs text-[#0A143A] font-medium cursor-pointer">
              {t.builder.fields.wifiHidden}
            </label>
          </div>
        </div>
      )}

      {/* 9. VCARD CONTACT */}
      {activeType === 'vcard' && (
        <div className="space-y-4 animate-fadeIn" id="form-vcard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.contactFirst}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                <input
                  type="text"
                  className={inputBaseStyle}
                  placeholder={lang === 'uz' ? 'Ism' : 'First Name'}
                  value={vcard.firstName}
                  onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })}
                  id="input-vcard-first"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.contactLast}
              </label>
              <input
                type="text"
                className={inputBaseStyle.replace('pl-11', 'pl-4')}
                placeholder={lang === 'uz' ? 'Familiya' : 'Last Name'}
                value={vcard.lastName}
                onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })}
                id="input-vcard-last"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.contactOrg}
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                <input
                  type="text"
                  className={inputBaseStyle}
                  placeholder={lang === 'uz' ? 'Tashkilot' : 'Organization / Company'}
                  value={vcard.organization}
                  onChange={(e) => setVcard({ ...vcard, organization: e.target.value })}
                  id="input-vcard-org"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.contactTitle}
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                <input
                  type="text"
                  className={inputBaseStyle}
                  placeholder={lang === 'uz' ? 'Lavozim' : 'Job Title'}
                  value={vcard.title}
                  onChange={(e) => setVcard({ ...vcard, title: e.target.value })}
                  id="input-vcard-title"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.contactPhone}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                <input
                  type="tel"
                  className={inputBaseStyle}
                  placeholder="+998 90 123 45 67"
                  value={vcard.phone}
                  onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
                  id="input-vcard-phone"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.contactEmail}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                <input
                  type="email"
                  className={inputBaseStyle}
                  placeholder="name@mail.com"
                  value={vcard.email}
                  onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                  id="input-vcard-email"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.contactAddress}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                <input
                  type="text"
                  className={inputBaseStyle}
                  placeholder={lang === 'uz' ? "Shahar, Ko'cha" : "City, Street address"}
                  value={vcard.address}
                  onChange={(e) => setVcard({ ...vcard, address: e.target.value })}
                  id="input-vcard-address"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.contactWebsite}
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                <input
                  type="text"
                  className={inputBaseStyle}
                  placeholder="https://company.uz"
                  value={vcard.url}
                  onChange={(e) => setVcard({ ...vcard, url: e.target.value })}
                  id="input-vcard-url"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. LOCATION / MAPS */}
      {activeType === 'location' && (
        <div className="space-y-4 animate-fadeIn" id="form-location">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.locationQuery}
            </label>
            <div className="relative">
              <Navigation className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="text"
                className={inputBaseStyle}
                placeholder={lang === 'uz' ? "Masalan: Samarqand Registon maydoni" : "e.g. Amir Temur Square, Tashkent"}
                value={location.query || ''}
                onChange={(e) => setLocation({ ...location, query: e.target.value })}
                id="input-location-query"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.locationLat}
              </label>
              <div className="relative">
                <Compass className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                <input
                  type="text"
                  className={inputBaseStyle}
                  placeholder="41.311081"
                  value={location.latitude}
                  onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                  id="input-location-lat"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.locationLng}
              </label>
              <div className="relative">
                <Compass className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
                <input
                  type="text"
                  className={inputBaseStyle}
                  placeholder="69.240562"
                  value={location.longitude}
                  onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
                  id="input-location-lng"
                />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-[#4A577D]">
            {lang === 'uz' ? 'Skanerlanganda telefon foydalanuvchisi xaritalar orqali ko\'rsatilgan joyga yo\'naltiriladi.' : 'Scanning directly launches maps navigation on mobile devices.'}
          </p>
        </div>
      )}

      {/* 11. CALENDAR EVENT */}
      {activeType === 'event' && (
        <div className="space-y-4 animate-fadeIn" id="form-event">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.eventTitle}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="text"
                className={inputBaseStyle}
                placeholder={lang === 'uz' ? "Tadbir yoki uchrashuv nomi" : "Event or meeting title"}
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
                id="input-event-title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.eventStart}
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full bg-white/90 border border-[#132A86]/15 rounded-[14px] px-3 py-2.5 text-xs text-[#0A143A]"
                  value={event.startDate}
                  onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
                />
                <input
                  type="time"
                  className="w-28 bg-white/90 border border-[#132A86]/15 rounded-[14px] px-3 py-2.5 text-xs text-[#0A143A]"
                  value={event.startTime || '09:00'}
                  onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
                {t.builder.fields.eventEnd}
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full bg-white/90 border border-[#132A86]/15 rounded-[14px] px-3 py-2.5 text-xs text-[#0A143A]"
                  value={event.endDate || event.startDate}
                  onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
                />
                <input
                  type="time"
                  className="w-28 bg-white/90 border border-[#132A86]/15 rounded-[14px] px-3 py-2.5 text-xs text-[#0A143A]"
                  value={event.endTime || '10:00'}
                  onChange={(e) => setEvent({ ...event, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.eventLocation}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="text"
                className={inputBaseStyle}
                placeholder={lang === 'uz' ? "Manzil yoki bino nomi" : "Venue or venue address"}
                value={event.location || ''}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
                id="input-event-location"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.eventDesc}
            </label>
            <textarea
              className={`${inputBaseStyle.replace('pl-11', 'pl-4')} min-h-[70px] resize-none`}
              placeholder={lang === 'uz' ? "Tadbir haqida qisqacha ma'lumot..." : "Brief event description..."}
              value={event.description || ''}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              id="input-event-desc"
            />
          </div>
        </div>
      )}

      {/* 12. SMS */}
      {activeType === 'sms' && (
        <div className="space-y-4 animate-fadeIn" id="form-sms">
          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.smsNumber}
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <input
                type="tel"
                className={inputBaseStyle}
                placeholder="+998 90 123 45 67"
                value={sms.phone}
                onChange={(e) => setSms({ ...sms, phone: e.target.value })}
                id="input-sms-number"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-2">
              {t.builder.fields.smsMessage}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-[#132A86]/60" />
              <textarea
                className={`${inputBaseStyle} min-h-[90px] resize-none py-3`}
                placeholder={lang === 'uz' ? "SMS matni..." : "SMS text message..."}
                value={sms.message || ''}
                onChange={(e) => setSms({ ...sms, message: e.target.value })}
                id="input-sms-message"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
