import {
  format,
  getWeek,
  startOfWeek,
  endOfWeek,
  isToday,
  isSameDay,
  addDays,
  subDays,
  startOfDay,
} from 'date-fns';
import firestore from '@react-native-firebase/firestore';
import {Timestamp} from '@mytypes/common.types';

// ─── Conversions ──────────────────────────────────────────────────────────────

export const toDate = (ts: Timestamp): Date =>
  ts instanceof Date ? ts : ts.toDate();

export const toTimestamp = (date: Date): Timestamp =>
  firestore.Timestamp.fromDate(date);

export const nowTimestamp = (): Timestamp =>
  firestore.Timestamp.now();

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatDate = (date: Date): string => format(date, 'd MMM yyyy');

export const formatDateShort = (date: Date): string => format(date, 'd MMM');

export const formatTime = (date: Date): string => format(date, 'h:mm a');

export const formatDateTime = (date: Date): string =>
  format(date, 'd MMM yyyy, h:mm a');

// ─── String keys (for Firestore indexing) ────────────────────────────────────

export const toDateString = (date: Date): string => format(date, 'yyyy-MM-dd');

export const toWeekString = (date: Date): string => {
  const week = getWeek(date, {weekStartsOn: 1});
  const year = format(date, 'yyyy');
  return `${year}-W${String(week).padStart(2, '0')}`;
};

export const toMonthString = (date: Date): string => format(date, 'yyyy-MM');

// ─── Week helpers ─────────────────────────────────────────────────────────────

export const getWeekStart = (date: Date): Date =>
  startOfWeek(date, {weekStartsOn: 1});

export const getWeekEnd = (date: Date): Date =>
  endOfWeek(date, {weekStartsOn: 1});

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const normalizeToMidnight = (date: Date): Date => startOfDay(date);

export {isToday, isSameDay, addDays, subDays};
