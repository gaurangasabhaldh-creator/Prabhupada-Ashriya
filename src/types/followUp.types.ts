import {Timestamp} from './common.types';
import {FollowUpStatus, Priority} from '@constants/callStatus';

export type FollowUpReason =
  | 'consecutive_absence'
  | 'confirmed_not_attended'
  | 'inactive'
  | 'manual';

export interface FollowUpNote {
  note: string;
  addedBy: string;
  addedByName: string;
  addedAt: Timestamp;
}

export interface FollowUpDocument {
  id: string;
  organizationId: string;
  devoteeId: string;
  devoteeName: string;
  devoteeTeamId: string;
  devoteeTeamName: string;
  reason: FollowUpReason;
  priority: Priority;
  status: FollowUpStatus;
  consecutiveAbsencesAtCreation: number;
  lastAttendedDateAtCreation: Timestamp | null;
  assignedTo: string;
  assignedToName: string;
  notes: FollowUpNote[];
  lastContactDate: Timestamp | null;
  nextFollowUpDate: Timestamp | null;
  contactAttempts: number;
  resolvedAt: Timestamp | null;
  resolvedBy: string | null;
  resolutionNote: string | null;
  autoCreated: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CareCaseType =
  | 'absence_alert'
  | 'confirmed_no_show'
  | 'inactive_recovery'
  | 'new_devotee_onboarding'
  | 'general';

export type CareCaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface CareCaseDocument {
  id: string;
  organizationId: string;
  devoteeId: string;
  devoteeName: string;
  devoteeTeamId: string;
  type: CareCaseType;
  status: CareCaseStatus;
  priority: Priority;
  followUpIds: string[];
  activeFollowUpId: string | null;
  openedAt: Timestamp;
  openedBy: string;
  lastActivityAt: Timestamp;
  resolvedAt: Timestamp | null;
  resolvedBy: string | null;
  wasReactivated: boolean;
  reactivatedDate: Timestamp | null;
  daysOpen: number;
  totalFollowUps: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
