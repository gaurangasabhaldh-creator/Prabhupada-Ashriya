import {Timestamp} from './common.types';
import {DevoteeCategory} from '@constants/categories';
import {DevoteeStatus, AttendanceStatus} from '@constants/attendance';

export type {DevoteeCategory, DevoteeStatus, AttendanceStatus};

export type Gender = 'male' | 'female' | 'other';
export type MaritalStatus = 'single' | 'married' | 'widowed' | 'divorced';

export interface DevoteeDocument {
  id: string;
  // Basic
  fullName: string;
  mobileNumber: string;
  email: string | null;
  gender: Gender | null;
  dateOfBirth: Timestamp | null;
  photoURL: string | null;
  // Devotional
  categories: DevoteeCategory[];
  primaryCategory: DevoteeCategory;
  teamId: string;
  organizationId: string;
  mentorId: string | null;
  mentorName: string | null;
  joiningDate: Timestamp;
  // Additional
  city: string | null;
  occupation: string | null;
  maritalStatus: MaritalStatus | null;
  // Status
  status: DevoteeStatus;
  isNewComer: boolean;
  consecutiveAbsences: number;
  lastAttendedDate: Timestamp | null;
  attendancePct30d: number;
  attendancePct90d: number;
  attendanceStreak: number;
  longestStreak: number;
  totalSessionsAttended: number;
  totalSessionsEligible: number;
  // Search
  fullNameLower: string;
  mobileNumberLast4: string;
  // Meta
  addedBy: string;
  lastEditedBy: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateDevoteePayload = Omit<
  DevoteeDocument,
  | 'id'
  | 'consecutiveAbsences'
  | 'lastAttendedDate'
  | 'attendancePct30d'
  | 'attendancePct90d'
  | 'attendanceStreak'
  | 'longestStreak'
  | 'totalSessionsAttended'
  | 'totalSessionsEligible'
  | 'fullNameLower'
  | 'mobileNumberLast4'
  | 'createdAt'
  | 'updatedAt'
>;

export type UpdateDevoteePayload = Partial<
  Pick<
    DevoteeDocument,
    | 'fullName'
    | 'mobileNumber'
    | 'email'
    | 'gender'
    | 'dateOfBirth'
    | 'photoURL'
    | 'categories'
    | 'primaryCategory'
    | 'teamId'
    | 'mentorId'
    | 'mentorName'
    | 'city'
    | 'occupation'
    | 'maritalStatus'
    | 'status'
  >
>;
