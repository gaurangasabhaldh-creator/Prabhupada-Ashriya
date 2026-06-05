import {Timestamp} from './common.types';
import {CallStatus} from '@constants/callStatus';
import {AttendanceStatus} from '@constants/attendance';

export interface CallingListDocument {
  id: string;
  organizationId: string;
  teamId: string;
  teamName: string;
  weekString: string;
  weekStartDate: Timestamp;
  weekEndDate: Timestamp;
  assignedTo: string;
  assignedToName: string;
  assignedDevoteeIds: string[];
  totalAssigned: number;
  totalCalled: number;
  pendingCalls: number;
  confirmedComing: number;
  notComing: number;
  maybe: number;
  noResponse: number;
  notReachable: number;
  callBackLater: number;
  isSubmitted: boolean;
  submittedAt: Timestamp | null;
  submittedBy: string | null;
  isLateSubmission: boolean;
  submissionDeadline: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CallRecordDocument {
  id: string;
  callingListId: string;
  devoteeId: string;
  devoteeTeamId: string;
  organizationId: string;
  weekString: string;
  devoteeName: string;
  devoteeMobile: string;
  devoteeLastStatus: AttendanceStatus | null;
  calledBy: string | null;
  calledAt: Timestamp | null;
  callAttempts: number;
  lastAttemptAt: Timestamp | null;
  status: CallStatus;
  notes: string | null;
  actuallyAttended: boolean | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
