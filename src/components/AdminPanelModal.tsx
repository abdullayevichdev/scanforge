import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  LayoutDashboard, 
  Activity, 
  ListOrdered, 
  Users, 
  FileText, 
  Settings, 
  X, 
  LogOut,
  Sparkles,
  Wifi
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  DBUser, 
  DBSession, 
  DBAdminAction, 
  subscribeToUsers, 
  subscribeToSessions, 
  subscribeToAdminActions,
  adminForceSignOut,
  adminDeleteUser 
} from '../firebase/dbService';
import { AdminDashboardTab } from './admin/AdminDashboardTab';
import { AdminActiveUsersTab } from './admin/AdminActiveUsersTab';
import { AdminActivityLogTab } from './admin/AdminActivityLogTab';
import { AdminUsersTab } from './admin/AdminUsersTab';
import { AdminAuditLogTab } from './admin/AdminAuditLogTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type AdminTab = 'dashboard' | 'active' | 'activity' | 'users' | 'audit' | 'settings';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const { logoutAdmin } = useAuth();
  const { lang } = useLanguage();
  const isUz = lang === 'uz';

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [users, setUsers] = useState<DBUser[]>([]);
  const [sessions, setSessions] = useState<DBSession[]>([]);
  const [adminActions, setAdminActions] = useState<DBAdminAction[]>([]);
  const [selectedUser, setSelectedUser] = useState<DBUser | null>(null);

  // Subscribe to real-time collections when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const unsubUsers = subscribeToUsers((data) => setUsers(data));
    const unsubSessions = subscribeToSessions((data) => setSessions(data));
    const unsubActions = subscribeToAdminActions((data) => setAdminActions(data));

    return () => {
      unsubUsers();
      unsubSessions();
      unsubActions();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Derive currently active users: isOnline is true and lastSeenAt within 3 minutes
  const activeUsers = users.filter((u) => {
    if (!u.isOnline) return false;
    if (!u.lastSeenAt) return false;
    const timeDiff = Date.now() - new Date(u.lastSeenAt).getTime();
    // Allow up to 3 minutes for presence grace
    return timeDiff < 180000;
  });

  const handleForceSignOut = async (user: DBUser) => {
    const success = await adminForceSignOut(user.id, user.currentSessionId, `${user.firstName} ${user.lastName}`);
    if (success) {
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isOnline: false } : u))
      );
    }
  };

  const handleDeleteUser = async (user: DBUser) => {
    const success = await adminDeleteUser(user.id, `${user.firstName} ${user.lastName}`);
    if (success) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
      }
    }
  };

  const tabs = [
    { id: 'dashboard', labelUz: "Umumiy ko'rinish", labelEn: 'Dashboard', icon: LayoutDashboard, count: null },
    { id: 'active', labelUz: 'Faol foydalanuvchilar', labelEn: 'Active Users', icon: Activity, count: activeUsers.length },
    { id: 'activity', labelUz: 'Faollik & Tashriflar', labelEn: 'Activity Log', icon: ListOrdered, count: sessions.length },
    { id: 'users', labelUz: 'Foydalanuvchilar', labelEn: 'Users', icon: Users, count: users.length },
    { id: 'audit', labelUz: 'Admin harakatlari', labelEn: 'Admin Actions', icon: FileText, count: adminActions.length },
    { id: 'settings', labelUz: 'Sozlamalar', labelEn: 'Settings', icon: Settings, count: null },
  ];

  return (
    <AnimatePresence>
      <div 
        id="admin-panel-overlay"
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#070D22]/75 backdrop-blur-2xl p-2 sm:p-4 lg:p-6 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-7xl h-[94vh] bg-slate-50/95 dark:bg-[#0E1730]/95 backdrop-blur-3xl rounded-[32px] sm:rounded-[36px] shadow-[0_32px_100px_rgba(0,0,0,0.5)] border border-white/80 dark:border-white/10 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
          id="admin-panel-container"
        >
          {/* Top Bar Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4 bg-white/60 dark:bg-[#111A36]/60 backdrop-blur-xl shrink-0">
            {/* Title & Badge */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#132A86] via-[#1E3A8A] to-[#00D2B4] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#132A86] dark:text-white tracking-tight">
                    ScanForge Admin Monitor
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-black border border-emerald-500/30">
                    <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
                    Live Sync
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400">
                  {isUz ? "Foydalanuvchilar va sessiyalarni real-vaqt monitoringi" : "Real-time user & session control"}
                </p>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  logoutAdmin();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isUz ? "Admin panelidan chiqish" : "Sign out from admin"}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isUz ? "Chiqish" : "Logout"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 transition-colors"
                title={isUz ? "Yopish" : "Close"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="px-6 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as AdminTab)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#132A86] text-white shadow-md shadow-[#132A86]/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{isUz ? tab.labelUz : tab.labelEn}</span>
                    {tab.count !== null && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : tab.id === 'active' && tab.count > 0
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <AdminDashboardTab
                users={users}
                activeUsers={activeUsers}
                sessions={sessions}
                adminActions={adminActions}
                onForceSignOut={handleForceSignOut}
                onSelectUser={(u) => {
                  setSelectedUser(u);
                  setActiveTab('users');
                }}
                lang={lang}
              />
            )}

            {activeTab === 'active' && (
              <AdminActiveUsersTab
                activeUsers={activeUsers}
                onForceSignOut={handleForceSignOut}
                onSelectUser={(u) => {
                  setSelectedUser(u);
                  setActiveTab('users');
                }}
                lang={lang}
              />
            )}

            {activeTab === 'activity' && (
              <AdminActivityLogTab
                sessions={sessions}
                lang={lang}
              />
            )}

            {activeTab === 'users' && (
              <AdminUsersTab
                users={users}
                sessions={sessions}
                onForceSignOut={handleForceSignOut}
                onDeleteUser={handleDeleteUser}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
                lang={lang}
              />
            )}

            {activeTab === 'audit' && (
              <AdminAuditLogTab
                adminActions={adminActions}
                lang={lang}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsTab
                onAdminLogout={() => {
                  logoutAdmin();
                  onClose();
                }}
                lang={lang}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
