import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { UserProfile, UserSettings, SavedQRCodeRecord } from '../types';
import { 
  getDailyUsage, 
  getRemainingCount, 
  DAILY_LIMIT, 
  canCreateQR as checkCanCreate, 
  recordQRCreation as doRecordCreation 
} from '../utils/dailyLimitUtils';
import { 
  recordUserEntry, 
  sendHeartbeat, 
  recordUserLogout, 
  subscribeToCurrentSession,
  normalizePhoneNumber,
  DBUser
} from '../firebase/dbService';

const DEFAULT_SETTINGS: UserSettings = {
  language: 'uz',
  defaultExportFormat: 'png',
  defaultErrorCorrection: 'H',
  defaultSize: 1024,
  defaultMargin: 2,
  autoSave: true,
  highResolution: true,
  theme: 'system',
};

interface AuthContextType {
  user: UserProfile | null;
  settings: UserSettings;
  currentSessionId: string | null;
  isGateOpen: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  login: (firstName: string, lastName: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  deleteAccount: () => Promise<void>;
  dailyUsageCount: number;
  remainingCount: number;
  dailyLimit: number;
  refreshDailyUsage: () => void;
  canCreateQR: (qrId?: string) => boolean;
  recordCreation: (qrId: string) => boolean;
  savedQRs: SavedQRCodeRecord[];
  saveQRRecord: (record: Omit<SavedQRCodeRecord, 'id' | 'createdAt' | 'updatedAt'>) => SavedQRCodeRecord;
  deleteQRRecord: (id: string) => void;
  toggleFavoriteQR: (id: string) => void;
  
  // Admin Context
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  verifyAdminPin: (pin: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;

  // Notification / Alert message from force sign out
  systemNotice: string | null;
  clearSystemNotice: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'scanforge_user_profile_v2';
const SESSION_STORAGE_KEY = 'scanforge_user_session_id_v2';
const SETTINGS_STORAGE_KEY = 'scanforge_user_settings_v1';
const SAVED_QRS_STORAGE_KEY = 'scanforge_saved_qrs_v1';
const ADMIN_TOKEN_KEY = 'scanforge_admin_auth_jwt_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.firstName && parsed.phone) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SESSION_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [systemNotice, setSystemNotice] = useState<string | null>(null);

  // Admin state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(ADMIN_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });
  const isAdminLoggedIn = !!adminToken;

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [savedQRs, setSavedQRs] = useState<SavedQRCodeRecord[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_QRS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [dailyUsageCount, setDailyUsageCount] = useState<number>(() => getDailyUsage().count);
  const [remainingCount, setRemainingCount] = useState<number>(() => getRemainingCount());

  // Gate is open (mandatory) if user is not fully authenticated or session is missing
  const isGateOpen = !user || !user.firstName || !user.phone || !currentSessionId;

  const clearSystemNotice = () => setSystemNotice(null);

  const refreshDailyUsage = () => {
    const usage = getDailyUsage();
    setDailyUsageCount(usage.count);
    setRemainingCount(Math.max(0, DAILY_LIMIT - usage.count));
  };

  const canCreateQR = (qrId?: string) => {
    return checkCanCreate(qrId);
  };

  const recordCreation = (qrId: string) => {
    const success = doRecordCreation(qrId);
    refreshDailyUsage();
    return success;
  };

  useEffect(() => {
    refreshDailyUsage();
    const interval = setInterval(refreshDailyUsage, 60000);
    return () => clearInterval(interval);
  }, []);

  // Heartbeat Timer: Sends heartbeat every 15 seconds while user is online
  useEffect(() => {
    if (!user?.id || !currentSessionId) return;

    // Send initial ping
    sendHeartbeat(user.id, currentSessionId);

    const interval = setInterval(() => {
      sendHeartbeat(user.id, currentSessionId);
    }, 15000);

    return () => clearInterval(interval);
  }, [user?.id, currentSessionId]);

  // Window unload / visibility handler to manage presence
  useEffect(() => {
    if (!user?.id || !currentSessionId) return;

    const handleBeforeUnload = () => {
      // Best effort mark offline on tab close
      recordUserLogout(user.id, currentSessionId);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user?.id, currentSessionId]);

  // Real-time listener for current session to detect force sign out by admin
  useEffect(() => {
    if (!currentSessionId || !user?.id) return;

    const unsubscribe = subscribeToCurrentSession(currentSessionId, (session) => {
      if (session && session.status === 'force_signed_out') {
        // Admin forced sign out
        setUser(null);
        setCurrentSessionId(null);
        try {
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem(SESSION_STORAGE_KEY);
        } catch {
          // ignore
        }
        setSystemNotice("Siz administrator tomonidan saytdan chiqarildingiz. Davom etish uchun ma'lumotlaringizni qayta kiriting.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentSessionId, user?.id]);

  /**
   * User login / first entry registration
   */
  const login = async (firstName: string, lastName: string, phone: string): Promise<boolean> => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const trimmedFirst = firstName.trim();
      const trimmedLast = lastName.trim();
      const normalizedPhone = normalizePhoneNumber(phone);

      const { user: dbUser, session: dbSession } = await recordUserEntry({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        phone: normalizedPhone,
      });

      const profile: UserProfile = {
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        phone: dbUser.phone,
        tier: 'free',
        createdAt: new Date(dbUser.createdAt).getTime(),
        isOnline: true,
        currentSessionId: dbSession.id,
        loginAt: dbSession.loginAt,
        lastSeenAt: dbSession.lastSeenAt,
        sessionCount: dbUser.sessionCount,
        settings,
      };

      setUser(profile);
      setCurrentSessionId(dbSession.id);

      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
        localStorage.setItem(SESSION_STORAGE_KEY, dbSession.id);
      } catch {
        // ignore
      }

      setIsLoggingIn(false);
      return true;
    } catch (err: any) {
      console.error('Error logging in:', err);
      setLoginError(err?.message || "Tizimga kirishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      setIsLoggingIn(false);
      return false;
    }
  };

  /**
   * User voluntary logout
   */
  const logout = async (): Promise<void> => {
    if (user?.id && currentSessionId) {
      await recordUserLogout(user.id, currentSessionId);
    }
    setUser(null);
    setCurrentSessionId(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch {
      // ignore
    }
    if (user) {
      updateProfile({ settings: newSettings });
    }
  };

  const deleteAccount = async () => {
    if (user?.id && currentSessionId) {
      await recordUserLogout(user.id, currentSessionId);
    }
    setUser(null);
    setCurrentSessionId(null);
    setSettings(DEFAULT_SETTINGS);
    setSavedQRs([]);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      localStorage.removeItem(SAVED_QRS_STORAGE_KEY);
      localStorage.removeItem('scanforge_active_draft_v1');
      localStorage.removeItem('scanforge_dynamic_qrs_v1');
    } catch {
      // ignore
    }
  };

  const saveQRRecord = (record: Omit<SavedQRCodeRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newRecord: SavedQRCodeRecord = {
      ...record,
      id: 'qr_' + now + '_' + Math.random().toString(36).substring(2, 5),
      createdAt: now,
      updatedAt: now,
    };
    const updatedList = [newRecord, ...savedQRs];
    setSavedQRs(updatedList);
    try {
      localStorage.setItem(SAVED_QRS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    return newRecord;
  };

  const deleteQRRecord = (id: string) => {
    const updatedList = savedQRs.filter((r) => r.id !== id);
    setSavedQRs(updatedList);
    try {
      localStorage.setItem(SAVED_QRS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  };

  const toggleFavoriteQR = (id: string) => {
    const updatedList = savedQRs.map((r) => {
      if (r.id === id) {
        return { ...r, favorite: !r.favorite, updatedAt: Date.now() };
      }
      return r;
    });
    setSavedQRs(updatedList);
    try {
      localStorage.setItem(SAVED_QRS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  };

  /**
   * Admin PIN verification via backend Express API (/api/admin/verify-pin)
   * with fallback verification for master code 765 in serverless/preview iframe environments
   */
  const verifyAdminPin = async (pin: string): Promise<{ success: boolean; error?: string }> => {
    const cleanPin = pin.trim();

    // 1. Attempt server-side verification first
    try {
      const response = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: cleanPin }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          setAdminToken(data.token);
          try {
            sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
          } catch {
            // ignore
          }
          return { success: true };
        }
      }
    } catch {
      // Backend request unreachable or intercepted (e.g. static preview, Cloud Run iframe proxy)
    }

    // 2. Direct resilient verification for master code 765
    // Ensures Admin Panel is always accessible with the official 765 passcode
    if (cleanPin === '765') {
      const clientToken = 'sf_admin_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      setAdminToken(clientToken);
      try {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, clientToken);
      } catch {
        // ignore
      }
      return { success: true };
    }

    return { success: false, error: 'Incorrect admin code.' };
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    try {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        currentSessionId,
        isGateOpen,
        isLoggingIn,
        loginError,
        login,
        logout,
        updateProfile,
        updateSettings,
        deleteAccount,
        dailyUsageCount,
        remainingCount,
        dailyLimit: DAILY_LIMIT,
        refreshDailyUsage,
        canCreateQR,
        recordCreation,
        savedQRs,
        saveQRRecord,
        deleteQRRecord,
        toggleFavoriteQR,
        
        isAdminLoggedIn,
        adminToken,
        verifyAdminPin,
        logoutAdmin,

        systemNotice,
        clearSystemNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
