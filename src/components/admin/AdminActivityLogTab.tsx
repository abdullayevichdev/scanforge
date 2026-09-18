import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Smartphone, 
  Download, 
  RefreshCw,
  Layers,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DBSession, formatUzDateTime } from '../../firebase/dbService';

interface AdminActivityLogTabProps {
  sessions: DBSession[];
  lang: 'uz' | 'en';
}

export const AdminActivityLogTab: React.FC<AdminActivityLogTabProps> = ({ sessions, lang }) => {
  const isUz = lang === 'uz';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'force_signed_out'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((s) => {
        // Status filter
        if (statusFilter !== 'all' && s.status !== statusFilter) return false;

        // Search filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim();
          const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
          const phone = (s.phone || '').toLowerCase();
          if (!fullName.includes(term) && !phone.includes(term)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.loginAt || 0).getTime();
        const timeB = new Date(b.loginAt || 0).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [sessions, statusFilter, searchTerm, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Phone', 'Date', 'Year', 'Time', 'Login Time', 'Last Seen', 'Logout Time', 'Status', 'Device'];
    const rows = filteredSessions.map((s) => {
      const loginInfo = formatUzDateTime(s.loginAt, lang);
      const lastSeenInfo = formatUzDateTime(s.lastSeenAt, lang);
      const logoutInfo = formatUzDateTime(s.logoutAt, lang);
      return [
        s.firstName,
        s.lastName,
        s.phone,
        loginInfo.dateStr,
        loginInfo.yearStr,
        loginInfo.timeStr,
        s.loginAt,
        s.lastSeenAt,
        s.logoutAt || '-',
        s.status,
        s.device || 'Browser',
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scanforge_activity_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="p-5 rounded-[28px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={isUz ? "Ism, familiya yoki telefon bo‘yicha qidirish..." : "Search by name, surname, or phone..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#132A86]"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#132A86] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {isUz ? "Barchasi" : "All"} ({sessions.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('online')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'online'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online ({sessions.filter((s) => s.status === 'online').length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('offline')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'offline'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Offline ({sessions.filter((s) => s.status === 'offline').length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('force_signed_out')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'force_signed_out'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            {isUz ? "Chiqarilgan" : "Force Out"} ({sessions.filter((s) => s.status === 'force_signed_out').length})
          </button>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="rounded-[28px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-700/80 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-5">{isUz ? "Foydalanuvchi" : "User"}</th>
                <th className="py-4 px-4">{isUz ? "Telefon" : "Phone"}</th>
                <th className="py-4 px-4">{isUz ? "Sana & Yil" : "Date & Year"}</th>
                <th className="py-4 px-4">{isUz ? "Kirish Vaqti" : "Login Time"}</th>
                <th className="py-4 px-4">{isUz ? "Oxirgi Faollik" : "Last Active"}</th>
                <th className="py-4 px-4">{isUz ? "Chiqish Vaqti" : "Logout Time"}</th>
                <th className="py-4 px-4">{isUz ? "Qurilma" : "Device"}</th>
                <th className="py-4 px-5 text-right">{isUz ? "Joriy Holat" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                    {isUz ? "Hech qanday faollik yozuvi topilmadi" : "No activity records found matching filters"}
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => {
                  const loginInfo = formatUzDateTime(session.loginAt, lang);
                  const lastSeenInfo = formatUzDateTime(session.lastSeenAt, lang);
                  const logoutInfo = formatUzDateTime(session.logoutAt, lang);

                  const isOnline = session.status === 'online';
                  const isForced = session.status === 'force_signed_out';

                  return (
                    <tr 
                      key={session.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {session.firstName} {session.lastName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {session.id.slice(0, 14)}...
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {session.phone}
                      </td>

                      {/* Date & Year */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        <div className="font-bold">{loginInfo.dateStr}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{loginInfo.yearStr} yil</div>
                      </td>

                      {/* Login Time */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {loginInfo.timeStr}
                      </td>

                      {/* Last Seen */}
                      <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {lastSeenInfo.timeStr}
                      </td>

                      {/* Logout Time */}
                      <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                        {session.logoutAt ? logoutInfo.timeStr : (isOnline ? '—' : 'Auto')}
                      </td>

                      {/* Device */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {session.device || 'Browser'}
                      </td>

                      {/* Status badge */}
                      <td className="py-3.5 px-5 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isOnline
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : isForced
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-slate-200/80 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
                        }`}>
                          {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                          {isOnline ? 'Online' : isForced ? (isUz ? 'Chiqarilgan' : 'Force Out') : 'Offline'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
