import {COLORS} from './colors';

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
} as const;

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
};

export const ATTENDANCE_STATUS_SHORT: Record<AttendanceStatus, string> = {
  present: 'P',
  absent: 'A',
  late: 'L',
  excused: 'E',
};

export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: COLORS.primary,
  absent: COLORS.secondary,
  late: COLORS.tertiaryContainer,
  excused: COLORS.outline,
};

export const DEVOTEE_STATUS = {
  NEW: 'new',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  REACTIVATED: 'reactivated',
  GRADUATED: 'graduated',
} as const;

export type DevoteeStatus =
  (typeof DEVOTEE_STATUS)[keyof typeof DEVOTEE_STATUS];

export const DEVOTEE_STATUS_LABELS: Record<DevoteeStatus, string> = {
  new: 'New',
  active: 'Active',
  inactive: 'Inactive',
  reactivated: 'Reactivated',
  graduated: 'Graduated',
};

export const DEVOTEE_STATUS_COLORS: Record<DevoteeStatus, string> = {
  new: COLORS.tertiary,
  active: COLORS.primary,
  inactive: COLORS.secondary,
  reactivated: COLORS.success,
  graduated: COLORS.outline,
};
