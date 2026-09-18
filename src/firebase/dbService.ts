import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './config';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  timestamp: string;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    timestamp: new Date().toISOString(),
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

export interface DBUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  isOnline: boolean;
  currentSessionId?: string;
  loginAt: string;
  lastSeenAt: string;
  logoutAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sessionCount: number;
}

export interface DBSession {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  loginAt: string;
  lastSeenAt: string;
  logoutAt?: string | null;
  status: 'online' | 'offline' | 'force_signed_out';
  device: string;
  userAgent: string;
}

export interface DBAdminAction {
  id: string;
  action: string;
  actionType: string;
  targetUserId: string;
  targetUserName?: string;
  details?: string;
  timestamp: string;
  adminRole?: string;
}

export function detectDevice(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return 'iPhone (iOS)';
  if (/iPad/i.test(ua)) return 'iPad (iPadOS)';
  if (/Android/i.test(ua)) return 'Android Device';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac (macOS)';
  if (/Windows/i.test(ua)) return 'Windows PC';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Web Browser';
}

export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    return `+${digits.slice(0, 12)}`;
  }
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  return `+${digits}`;
}

export function formatUzbekPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  let localDigits = digits;
  if (digits.startsWith('998')) {
    localDigits = digits.substring(3);
  }
  localDigits = localDigits.substring(0, 9);

  let formatted = '+998';
  if (localDigits.length > 0) {
    formatted += ' (' + localDigits.substring(0, 2);
  }
  if (localDigits.length >= 2) {
    formatted += ') ';
  }
  if (localDigits.length > 2) {
    formatted += localDigits.substring(2, 5);
  }
  if (localDigits.length >= 5) {
    formatted += '-';
  }
  if (localDigits.length > 5) {
    formatted += localDigits.substring(5, 7);
  }
  if (localDigits.length >= 7) {
    formatted += '-';
  }
  if (localDigits.length > 7) {
    formatted += localDigits.substring(7, 9);
  }
  return formatted;
}

/**
 * Register / Start user session in Firestore
 */
export async function recordUserEntry(data: {
  firstName: string;
  lastName: string;
  phone: string;
}): Promise<{ user: DBUser; session: DBSession }> {
  const trimmedFirst = data.firstName.trim();
  const trimmedLast = data.lastName.trim();
  const normalizedPhone = normalizePhoneNumber(data.phone);
  const cleanId = 'usr_' + normalizedPhone.replace(/\D/g, '');
  const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();

  const userRef = doc(db, 'users', cleanId);
  const sessionRef = doc(db, 'sessions', sessionId);

  let existingUser: DBUser | null = null;
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      existingUser = snap.data() as DBUser;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${cleanId}`);
  }

  const sessionCount = (existingUser?.sessionCount || 0) + 1;
  const createdAt = existingUser?.createdAt || now;

  const userData: DBUser = {
    id: cleanId,
    firstName: trimmedFirst,
    lastName: trimmedLast,
    phone: normalizedPhone,
    isOnline: true,
    currentSessionId: sessionId,
    loginAt: now,
    lastSeenAt: now,
    logoutAt: null,
    createdAt,
    updatedAt: now,
    sessionCount,
  };

  const sessionData: DBSession = {
    id: sessionId,
    userId: cleanId,
    firstName: trimmedFirst,
    lastName: trimmedLast,
    phone: normalizedPhone,
    loginAt: now,
    lastSeenAt: now,
    logoutAt: null,
    status: 'online',
    device: detectDevice(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 250) : 'Unknown',
  };

  try {
    await setDoc(userRef, userData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${cleanId}`);
  }

  try {
    await setDoc(sessionRef, sessionData);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `sessions/${sessionId}`);
  }

  return { user: userData, session: sessionData };
}

/**
 * Send periodic heartbeat to keep presence fresh
 */
export async function sendHeartbeat(userId: string, sessionId: string): Promise<void> {
  if (!userId || !sessionId) return;
  const now = new Date().toISOString();

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      lastSeenAt: now,
      isOnline: true,
      updatedAt: now,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
  }

  try {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      lastSeenAt: now,
      status: 'online',
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `sessions/${sessionId}`);
  }
}

/**
 * Mark user session as logged out
 */
export async function recordUserLogout(userId: string, sessionId: string): Promise<void> {
  if (!userId) return;
  const now = new Date().toISOString();

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isOnline: false,
      logoutAt: now,
      updatedAt: now,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
  }

  if (sessionId) {
    try {
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        status: 'offline',
        logoutAt: now,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `sessions/${sessionId}`);
    }
  }
}

/**
 * Real-time listener for current session (to detect force sign-out)
 */
export function subscribeToCurrentSession(
  sessionId: string, 
  onUpdate: (session: DBSession | null) => void
): Unsubscribe {
  const sessionRef = doc(db, 'sessions', sessionId);
  return onSnapshot(
    sessionRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as DBSession);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `sessions/${sessionId}`);
    }
  );
}

/**
 * Real-time listener for all registered users
 */
export function subscribeToUsers(onUpdate: (users: DBUser[]) => void): Unsubscribe {
  const q = query(collection(db, 'users'), orderBy('updatedAt', 'desc'), limit(100));
  return onSnapshot(
    q,
    (snap) => {
      const list: DBUser[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as DBUser);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    }
  );
}

/**
 * Real-time listener for session records (Activity & Visit Log)
 */
export function subscribeToSessions(onUpdate: (sessions: DBSession[]) => void): Unsubscribe {
  const q = query(collection(db, 'sessions'), orderBy('loginAt', 'desc'), limit(200));
  return onSnapshot(
    q,
    (snap) => {
      const list: DBSession[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as DBSession);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sessions');
    }
  );
}

/**
 * Real-time listener for Admin Actions
 */
export function subscribeToAdminActions(onUpdate: (actions: DBAdminAction[]) => void): Unsubscribe {
  const q = query(collection(db, 'adminActions'), orderBy('timestamp', 'desc'), limit(100));
  return onSnapshot(
    q,
    (snap) => {
      const list: DBAdminAction[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as DBAdminAction);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'adminActions');
    }
  );
}

/**
 * Admin action: Force Sign Out User
 */
export async function adminForceSignOut(
  userId: string,
  sessionId?: string,
  targetUserName?: string
): Promise<boolean> {
  const now = new Date().toISOString();
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isOnline: false,
      logoutAt: now,
      updatedAt: now,
    });

    if (sessionId) {
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        status: 'force_signed_out',
        logoutAt: now,
      });
    }

    // Log admin action
    const actionId = 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const actionRef = doc(db, 'adminActions', actionId);
    await setDoc(actionRef, {
      id: actionId,
      action: `Admin foydalanuvchini saytdan chiqardi: ${targetUserName || userId}`,
      actionType: 'FORCE_SIGN_OUT',
      targetUserId: userId,
      targetUserName: targetUserName || 'User',
      details: `Admin forced sign out at ${now}`,
      timestamp: now,
      adminRole: 'super_admin',
    });

    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    return false;
  }
}

/**
 * Admin action: Delete User Account permanently
 */
export async function adminDeleteUser(
  userId: string,
  targetUserName?: string
): Promise<boolean> {
  const now = new Date().toISOString();
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);

    // Log admin action
    const actionId = 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const actionRef = doc(db, 'adminActions', actionId);
    await setDoc(actionRef, {
      id: actionId,
      action: `Admin foydalanuvchi hisobini o‘chirdi: ${targetUserName || userId}`,
      actionType: 'DELETE_USER',
      targetUserId: userId,
      targetUserName: targetUserName || 'User',
      details: `Admin deleted user profile permanently at ${now}`,
      timestamp: now,
      adminRole: 'super_admin',
    });

    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
    return false;
  }
}

/**
 * Format timestamp into clean localized Uzbekistan time (UTC+5)
 */
export function formatUzDateTime(isoString?: string | null, lang: 'uz' | 'en' = 'uz'): {
  dateStr: string;
  timeStr: string;
  yearStr: string;
  fullFormatted: string;
} {
  if (!isoString) {
    return {
      dateStr: '-',
      timeStr: '-',
      yearStr: '-',
      fullFormatted: '-',
    };
  }

  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return {
      dateStr: '-',
      timeStr: '-',
      yearStr: '-',
      fullFormatted: '-',
    };
  }

  // Use Asia/Tashkent timezone
  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Tashkent',
    day: 'numeric',
    month: 'long',
  };

  const optionsYear: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const locale = lang === 'uz' ? 'uz-UZ' : 'en-US';
  const dateStr = new Intl.DateTimeFormat(locale, optionsDate).format(date);
  const yearStr = new Intl.DateTimeFormat(locale, optionsYear).format(date);
  const timeStr = new Intl.DateTimeFormat(locale, optionsTime).format(date);

  return {
    dateStr,
    timeStr,
    yearStr,
    fullFormatted: `${dateStr} ${yearStr}, ${timeStr}`,
  };
}
