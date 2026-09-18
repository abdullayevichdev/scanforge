import React from 'react';
import { 
  Users, 
  Activity, 
  Clock, 
  Layers, 
  LogOut, 
  Smartphone, 
  ShieldAlert, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { DBUser, DBSession, DBAdminAction, formatUzDateTime } from '../../firebase/dbService';

interface AdminDashboardTabProps {
  users: DBUser[];
  activeUsers: DBUser[];
  sessions: DBSession[];
  adminActions: DBAdminAction[];
  onForceSignOut: (user: DBUser) => void;
  onSelectUser: (user: DBUser) => void;
  lang: 'uz' | 'en';
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  users,
  activeUsers,
  sessions,
  adminActions,
  onForceSignOut,
  onSelectUser,
  lang,
}) => {
  const isUz = lang === 'uz';

  // Calculate today's sessions
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter((s) => s.loginAt && s.loginAt.startsWith(todayStr));

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-[24px] bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-[#132A86]/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isUz ? "Jami foydalanuvchilar" : "Total Users"}
              </p>
              <h3 className="text-3xl font-black text-[#132A86] dark:text-white mt-1">
                {users.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-[#132A86] dark:text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isUz ? "Barcha ro'yxatdan o'tganlar" : "All registered profiles"}</span>
          </div>
        </div>

        {/* Online Now */}
        <div className="p-5 rounded-[24px] bg-gradient-to-br from-emerald-500/10 via-white/70 to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-800/70 dark:to-teal-950/40 backdrop-blur-xl border border-emerald-500/30 dark:border-emerald-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {isUz ? "Hozir onlayn" : "Online Now"}
              </p>
              <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
                {activeUsers.length}
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {isUz ? "Jonli real-vaqt monitoringi" : "Live real-time presence"}
          </div>
        </div>

        {/* Today's Visits */}
        <div className="p-5 rounded-[24px] bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-[#00D2B4]/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isUz ? "Bugungi tashriflar" : "Today's Visits"}
              </p>
              <h3 className="text-3xl font-black text-[#132A86] dark:text-white mt-1">
                {todaySessions.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isUz ? "Bugun ochilgan sessiyalar" : "Sessions started today"}
          </div>
        </div>

        {/* Total Sessions */}
        <div className="p-5 rounded-[24px] bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isUz ? "Jami sessiyalar" : "Total Sessions"}
              </p>
              <h3 className="text-3xl font-black text-[#132A86] dark:text-white mt-1">
                {sessions.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isUz ? "Tarixiy faolliklar" : "All historical records"}
          </div>
        </div>
      </div>

      {/* Active Users Section */}
      <div className="p-6 rounded-[28px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h4 className="text-lg font-black text-[#132A86] dark:text-white">
              {isUz ? "Hozir faol foydalanuvchilar" : "Currently Active Users"}
            </h4>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              {activeUsers.length}
            </span>
          </div>
        </div>

        {activeUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm font-medium">
            {isUz ? "Hozirda faol onlayn foydalanuvchilar yo'q" : "No active users online right now"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeUsers.map((u) => {
              const timeInfo = formatUzDateTime(u.loginAt, lang);
              return (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <button
                          type="button"
                          onClick={() => onSelectUser(u)}
                          className="text-left font-black text-slate-900 dark:text-white hover:text-[#132A86] dark:hover:text-[#00D2B4] transition-colors"
                        >
                          {u.firstName} {u.lastName}
                        </button>
                        <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                          {u.phone}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {isUz ? "Kirish vaqti:" : "Login time:"}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{timeInfo.timeStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectUser(u)}
                      className="text-xs font-bold text-[#132A86] dark:text-[#00D2B4] hover:underline"
                    >
                      {isUz ? "Batafsil" : "Details"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onForceSignOut(u)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isUz ? "Chiqarish" : "Sign Out"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity Log Stream */}
      <div className="p-6 rounded-[28px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
        <h4 className="text-lg font-black text-[#132A86] dark:text-white mb-4">
          {isUz ? "Oxirgi faolliklar (Oxirgi 10 ta)" : "Recent Activity Stream"}
        </h4>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sessions.slice(0, 10).map((s) => {
            const timeInfo = formatUzDateTime(s.loginAt, lang);
            const isOnline = s.status === 'online';
            const isForced = s.status === 'force_signed_out';
            return (
              <div key={s.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isOnline 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : isForced
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                  }`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {s.phone} • {s.device || 'Browser'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isOnline 
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : isForced
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {isOnline ? 'Online' : isForced ? (isUz ? 'Chiqarilgan' : 'Force Out') : 'Offline'}
                  </span>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    {timeInfo.timeStr} • {timeInfo.dateStr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
