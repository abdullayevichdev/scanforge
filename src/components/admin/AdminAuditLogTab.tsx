import React from 'react';
import { ShieldCheck, Clock, User, AlertCircle } from 'lucide-react';
import { DBAdminAction, formatUzDateTime } from '../../firebase/dbService';

interface AdminAuditLogTabProps {
  adminActions: DBAdminAction[];
  lang: 'uz' | 'en';
}

export const AdminAuditLogTab: React.FC<AdminAuditLogTabProps> = ({ adminActions, lang }) => {
  const isUz = lang === 'uz';

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="p-6 rounded-[28px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#132A86] text-white flex items-center justify-center shadow-lg shadow-[#132A86]/25">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {isUz ? "Admin Harakatlari Jurnali (Audit Log)" : "Admin Actions & Audit Log"}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {isUz 
                ? "Administrator tomonidan amalga oshirilgan barcha xavfsizlik va boshqaruv amallari yozuvi" 
                : "Cryptographically verifiable audit log of all administrative actions and security interventions"}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl bg-[#132A86]/10 dark:bg-white/10 text-[#132A86] dark:text-white text-xs font-bold">
          {adminActions.length} {isUz ? "ta amal" : "actions"}
        </span>
      </div>

      {/* Audit List */}
      <div className="rounded-[28px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] overflow-hidden">
        {adminActions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm font-semibold">
            {isUz ? "Hozircha admin harakatlari mavjud emas" : "No administrative actions recorded yet"}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {adminActions.map((item) => {
              const timeInfo = formatUzDateTime(item.timestamp, lang);
              const isDelete = item.actionType === 'DELETE_USER';
              const isForceOut = item.actionType === 'FORCE_SIGN_OUT';

              return (
                <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isDelete 
                        ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                        : isForceOut
                        ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-600 border border-blue-500/30'
                    }`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="font-black text-sm text-slate-900 dark:text-white">
                        {item.action}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {item.targetUserName && (
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                            <User className="w-3.5 h-3.5" />
                            {item.targetUserName}
                          </span>
                        )}
                        <span>•</span>
                        <span>{item.details || item.actionType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {timeInfo.timeStr}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {timeInfo.dateStr}, {timeInfo.yearStr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
