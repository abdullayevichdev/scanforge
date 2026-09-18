import React from 'react';
import { 
  Activity, 
  LogOut, 
  Clock, 
  Smartphone, 
  User, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { DBUser, formatUzDateTime } from '../../firebase/dbService';

interface AdminActiveUsersTabProps {
  activeUsers: DBUser[];
  onForceSignOut: (user: DBUser) => void;
  onSelectUser: (user: DBUser) => void;
  lang: 'uz' | 'en';
}

export const AdminActiveUsersTab: React.FC<AdminActiveUsersTabProps> = ({
  activeUsers,
  onForceSignOut,
  onSelectUser,
  lang,
}) => {
  const isUz = lang === 'uz';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-[28px] bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              {isUz ? "Hozirda Faol Foydalanuvchilar" : "Currently Active Users"}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {isUz 
                ? "Saytda hozir faol bo‘lgan foydalanuvchilarning real-vaqtdagi ro‘yxati" 
                : "Real-time list of visitors currently browsing and using the platform"}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center gap-2">
          <span>{isUz ? "Faol soni:" : "Active count:"}</span>
          <span className="text-base font-black">{activeUsers.length}</span>
        </div>
      </div>

      {/* Users List / Cards */}
      {activeUsers.length === 0 ? (
        <div className="p-16 rounded-[28px] bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <Activity className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            {isUz ? "Hozirda faol foydalanuvchi mavjud emas" : "No active users currently online"}
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
            {isUz 
              ? "Yangi foydalanuvchilar kirishi bilan bu yerda jonli tarzda aks etadi" 
              : "As soon as a visitor opens the application, they will appear here in real time"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeUsers.map((user) => {
            const loginInfo = formatUzDateTime(user.loginAt, lang);
            const lastSeenInfo = formatUzDateTime(user.lastSeenAt, lang);

            return (
              <div
                key={user.id}
                className="p-5 rounded-[24px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-emerald-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div>
                  {/* Top line */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#132A86] to-[#00D2B4] text-white flex items-center justify-center font-black text-sm shadow-md">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => onSelectUser(user)}
                          className="font-black text-base text-slate-900 dark:text-white hover:text-[#132A86] dark:hover:text-[#00D2B4] transition-colors text-left"
                        >
                          {user.firstName} {user.lastName}
                        </button>
                        <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                          {user.phone}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-500/30 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Online
                    </span>
                  </div>

                  {/* Info table */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {isUz ? "Kirish vaqti:" : "Login time:"}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {loginInfo.timeStr} ({loginInfo.dateStr})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        {isUz ? "Oxirgi faollik:" : "Last active:"}
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {lastSeenInfo.timeStr}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {isUz ? "Jami tashriflar:" : "Total sessions:"}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {user.sessionCount || 1} ta
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectUser(user)}
                    className="text-xs font-bold text-[#132A86] dark:text-[#00D2B4] hover:underline"
                  >
                    {isUz ? "Barcha sessiyalari" : "View History"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onForceSignOut(user)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isUz ? "Foydalanuvchini saytdan chiqarish" : "Sign Out User"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
