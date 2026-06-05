export const APP_CONFIG = {
  // Pagination
  PAGE_SIZE: 25,

  // Session
  ATTENDANCE_LOCK_HOURS: 24,
  ATTENDANCE_EDIT_WINDOW_HOURS: 24,
  ADMIN_EDIT_WINDOW_DAYS: 7,

  // Inactive thresholds
  INACTIVE_THRESHOLD_SESSIONS: 3,
  HIGH_PRIORITY_ABSENT_WEEKS: 6,
  MEDIUM_PRIORITY_ABSENT_WEEKS: 4,
  LOW_PRIORITY_ABSENT_WEEKS: 3,

  // New comer window (weeks from joining date)
  NEW_COMER_WEEKS: 4,

  // Calling
  CALLING_DEADLINE_HOUR: 21, // 9 PM

  // Cache
  QUERY_STALE_TIME_MS: 5 * 60 * 1000,  // 5 min
  QUERY_CACHE_TIME_MS: 10 * 60 * 1000, // 10 min
} as const;
