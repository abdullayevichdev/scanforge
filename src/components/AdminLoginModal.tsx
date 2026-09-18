import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, KeyRound, ArrowRight, X, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { verifyAdminPin } = useAuth();
  const { lang } = useLanguage();

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isUz = lang === 'uz';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    const res = await verifyAdminPin(pin.trim());
    setIsLoading(false);

    if (res.success) {
      setPin('');
      onSuccess();
    } else {
      setErrorMessage(isUz ? "Noto‘g‘ri admin kodi." : "Incorrect admin code.");
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="admin-login-overlay"
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-[#0B1536]/60 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[420px] bg-white/95 dark:bg-[#111A36]/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 shadow-[0_32px_80px_rgba(11,21,54,0.35)] border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 select-none overflow-hidden my-auto"
          id="admin-login-card"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#132A86] via-[#1E3A8A] to-[#00D2B4] p-0.5 shadow-lg shadow-[#132A86]/20 flex items-center justify-center mb-3.5">
              <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-[#132A86] dark:text-white">
              {isUz ? "Admin Panel" : "Admin Panel"}
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-[280px]">
              {isUz 
                ? "Boshqaruv tizimiga kirish uchun xavfsizlik kodini kiriting" 
                : "Enter your security code to access monitoring panel"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                {isUz ? "Admin Kodi (Admin Code)" : "Admin Code"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="admin-pin-input"
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-12 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-base font-mono font-bold tracking-widest text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#132A86] focus:border-transparent transition-all shadow-inner text-center"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message (Subtle Liquid Glass error) */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 text-center"
                id="admin-login-error"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              id="admin-enter-btn"
              type="submit"
              disabled={!pin.trim() || isLoading}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl transition-all ${
                pin.trim() && !isLoading
                  ? 'bg-gradient-to-r from-[#132A86] via-[#1E3A8A] to-[#00D2B4] hover:shadow-2xl hover:shadow-[#132A86]/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-75'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isUz ? "Tekshirilmoqda..." : "Verifying..."}</span>
                </>
              ) : (
                <>
                  <span>{isUz ? "Admin panelga kirish" : "Enter Admin Panel"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure note */}
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <Lock className="w-3.5 h-3.5 text-[#00D2B4]" />
            <span>Server-side Authenticated Control</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
