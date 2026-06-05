import firestore from '@react-native-firebase/firestore';
import {FollowUpDocument, CareCaseDocument, FollowUpNote} from '@mytypes/followUp.types';
import {FOLLOW_UP_STATUS, PRIORITY} from '@constants/callStatus';
import {
  getDocument,
  addDocument,
  updateDocument,
  subscribeToQuery,
  serverTimestamp,
} from './base.repository';
import {AttendanceRecordDocument} from '@mytypes/attendance.types';

const FOLLOW_UPS = 'followUps';
const CARE_CASES = 'careCases';
const RECORDS = 'attendanceRecords';

// ─── Follow-ups ───────────────────────────────────────────────────────────────

export const getFollowUps = async (
  orgId: string,
  teamId?: string,
): Promise<FollowUpDocument[]> => {
  let q = firestore()
    .collection(FOLLOW_UPS)
    .where('organizationId', '==', orgId)
    .where('isActive', '==', true);
  if (teamId) q = q.where('devoteeTeamId', '==', teamId);
  const snap = await q.orderBy('priority', 'asc').limit(100).get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as FollowUpDocument[];
};

export const subscribeToFollowUps = (
  orgId: string,
  teamId: string | undefined,
  onNext: (docs: FollowUpDocument[]) => void,
): (() => void) => {
  const filters: any[] = [
    {field: 'organizationId', op: '==', value: orgId},
    {field: 'isActive', op: '==', value: true},
  ];
  if (teamId) filters.push({field: 'devoteeTeamId', op: '==', value: teamId});

  return subscribeToQuery<FollowUpDocument>(
    FOLLOW_UPS,
    {where: filters, orderBy: {field: 'createdAt', direction: 'desc'}, limit: 100},
    onNext,
  );
};

export const getFollowUpById = (id: string) =>
  getDocument<FollowUpDocument>(FOLLOW_UPS, id);

export const createFollowUp = async (
  data: Omit<FollowUpDocument, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> =>
  addDocument(FOLLOW_UPS, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const updateFollowUpStatus = async (
  id: string,
  status: FollowUpDocument['status'],
  note: FollowUpNote,
): Promise<void> => {
  const doc = await getDocument<FollowUpDocument>(FOLLOW_UPS, id);
  const isResolved = status === FOLLOW_UP_STATUS.RESOLVED;
  await updateDocument(FOLLOW_UPS, id, {
    status,
    notes: [...(doc?.notes ?? []), note],
    contactAttempts: (doc?.contactAttempts ?? 0) + 1,
    lastContactDate: serverTimestamp(),
    isActive: !isResolved,
    resolvedAt: isResolved ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
};

export const addFollowUpNote = async (
  id: string,
  note: FollowUpNote,
): Promise<void> => {
  const doc = await getDocument<FollowUpDocument>(FOLLOW_UPS, id);
  await updateDocument(FOLLOW_UPS, id, {
    notes: [...(doc?.notes ?? []), note],
    lastContactDate: serverTimestamp(),
    contactAttempts: (doc?.contactAttempts ?? 0) + 1,
    updatedAt: serverTimestamp(),
  });
};

// ─── Care cases ───────────────────────────────────────────────────────────────

export const getCareCases = async (
  orgId: string,
  teamId?: string,
): Promise<CareCaseDocument[]> => {
  let q = firestore()
    .collection(CARE_CASES)
    .where('organizationId', '==', orgId)
    .where('status', '!=', 'resolved');
  if (teamId) q = q.where('devoteeTeamId', '==', teamId);
  const snap = await q.limit(100).get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as CareCaseDocument[];
};

// ─── Absence data for care ────────────────────────────────────────────────────

export const getAbsentDevoteesForDate = async (
  orgId: string,
  dateString: string,
  teamId?: string,
): Promise<AttendanceRecordDocument[]> => {
  let q = firestore()
    .collection(RECORDS)
    .where('organizationId', '==', orgId)
    .where('dateString', '==', dateString)
    .where('status', 'in', ['absent', 'excused']);
  if (teamId) q = q.where('devoteeTeamId', '==', teamId);
  const snap = await q.limit(200).get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as AttendanceRecordDocument[];
};

export const getInactiveDevotees = async (
  orgId: string,
  teamId?: string,
  consecutiveAbsences = 3,
): Promise<{devoteeId: string; devoteeName: string; absences: number; lastSeen: string | null}[]> => {
  // Query for devotees with high absence count in recent records
  let q = firestore()
    .collection(RECORDS)
    .where('organizationId', '==', orgId)
    .where('status', '==', 'absent')
    .orderBy('dateString', 'desc')
    .limit(500);
  if (teamId) q = q.where('devoteeTeamId', '==', teamId);
  const snap = await q.get();

  const absenceCount: Record<string, {name: string; count: number; lastAbsent: string}> = {};
  snap.docs.forEach(d => {
    const data = d.data() as AttendanceRecordDocument;
    const key = data.devoteeId;
    if (!absenceCount[key]) {
      absenceCount[key] = {name: '', count: 0, lastAbsent: data.dateString};
    }
    absenceCount[key].count++;
  });

  return Object.entries(absenceCount)
    .filter(([, v]) => v.count >= consecutiveAbsences)
    .map(([devoteeId, v]) => ({
      devoteeId,
      devoteeName: v.name,
      absences: v.count,
      lastSeen: null,
    }))
    .sort((a, b) => b.absences - a.absences);
};
