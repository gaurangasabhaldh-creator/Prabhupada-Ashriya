import {Timestamp} from './common.types';
import {AttendanceStatus} from '@constants/attendance';
import {DevoteeCategory} from '@constants/categories';

export interface AttendanceSessionDocument {
  id: string;
  organizationId: string;
  category: DevoteeCategory;
  date: Timestamp;
  dateString: string;
  weekNumber: number;
  weekString: string;
  month: number;
  year: number;
  totalEligible: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendancePct: number;
  lateArrivalPct: number;
  isOpen: boolean;
  isFinalized: boolean;
  openedBy: string;
  finalizedBy: string | null;
  finalizedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AttendanceRecordDocument {
  id: string;
  sessionId: string;
  devoteeId: string;
  devoteeTeamId: string;
  organizationId: string;
  category: DevoteeCategory;
  dateString: string;
  weekString: string;
  month: number;
  year: number;
  status: AttendanceStatus;
  arrivalTime: Timestamp | null;
  minutesLate: number | null;
  markedBy: string;
  markedAt: Timestamp;
  lastEditedBy: string | null;
  lastEditedAt: Timestamp | null;
  editCount: number;
  callingConfirmation:
    | 'confirmed_coming'
    | 'not_coming'
    | 'maybe'
    | 'no_response'
    | 'not_reachable'
    | null;
  notes: string | null;
}

export interface NewComerDocument {
  id: string;
  organizationId: string;
  teamId: string | null;
  fullName: string;
  mobileNumber: string;
  email: string | null;
  invitedBy: string | null;
  invitedByName: string | null;
  firstVisitDate: Timestamp;
  followUpNotes: string | null;
  isConverted: boolean;
  convertedDevoteeId: string | null;
  addedBy: string;
  createdAt: Timestamp;
}
