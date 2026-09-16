import { DailyUsage } from '../types';

export const DAILY_LIMIT = 15;
const STORAGE_KEY = 'scanforge_daily_limit_v1';

/**
 * Returns current date in Uzbekistan local time (UTC+5 / Asia/Tashkent) as YYYY-MM-DD
 */
export function getTashkentDateString(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date()); // Outputs YYYY-MM-DD
  } catch (e) {
    // Fallback manual offset for UTC+5
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const tashkentTime = new Date(utc + (3600000 * 5));
    const y = tashkentTime.getFullYear();
    const m = String(tashkentTime.getMonth() + 1).padStart(2, '0');
    const d = String(tashkentTime.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

/**
 * Retrieve current daily usage for today. Automatically resets at midnight UTC+5.
 */
export function getDailyUsage(): DailyUsage {
  const today = getTashkentDateString();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: DailyUsage = JSON.parse(stored);
      if (parsed.date === today) {
        return parsed;
      }
    }
  } catch {
    // Ignore JSON errors
  }

  // New day or uninitialized: Reset for today
  const fresh: DailyUsage = {
    date: today,
    count: 0,
    createdQrIds: [],
  };
  saveDailyUsage(fresh);
  return fresh;
}

export function saveDailyUsage(usage: DailyUsage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // Ignore storage quota
  }
}

/**
 * Check if the user can create another QR code today
 */
export function canCreateQR(qrId?: string): boolean {
  const usage = getDailyUsage();
  // If editing an existing created QR, it does not consume count
  if (qrId && usage.createdQrIds.includes(qrId)) {
    return true;
  }
  return usage.count < DAILY_LIMIT;
}

/**
 * Record a new QR code creation.
 * If qrId is provided and already recorded, does NOT consume count.
 * Returns true if allowed and recorded, false if daily limit reached.
 */
export function recordQRCreation(qrId: string): boolean {
  const usage = getDailyUsage();

  // If already registered today, no new count consumed
  if (usage.createdQrIds.includes(qrId)) {
    return true;
  }

  // Check limit
  if (usage.count >= DAILY_LIMIT) {
    return false;
  }

  usage.count += 1;
  usage.createdQrIds.push(qrId);
  saveDailyUsage(usage);
  return true;
}

/**
 * Get how many QR codes remain for today
 */
export function getRemainingCount(): number {
  const usage = getDailyUsage();
  return Math.max(0, DAILY_LIMIT - usage.count);
}
