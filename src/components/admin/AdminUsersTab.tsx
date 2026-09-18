import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  LogOut, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  Phone, 
  Smartphone, 
  AlertTriangle,
  X,
  ShieldAlert
} from 'lucide-react';
import { DBUser, DBSession, formatUzDateTime } from '../../firebase/dbService';

interface AdminUsersTabProps {
  users: DBUser[];
  sessions: DBSession[];
  onForceSignOut: (user: DBUser) => void;
  onDeleteUser: (user: DBUser) => void;
  selectedUser: DBUser | null;
  onSelectUser: (user: DBUser | null) => void;
  lang: 'uz' | 'en';
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  sessions,
  onForceSignOut,
  onDeleteUser,
  selectedUser,
  onSelectUser,
  lang,
}) => {
  const isUz = lang === 'uz';
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<DBUser | null>(null);

  const filteredUsers = users.filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    return fullName.includes(term) || phone.includes(term);
  });

  // Filter sessions for selected user in drawer
  const selectedUserSessions = selectedUser 
    ? sessions.filter((s) => s.userId === selectedUser.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top search & statistics */}
      <div className="p-5 rounded-[28px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={isUz ? "Foydalanuvchini qidirish..." : "Search registered users..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#132A86]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>{isUz ? "Jami ro'yxatdan o'tganlar:" : "Total registered:"}</span>
          <span className="px-2.5 py-1 rounded-xl bg-[#132A86]/10 dark:bg-white/10 text-[#132A86] dark:text-white font-black text-sm">
            {users.length} ta
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[28px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-700/80 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-5">{isUz ? "Ism & Familiya" : "Name & Surname"}</th>
                <th className="py-4 px-4">{isUz ? "Telefon Raqami" : "Phone Number"}</th>
                <th className="py-4 px-4">{isUz ? "Holat" : "Status"}</th>
                <th className="py-4 px-4">{isUz ? "Tashriflar Soni" : "Sessions"}</th>
                <th className="py-4 px-4">{isUz ? "Ro'yxatdan O'tgan" : "Registered"}</th>
                <th className="py-4 px-4">{isUz ? "Oxirgi Faollik" : "Last Active"}</th>
                <th className="py-4 px-5 text-right">{isUz ? "Amallar" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    {isUz ? "Foydalanuvchi topilmadi" : "No users found matching query"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const createdInfo = formatUzDateTime(user.createdAt, lang);
                  const lastSeenInfo = formatUzDateTime(user.lastSeenAt, lang);
                  const isOnline = user.isOnline;

                  return (
                    <tr 
                      key={user.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-5">
                        <button
                          type="button"
                          onClick={() => onSelectUser(user)}
                          className="font-bold text-slate-900 dark:text-white hover:text-[#132A86] dark:hover:text-[#00D2B4] transition-colors text-left flex items-center gap-2.5"
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#132A86] to-[#00D2B4] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <div>{user.firstName} {user.lastName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">UID: {user.id}</div>
                          </div>
                        </button>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {user.phone}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isOnline
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-200/80 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
                        }`}>
                          {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                          {isOnline ? 'Online' : 'Offline'}
                        </span>
                      </td>

                      {/* Session count */}
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {user.sessionCount || 1} marta
                      </td>

                      {/* Created date */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        <div className="font-semibold">{createdInfo.dateStr}</div>
                        <div className="text-[10px] text-slate-400">{createdInfo.timeStr}</div>
                      </td>

                      {/* Last Seen */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                        <div className="font-semibold">{lastSeenInfo.dateStr}</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{lastSeenInfo.timeStr}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => onSelectUser(user)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#132A86]/10 text-slate-600 dark:text-slate-300 hover:text-[#132A86] transition-colors"
                            title={isUz ? "Batafsil ko'rish" : "View details"}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Force Sign out (if online) */}
                          {isOnline && (
                            <button
                              type="button"
                              onClick={() => onForceSignOut(user)}
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 transition-colors"
                              title={isUz ? "Foydalanuvchini saytdan chiqarish" : "Sign out user"}
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete user */}
                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                            title={isUz ? "Foydalanuvchini o‘chirish" : "Delete user profile"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Drawer Modal */}
      {selectedUser && (
        <div 
          className="fixed inset-0 z-[10005] flex items-center justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => onSelectUser(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-full bg-white/95 dark:bg-[#111A36]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl border-l border-white/80 dark:border-white/10 overflow-y-auto flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#132A86] to-[#00D2B4] text-white flex items-center justify-center font-black text-base shadow-md">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                      {selectedUser.phone}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectUser(null)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Details */}
              <div className="mt-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isUz ? "Holati:" : "Status:"}</span>
                    <span className={`font-bold ${selectedUser.isOnline ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {selectedUser.isOnline ? 'Online (Hozir saytda)' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isUz ? "Jami tashriflar:" : "Total sessions:"}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedUser.sessionCount || 1} marta
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isUz ? "Birinchi kirish:" : "Registered at:"}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatUzDateTime(selectedUser.createdAt, lang).fullFormatted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isUz ? "Oxirgi faollik:" : "Last seen:"}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatUzDateTime(selectedUser.lastSeenAt, lang).fullFormatted}
                    </span>
                  </div>
                </div>

                {/* Session History */}
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                    <span>{isUz ? "Tashriflar Tarixi" : "Session History"}</span>
                    <span className="text-xs font-bold text-slate-500">
                      {selectedUserSessions.length} ta yozuv
                    </span>
                  </h4>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {selectedUserSessions.length === 0 ? (
                      <p className="text-slate-400 py-4 text-center">{isUz ? "Sessiyalar tarixi yo'q" : "No sessions found"}</p>
                    ) : (
                      selectedUserSessions.map((s) => {
                        const sLogin = formatUzDateTime(s.loginAt, lang);
                        const sLogout = formatUzDateTime(s.logoutAt, lang);
                        return (
                          <div 
                            key={s.id}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">
                                {sLogin.dateStr}, {sLogin.timeStr}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {s.device || 'Browser'} • {s.status}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                s.status === 'online' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {s.status}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
              {selectedUser.isOnline && (
                <button
                  type="button"
                  onClick={() => {
                    onForceSignOut(selectedUser);
                    onSelectUser(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isUz ? "Foydalanuvchini saytdan chiqarish" : "Sign Out User"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setUserToDelete(selectedUser);
                  onSelectUser(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isUz ? "Foydalanuvchini butunlay o‘chirish" : "Permanently Delete User"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Permanent User Deletion */}
      {userToDelete && (
        <div 
          className="fixed inset-0 z-[10010] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setUserToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] p-6 sm:p-7 shadow-2xl border border-rose-500/30 text-slate-800 dark:text-slate-100"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-center text-slate-900 dark:text-white">
              {isUz ? "Foydalanuvchini o‘chirish" : "Delete User Account"}
            </h3>

            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {isUz 
                ? `Haqiqatan ham "${userToDelete.firstName} ${userToDelete.lastName}" (${userToDelete.phone}) foydalanuvchisini butunlay o‘chirmoqchimisiz? Ushbu amalni ortga qaytarib bo‘lmaydi.`
                : `Are you sure you want to permanently delete "${userToDelete.firstName} ${userToDelete.lastName}" (${userToDelete.phone})? This action cannot be undone.`}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                {isUz ? "Bekor qilish" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteUser(userToDelete);
                  setUserToDelete(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-colors cursor-pointer"
              >
                {isUz ? "Ha, o‘chirilsin" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
