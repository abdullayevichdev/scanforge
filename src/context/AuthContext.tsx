import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserSettings, SavedQRCodeRecord } from '../types';
import { 
  getDailyUsage, 
  getRemainingCount, 
  DAILY_LIMIT, 
  canCreateQR as checkCanCreate, 
  recordQRCreation as doRecordCreation 
} from '../utils/dailyLimitUtils';

const DEFAULT_SETTINGS: UserSettings = {
  language: 'en',
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
  login: (firstName: string, lastName: string, phone: string, email?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  deleteAccount: () => void;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'scanforge_user_profile_v1';
const SETTINGS_STORAGE_KEY = 'scanforge_user_settings_v1';
const SAVED_QRS_STORAGE_KEY = 'scanforge_saved_qrs_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

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

  const login = (firstName: string, lastName: string, phone: string, email?: string) => {
    const profile: UserProfile = {
      id: 'usr_' + Date.now(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      tier: 'free',
      createdAt: Date.now(),
      settings,
    };
    setUser(profile);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
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

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const deleteAccount = () => {
    setUser(null);
    setSettings(DEFAULT_SETTINGS);
    setSavedQRs([]);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
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
      id: 'qr_' + now + '_' + Math.random().toString(36).substr(2, 5),
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

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
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
