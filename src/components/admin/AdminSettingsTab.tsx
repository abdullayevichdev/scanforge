import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Shield, 
  Clock, 
  Server, 
  LogOut, 
  Database,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSettingsTabProps {
  onAdminLogout: () => void;
  lang: 'uz' | 'en';
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ onAdminLogout, lang }) => {
  const isUz = lang === 'uz';
  const [serverHealth, setServerHealth] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<string>('');

  const checkHealth = async () => {
    setServerHealth('checking');
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setServerHealth('healthy');
        setLastCheck(new Date().toLocaleTimeString());
      } else {
        setServerHealth('error');
      }
    } catch {
      setServerHealth('error');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="p-6 rounded-[28px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#132A86] text-white flex items-center justify-center shadow-lg shadow-[#132A86]/25">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {isUz ? "Admin Sozlamalari va Tizim Holati" : "Admin Settings & System Health"}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {isUz 
                ? "Server va ma'lumotlar bazasi konfiguratsiyasi" 
                : "Server backend and real-time database runtime status"}
            </p>
          </div>
        </div>
      </div>

      {/* System info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timezone Card */}
        <div className="p-5 rounded-[24px] bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 space-y-3">
          <div className="flex items-center gap-2.5 text-[#132A86] dark:text-[#00D2B4]">
            <Clock className="w-5 h-5" />
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              {isUz ? "Vaqt Mintaqasi (Timezone)" : "Timezone Reference"}
            </h4>
          </div>
          <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <p><strong className="text-slate-900 dark:text-slate-200">Zona:</strong> Asia/Tashkent (UTC+5)</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Mamlakat:</strong> O‘zbekiston</p>
            <p className="text-[11px] text-slate-400 mt-1">Barcha sessiya vaqtlari avtomatik ravishda O‘zbekiston vaqtida formatlanadi.</p>
          </div>
        </div>

        {/* Database Card */}
        <div className="p-5 rounded-[24px] bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 space-y-3">
          <div className="flex items-center gap-2.5 text-[#00D2B4]">
            <Database className="w-5 h-5" />
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              {isUz ? "Firebase Firestore Bazasi" : "Firebase Firestore Sync"}
            </h4>
          </div>
          <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <p><strong className="text-slate-900 dark:text-slate-200">Loyiha ID:</strong> scandesign-aaa700</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Jonli sinxronizatsiya:</strong> Faol (onSnapshot)</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Puls chastotasi:</strong> Har 15 soniyada</p>
          </div>
        </div>

        {/* Server Health Card */}
        <div className="p-5 rounded-[24px] bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#132A86] dark:text-blue-400">
              <Server className="w-5 h-5" />
              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                {isUz ? "Server API Holati" : "Server API Status"}
              </h4>
            </div>
            <button
              type="button"
              onClick={checkHealth}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs flex items-center gap-1 font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isUz ? "Tekshirish" : "Check"}</span>
            </button>
          </div>

          <div className="text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${serverHealth === 'healthy' ? 'bg-emerald-500' : serverHealth === 'checking' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {serverHealth === 'healthy' ? (isUz ? 'Server barqaror ishlamoqda (200 OK)' : 'Server Healthy (200 OK)') : serverHealth === 'checking' ? (isUz ? 'Tekshirilmoqda...' : 'Checking...') : (isUz ? 'Serverda xatolik' : 'Server Error')}
              </span>
            </div>
            {lastCheck && (
              <p className="text-[11px] text-slate-400">Oxirgi tekshiruv: {lastCheck}</p>
            )}
          </div>
        </div>

        {/* Security & Admin Card */}
        <div className="p-5 rounded-[24px] bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-[#132A86] dark:text-teal-400">
              <Shield className="w-5 h-5" />
              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                {isUz ? "Admin Sessiyasini Tugatish" : "Admin Session Control"}
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {isUz 
                ? "Admin panelidan xavfsiz chiqish. Keyingi safar kirish uchun maxfiy kod talab etiladi." 
                : "Sign out of the administrative session securely."}
            </p>
          </div>

          <button
            type="button"
            onClick={onAdminLogout}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isUz ? "Admin Panelidan Chiqish" : "Sign Out of Admin"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
