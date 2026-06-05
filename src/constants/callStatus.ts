import {COLORS} from './colors';

export const CALL_STATUS = {
  PENDING: 'pending',
  CONFIRMED_COMING: 'confirmed_coming',
  NOT_COMING: 'not_coming',
  MAYBE: 'maybe',
  NO_RESPONSE: 'no_response',
  NOT_REACHABLE: 'not_reachable',
  CALL_BACK_LATER: 'call_back_later',
} as const;

export type CallStatus = (typeof CALL_STATUS)[keyof typeof CALL_STATUS];

export const CALL_STATUS_LABELS: Record<CallStatus, string> = {
  pending: 'Pending',
  confirmed_coming: 'Confirmed Coming',
  not_coming: 'Not Coming',
  maybe: 'Maybe',
  no_response: 'No Response',
  not_reachable: 'Not Reachable',
  call_back_later: 'Call Back Later',
};

export const CALL_STATUS_COLORS: Record<CallStatus, string> = {
  pending: COLORS.outline,
  confirmed_coming: COLORS.primary,
  not_coming: COLORS.secondary,
  maybe: COLORS.tertiary,
  no_response: COLORS.outlineVariant,
  not_reachable: COLORS.error,
  call_back_later: COLORS.warning,
};

export const CALL_STATUS_ICONS: Record<CallStatus, string> = {
  pending: 'schedule',
  confirmed_coming: 'check_circle',
  not_coming: 'cancel',
  maybe: 'help',
  no_response: 'phone_missed',
  not_reachable: 'phone_disabled',
  call_back_later: 'call_end',
};

export const FOLLOW_UP_STATUS = {
  NOT_CONTACTED: 'not_contacted',
  CONTACTED: 'contacted',
  RESPONDED: 'responded',
  WILL_ATTEND_NEXT: 'will_attend_next',
  REQUIRES_FURTHER_FOLLOWUP: 'requires_further_followup',
  RESOLVED: 'resolved',
} as const;

export type FollowUpStatus =
  (typeof FOLLOW_UP_STATUS)[keyof typeof FOLLOW_UP_STATUS];

export const FOLLOW_UP_STATUS_LABELS: Record<FollowUpStatus, string> = {
  not_contacted: 'Not Contacted',
  contacted: 'Contacted',
  responded: 'Responded',
  will_attend_next: 'Will Attend Next',
  requires_further_followup: 'Needs Further Follow-Up',
  resolved: 'Resolved',
};

export const PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

export const PRIORITY_COLORS: Record<Priority, string> = {
  high: COLORS.secondary,
  medium: COLORS.tertiary,
  low: COLORS.outline,
};
