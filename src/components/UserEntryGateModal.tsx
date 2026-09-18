import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, ArrowRight, Phone, User, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatUzbekPhone } from '../firebase/dbService';

export const UserEntryGateModal: React.FC = () => {
  const { isGateOpen, login, isLoggingIn, loginError, systemNotice, clearSystemNotice } = useAuth();
  const { lang } = useLanguage();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  if (!isGateOpen) return null;

  const isUz = lang === 'uz';

  const cleanDigits = phone.replace(/\D/g, '');
  // Valid Uzbek phone has 12 digits (998 + 9 digits)
  const isPhoneValid = cleanDigits.length === 12 && cleanDigits.startsWith('998');
  const isFirstValid = firstName.trim().length >= 2;
  const isLastValid = lastName.trim().length >= 2;
  const isFormValid = isFirstValid && isLastValid && isPhoneValid;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const formatted = formatUzbekPhone(val);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoggingIn) return;
    await login(firstName, lastName, phone);
  };

  return (
    <AnimatePresence>
      <div 
        id="user-entry-gate-overlay"
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-[#0B1536]/70 backdrop-blur-2xl overflow-y-auto"
      >
        {/* Ambient atmospheric glow behind modal */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#132A86]/30 via-[#00D2B4]/20 to-[#4F46E5]/20 rounded-full blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
        <div className="absolute w-[450px] h-[450px] bg-gradient-to-br from-[#00D2B4]/20 via-[#132A86]/25 to-blue-500/20 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[480px] bg-white/95 dark:bg-[#111A36]/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 shadow-[0_32px_80px_rgba(11,21,54,0.35)] border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 select-none overflow-hidden my-auto"
          id="user-entry-gate-card"
        >
          {/* Top Decorative Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-[#132A86] via-[#1E3A8A] to-[#00D2B4] p-0.5 shadow-xl shadow-[#132A86]/20 flex items-center justify-center mb-4">
              <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-[20px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-[28px] font-black tracking-tight text-[#132A86] dark:text-white">
              {isUz ? "ScanForge-ga Xush Kelibsiz" : "Welcome to ScanForge"}
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 max-w-[340px]">
              {isUz 
                ? "Davom etish uchun ma'lumotlaringizni kiriting." 
                : "Please enter your information to continue."}
            </p>
          </div>

          {/* System Notice Toast (if user was force-logged out) */}
          {systemNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">{systemNotice}</div>
              <button 
                type="button" 
                onClick={clearSystemNotice}
                className="text-amber-600 hover:text-amber-800 text-xs font-bold"
              >
                ✕
              </button>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                {isUz ? "Ism (First Name) *" : "First Name *"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="gate-first-name-input"
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Abdulhay" : "e.g. Abdulhay"}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, firstName: true }))}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#132A86] focus:border-transparent transition-all shadow-inner"
                />
              </div>
              {touched.firstName && !isFirstValid && (
                <p className="text-[11px] font-semibold text-rose-500 mt-1 ml-1">
                  {isUz ? "Iltimos, ismingizni to'liq kiriting (kamida 2 harf)" : "Please enter a valid first name"}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                {isUz ? "Familiya (Last Name) *" : "Last Name *"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="gate-last-name-input"
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Avazxanov" : "e.g. Avazxanov"}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, lastName: true }))}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#132A86] focus:border-transparent transition-all shadow-inner"
                />
              </div>
              {touched.lastName && !isLastValid && (
                <p className="text-[11px] font-semibold text-rose-500 mt-1 ml-1">
                  {isUz ? "Iltimos, familiyangizni kiriting (kamida 2 harf)" : "Please enter a valid last name"}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                {isUz ? "Telefon raqami (Phone Number) *" : "Mobile Phone Number *"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="gate-phone-input"
                  type="tel"
                  required
                  placeholder="+998 (93) 322-35-80"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#132A86] focus:border-transparent transition-all shadow-inner font-mono tracking-wide"
                />
              </div>
              {touched.phone && !isPhoneValid && (
                <p className="text-[11px] font-semibold text-rose-500 mt-1 ml-1">
                  {isUz 
                    ? "O'zbekiston telefon raqamini to'liq kiriting (+998 XX XXX-XX-XX)" 
                    : "Please enter a complete Uzbekistan phone number"}
                </p>
              )}
            </div>

            {/* Login Error Display */}
            {loginError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Privacy Notice */}
            <div className="pt-1 pb-1">
              <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                <ShieldCheck className="w-4 h-4 text-[#00D2B4] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {isUz 
                    ? "Saytdan foydalanish uchun ushbu ma'lumotlar hisob va tashriflarni boshqarish maqsadida saqlanadi." 
                    : "This information is stored to manage accounts and website visits."}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="gate-continue-btn"
              type="submit"
              disabled={!isFormValid || isLoggingIn}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl transition-all ${
                isFormValid && !isLoggingIn
                  ? 'bg-gradient-to-r from-[#132A86] via-[#1E3A8A] to-[#00D2B4] hover:shadow-2xl hover:shadow-[#132A86]/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-75'
              }`}
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isUz ? "Tekshirilmoqda..." : "Connecting..."}</span>
                </>
              ) : (
                <>
                  <span>{isUz ? "Davom etish" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <Lock className="w-3.5 h-3.5 text-[#00D2B4]" />
            <span>ScanForge Cloud Session Guard • 256-bit Encryption</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
