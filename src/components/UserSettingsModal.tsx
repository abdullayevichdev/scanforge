import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  X, 
  LogOut, 
  CheckCircle2, 
  Phone, 
  Sparkles, 
  Clock, 
  Settings as SettingsIcon,
  Globe,
  Sliders,
  ShieldAlert,
  Trash2,
  Download,
  FileCheck,
  Check,
  AlertTriangle
} from 'lucide-react';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCount: number;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

type TabType = 'profile' | 'language' | 'preferences' | 'danger';

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  savedCount,
  onShowToast,
}) => {
  const { lang, language, setLanguage, t } = useLanguage();
  const { 
    user, 
    settings, 
    login, 
    logout, 
    updateProfile, 
    updateSettings, 
    deleteAccount, 
    remainingCount, 
    dailyLimit, 
    dailyUsageCount 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Login form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Edit profile state (when logged in)
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Account deletion modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Synchronize edit fields with logged in user
  useEffect(() => {
    if (user) {
      setEditFirstName(user.firstName || '');
      setEditLastName(user.lastName || '');
      setEditPhone(user.phone || '');
      setEditEmail(user.email || '');
    }
  }, [user]);

  if (!isOpen) return null;

  // Uzbekistan phone formatter: "+998 90 123 45 67"
  const handlePhoneChange = (val: string) => {
    let cleaned = val.replace(/\D/g, '');
    if (cleaned.startsWith('998')) {
      cleaned = cleaned.slice(3);
    }
    cleaned = cleaned.slice(0, 9);
    setPhoneRaw(cleaned);
  };

  const formattedPhoneDisplay = (raw: string) => {
    let res = '+998';
    if (raw.length > 0) res += ' ' + raw.slice(0, 2);
    if (raw.length > 2) res += ' ' + raw.slice(2, 5);
    if (raw.length > 5) res += ' ' + raw.slice(5, 7);
    if (raw.length > 7) res += ' ' + raw.slice(7, 9);
    return res;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setLoginError(lang === 'uz' ? 'Iltimos, ismingizni kiriting' : 'Please enter your first name');
      return;
    }
    if (!lastName.trim()) {
      setLoginError(lang === 'uz' ? 'Iltimos, familiyangizni kiriting' : 'Please enter your last name');
      return;
    }
    if (phoneRaw.length < 9) {
      setLoginError(lang === 'uz' ? 'Iltimos, to\'liq telefon raqamingizni kiriting' : 'Please enter a valid phone number');
      return;
    }

    const fullPhone = formattedPhoneDisplay(phoneRaw);
    login(firstName, lastName, fullPhone);
    setLoginError(null);
    onShowToast?.(
      lang === 'uz' ? 'Xush kelibsiz!' : 'Welcome!',
      `${firstName} ${lastName}`,
      'success'
    );
  };

  const handleSaveProfileChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFirstName.trim() || !editLastName.trim()) return;
    updateProfile({
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
    onShowToast?.(
      lang === 'uz' ? 'Profil yangilandi' : 'Profile updated',
      undefined,
      'success'
    );
  };

  const handleLogout = () => {
    logout();
    setFirstName('');
    setLastName('');
    setPhoneRaw('');
    onShowToast?.(
      lang === 'uz' ? 'Profildan chiqildi' : 'Logged out',
      undefined,
      'info'
    );
  };

  const handleConfirmAccountDeletion = () => {
    deleteAccount();
    setShowDeleteConfirm(false);
    onClose();
    onShowToast?.(
      lang === 'uz' ? 'Hisobingiz va barcha ma\'lumotlar butunlay o\'chirildi' : 'Account and all data permanently deleted',
      undefined,
      'warning'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="liquid-glass-elevated bg-white/95 backdrop-blur-2xl rounded-[32px] sm:rounded-[36px] max-w-xl w-full p-5 sm:p-7 border border-white/90 shadow-2xl relative my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#132A86]/10 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[14px] bg-[#132A86]/10 text-[#132A86] flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-[#132A86]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0A143A]">
                {lang === 'uz' ? 'Foydalanuvchi Sozlamalari' : 'User Settings'}
              </h3>
              <p className="text-[11px] text-[#4A577D]">
                {lang === 'uz' ? 'Profil, til, QR parametrlari va hisob boshqaruvi' : 'Profile, language, QR preferences and account'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#4A577D] hover:text-[#0A143A] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-[16px] bg-[#EEF6FF]/70 border border-[#132A86]/10 mb-5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 rounded-[12px] text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 touch-manipulation ${
              activeTab === 'profile'
                ? 'bg-white text-[#132A86] shadow-xs'
                : 'text-[#4A577D] hover:text-[#0A143A]'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'uz' ? 'Profil' : 'Profile'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`py-2 px-1 rounded-[12px] text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 touch-manipulation ${
              activeTab === 'language'
                ? 'bg-white text-[#132A86] shadow-xs'
                : 'text-[#4A577D] hover:text-[#0A143A]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'uz' ? 'Til' : 'Lang'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-1 rounded-[12px] text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 touch-manipulation ${
              activeTab === 'preferences'
                ? 'bg-white text-[#132A86] shadow-xs'
                : 'text-[#4A577D] hover:text-[#0A143A]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'uz' ? 'Parametr' : 'Prefs'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('danger')}
            className={`py-2 px-1 rounded-[12px] text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 touch-manipulation ${
              activeTab === 'danger'
                ? 'bg-red-50 text-red-600 shadow-xs border border-red-200'
                : 'text-red-500 hover:text-red-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'uz' ? 'Hisob' : 'Account'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div>
              {user ? (
                <div className="space-y-4">
                  {/* Avatar card */}
                  <div className="flex items-center gap-4 p-4 rounded-[22px] bg-white border border-[#132A86]/10 shadow-xs">
                    <div className="w-14 h-14 rounded-[20px] bg-gradient-to-tr from-[#132A86] to-[#1FD0C2] text-white flex items-center justify-center text-lg font-black tracking-wider shadow-md shrink-0">
                      {user.firstName[0]?.toUpperCase()}{user.lastName[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-[#0A143A] truncate">
                          {user.firstName} {user.lastName}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          {lang === 'uz' ? 'Faol Hisob' : 'Active Account'}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A577D] font-mono mt-0.5">{user.phone}</p>
                    </div>
                  </div>

                  {/* Daily Limit Tracker */}
                  <div className="bg-[#EEF6FF]/80 rounded-[22px] p-4 border border-[#132A86]/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#132A86] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#1FD0C2]" />
                        {lang === 'uz' ? 'Kunlik QR Limit' : 'Daily QR Limit'}
                      </span>
                      <span className="text-xs font-bold text-[#132A86] bg-white px-2.5 py-0.5 rounded-full border border-[#132A86]/10">
                        {dailyUsageCount} / {dailyLimit}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden mb-2 border border-[#132A86]/10">
                      <div 
                        className="h-full bg-gradient-to-r from-[#132A86] to-[#1FD0C2] rounded-full transition-all duration-300"
                        style={{ width: `${(dailyUsageCount / dailyLimit) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#4A577D] flex items-center justify-between font-medium">
                      <span>{lang === 'uz' ? `Bugun ${remainingCount} ta QR kod qoldi` : `${remainingCount} of ${dailyLimit} QR codes remaining today`}</span>
                      <span className="flex items-center gap-1 text-[10px]"><Clock className="w-3 h-3" /> 00:00 UTC+5</span>
                    </p>
                  </div>

                  {/* Profile Edit Form */}
                  <form onSubmit={handleSaveProfileChanges} className="space-y-3 bg-white p-4.5 rounded-[22px] border border-[#132A86]/10">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#132A86] mb-1">
                      {lang === 'uz' ? 'Ma\'lumotlarni Tahrirlash' : 'Edit Profile Credentials'}
                    </h5>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                          {lang === 'uz' ? 'Ism' : 'First Name'}
                        </label>
                        <input
                          type="text"
                          value={editFirstName}
                          onChange={(e) => setEditFirstName(e.target.value)}
                          className="w-full bg-slate-50 border border-[#132A86]/15 rounded-[14px] px-3 py-2 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                          {lang === 'uz' ? 'Familiya' : 'Last Name'}
                        </label>
                        <input
                          type="text"
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                          className="w-full bg-slate-50 border border-[#132A86]/15 rounded-[14px] px-3 py-2 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                        {lang === 'uz' ? 'Telefon raqami' : 'Phone Number'}
                      </label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-[#132A86]/15 rounded-[14px] px-3 py-2 text-xs font-mono font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#4A577D] block mb-1">
                        {lang === 'uz' ? 'Email (ixtiyoriy)' : 'Email (optional)'}
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="user@scanforge.uz"
                        className="w-full bg-slate-50 border border-[#132A86]/15 rounded-[14px] px-3 py-2 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="py-2 px-3 rounded-[12px] text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{lang === 'uz' ? 'Chiqish' : 'Log Out'}</span>
                      </button>

                      <button
                        type="submit"
                        className="apple-glass-cta py-2 px-4 rounded-[14px] text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        {profileSaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <FileCheck className="w-3.5 h-3.5" />}
                        <span>{profileSaved ? (lang === 'uz' ? 'Saqlandi!' : 'Saved!') : (lang === 'uz' ? 'O\'zgarishlarni Saqlash' : 'Save Changes')}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Registration / Sign in */
                <div>
                  <div className="text-center mb-5">
                    <div className="w-12 h-12 rounded-[18px] bg-[#132A86]/10 text-[#132A86] flex items-center justify-center mx-auto mb-2.5">
                      <User className="w-6 h-6 text-[#132A86]" />
                    </div>
                    <h4 className="text-lg font-extrabold text-[#0A143A]">
                      {lang === 'uz' ? 'ScanForge Profiliga Kirish' : 'Sign In to ScanForge'}
                    </h4>
                    <p className="text-xs text-[#4A577D] mt-1">
                      {lang === 'uz' ? 'Ism, familiya va telefoningiz orqali parolsiz kiring.' : 'Sign in easily with your name and phone number.'}
                    </p>
                  </div>

                  {loginError && (
                    <div className="mb-4 p-3 rounded-[14px] bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-1">
                          {lang === 'uz' ? 'Ism' : 'First Name'}
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Abdulhay"
                          className="w-full bg-white border border-[#132A86]/15 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-1">
                          {lang === 'uz' ? 'Familiya' : 'Last Name'}
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Karimov"
                          className="w-full bg-white border border-[#132A86]/15 rounded-[14px] px-3.5 py-2.5 text-xs font-bold text-[#0A143A] focus:outline-hidden focus:border-[#132A86]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#132A86] uppercase tracking-wider mb-1">
                        {lang === 'uz' ? 'Telefon Raqami' : 'Phone Number'}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-3 flex items-center gap-1 pointer-events-none">
                          <span className="text-sm">🇺🇿</span>
                          <span className="text-xs font-bold font-mono text-[#0A143A]">+998</span>
                        </div>
                        <input
                          type="tel"
                          value={phoneRaw}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="90 123 45 67"
                          maxLength={9}
                          className="w-full bg-white border border-[#132A86]/15 rounded-[14px] py-2.5 pr-4 pl-22 text-xs font-mono font-bold text-[#0A143A] tracking-wider focus:outline-hidden focus:border-[#132A86]"
                        />
                      </div>
                      <p className="text-[10px] text-[#4A577D] mt-1 pl-1">
                        {formattedPhoneDisplay(phoneRaw)}
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="apple-glass-cta w-full py-3.5 rounded-[16px] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md mt-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1FD0C2]" />
                      <span>{lang === 'uz' ? 'Kirish / Boshlash' : 'Sign In / Start'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LANGUAGE */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div className="p-4 rounded-[22px] bg-white border border-[#132A86]/10">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#132A86] mb-3">
                  {lang === 'uz' ? 'Interfeys Tilini Tanlang' : 'Choose Interface Language'}
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      updateSettings({ language: 'en' });
                    }}
                    className={`p-4 rounded-[18px] border text-left transition-all cursor-pointer flex items-start justify-between ${
                      language === 'en'
                        ? 'bg-[#132A86] text-white border-[#132A86] shadow-md'
                        : 'bg-slate-50 text-[#0A143A] border-[#132A86]/10 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">🇺🇸</span>
                        <p className="text-sm font-extrabold">English</p>
                      </div>
                      <p className={`text-xs ${language === 'en' ? 'text-white/80' : 'text-[#4A577D]'}`}>
                        Default global English UI with complete localization.
                      </p>
                    </div>
                    {language === 'en' && <CheckCircle2 className="w-5 h-5 text-[#1FD0C2] shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('uz');
                      updateSettings({ language: 'uz' });
                    }}
                    className={`p-4 rounded-[18px] border text-left transition-all cursor-pointer flex items-start justify-between ${
                      language === 'uz'
                        ? 'bg-[#132A86] text-white border-[#132A86] shadow-md'
                        : 'bg-slate-50 text-[#0A143A] border-[#132A86]/10 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">🇺🇿</span>
                        <p className="text-sm font-extrabold">O'zbekcha</p>
                      </div>
                      <p className={`text-xs ${language === 'uz' ? 'text-white/80' : 'text-[#4A577D]'}`}>
                        To'liq o'zbek tilidagi qulay va milliy interfeys.
                      </p>
                    </div>
                    {language === 'uz' && <CheckCircle2 className="w-5 h-5 text-[#1FD0C2] shrink-0" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QR PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="p-4 rounded-[22px] bg-white border border-[#132A86]/10 space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#132A86]">
                  {lang === 'uz' ? 'Standart Eksport Parametrlari' : 'Default Export Preferences'}
                </h5>

                {/* Default format */}
                <div>
                  <label className="text-xs font-semibold text-[#0A143A] block mb-2">
                    {lang === 'uz' ? 'Birlamchi Yuklab Olish Formati' : 'Default Download Format'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['png', 'svg', 'pdf', 'jpg'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => updateSettings({ defaultExportFormat: fmt })}
                        className={`py-2 px-2.5 rounded-[14px] text-xs font-bold uppercase transition-all cursor-pointer border ${
                          settings.defaultExportFormat === fmt
                            ? 'bg-[#132A86] text-white border-[#132A86] shadow-xs'
                            : 'bg-slate-50 text-[#4A577D] border-[#132A86]/10 hover:bg-white'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Error Correction */}
                <div>
                  <label className="text-xs font-semibold text-[#0A143A] block mb-2">
                    {lang === 'uz' ? 'Xatolikni Tiklash Darajasi (Error Correction)' : 'Default Error Correction Level'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'L', label: 'L (7%)' },
                      { id: 'M', label: 'M (15%)' },
                      { id: 'Q', label: 'Q (25%)' },
                      { id: 'H', label: 'H (30%)' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => updateSettings({ defaultErrorCorrection: lvl.id as any })}
                        className={`py-2 px-2 rounded-[14px] text-xs font-bold transition-all cursor-pointer border ${
                          settings.defaultErrorCorrection === lvl.id
                            ? 'bg-[#132A86] text-white border-[#132A86] shadow-xs'
                            : 'bg-slate-50 text-[#4A577D] border-[#132A86]/10 hover:bg-white'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Resolution */}
                <div>
                  <label className="text-xs font-semibold text-[#0A143A] block mb-2">
                    {lang === 'uz' ? 'Eksport Ruxsati (Resolution)' : 'Default Export Resolution'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 512, label: '512px (Web)' },
                      { val: 1024, label: '1024px (HD)' },
                      { val: 2048, label: '2048px (4K Print)' },
                    ].map((res) => (
                      <button
                        key={res.val}
                        type="button"
                        onClick={() => updateSettings({ defaultSize: res.val })}
                        className={`py-2 px-2.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer border ${
                          settings.defaultSize === res.val
                            ? 'bg-[#132A86] text-white border-[#132A86] shadow-xs'
                            : 'bg-slate-50 text-[#4A577D] border-[#132A86]/10 hover:bg-white'
                        }`}
                      >
                        {res.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-save toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-[#132A86]/8">
                  <div>
                    <span className="text-xs font-bold text-[#0A143A] block">
                      {lang === 'uz' ? 'Avtomatik Saqlash (Auto-save)' : 'Automatic Draft Auto-Save'}
                    </span>
                    <span className="text-[11px] text-[#4A577D]">
                      {lang === 'uz' ? 'QR o\'zgarishlarini mahalliy xotiraga avtomatik yozish' : 'Automatically save design adjustments locally'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                    className="w-4 h-4 rounded text-[#132A86] focus:ring-[#132A86] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT DELETION (DANGER ZONE) */}
          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="p-4.5 rounded-[22px] bg-red-50/70 border border-red-200 space-y-4">
                <div className="flex items-center gap-2.5 text-red-600">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h5 className="text-sm font-extrabold">
                    {lang === 'uz' ? 'Xavfli Hudud: Hisobni O\'chirish' : 'Danger Zone: Delete Account'}
                  </h5>
                </div>

                <p className="text-xs text-red-700 leading-relaxed">
                  {lang === 'uz'
                    ? 'Hisobingizni o\'chirish barcha profil ma\'lumotlaringiz, saqlangan QR qoralamalaringiz va maxsus sozlamalaringizni butunlay o\'chirib yuboradi. Ushbu amalni ortga qaytarib bo\'lmaydi.'
                    : 'Deleting your account will permanently erase your profile credentials, saved QR designs, preferences, and dynamic codes from this device. This action cannot be undone.'}
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-3 px-4 rounded-[16px] bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{lang === 'uz' ? 'Hisobni Butunlay O\'chirish' : 'Permanently Delete Account'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Confirmation Modal for Destructive Action */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
            <div className="liquid-glass-elevated bg-white rounded-[28px] p-6 max-w-sm w-full border border-red-200 shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-[18px] bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-[#0A143A]">
                {lang === 'uz' ? 'Haqiqatan ham o\'chirmoqchimisiz?' : 'Confirm Account Deletion'}
              </h4>
              <p className="text-xs text-[#4A577D]">
                {lang === 'uz'
                  ? 'Barcha ma\'lumotlaringiz doimiy ravishda o\'chiriladi va tiklab bo\'lmaydi.'
                  : 'All your saved designs and credentials will be permanently erased.'}
              </p>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 px-3 rounded-[14px] bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0A143A] cursor-pointer"
                >
                  {lang === 'uz' ? 'Bekor qilish' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAccountDeletion}
                  className="flex-1 py-2.5 px-3 rounded-[14px] bg-red-600 hover:bg-red-700 text-xs font-bold text-white cursor-pointer shadow-sm"
                >
                  {lang === 'uz' ? 'Ha, O\'chirilsin' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
