import firestore from '@react-native-firebase/firestore';
import {
  AttendanceSessionDocument,
  AttendanceRecordDocument,
  NewComerDocument,
} from '@mytypes/attendance.types';
import {AttendanceStatus} from '@constants/attendance';
import {DevoteeCategory} from '@constants/categories';
import {
  getDocument,
  setDocument,
  updateDocument,
  subscribeToDocument,
  subscribeToQuery,
  serverTimestamp,
} from './base.repository';
import {toTimestamp, toWeekString, nowTimestamp} from '@utils/date.utils';
import {parse, getWeek} from 'date-fns';

const SESSIONS = 'attendanceSessions';
const RECORDS = 'attendanceRecords';
const NEW_COMERS = 'newComers';

// ─── Session ID helpers ───────────────────────────────────────────────────────

export const buildSessionId = (
  orgId: string,
  category: DevoteeCategory,
  dateString: string,
): string => `${orgId}_${category}_${dateString}`;

export const buildRecordId = (sessionId: string, devoteeId: string): string =>
  `${sessionId}_${devoteeId}`;

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const getOrCreateSession = async (
  orgId: string,
  dateString: string,
  category: DevoteeCategory,
  openedBy: string,
): Promise<AttendanceSessionDocument> => {
  const sessionId = buildSessionId(orgId, category, dateString);
  const existing = await getDocument<AttendanceSessionDocument>(SESSIONS, sessionId);
  if (existing) return existing;

  const date = parse(dateString, 'yyyy-MM-dd', new Date());
  const weekNum = getWeek(date, {weekStartsOn: 1});
  const year = date.getFullYear();
  const weekString = toWeekString(date);

  const session: Omit<AttendanceSessionDocument, 'id'> = {
    organizationId: orgId,
    category,
    date: toTimestamp(date),
    dateString,
    weekNumber: weekNum,
    weekString,
    month: date.getMonth() + 1,
    year,
    totalEligible: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendancePct: 0,
    lateArrivalPct: 0,
    isOpen: true,
    isFinalized: false,
    openedBy,
    finalizedBy: null,
    finalizedAt: null,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };

  await setDocument(SESSIONS, sessionId, session);
  return {id: sessionId, ...session};
};

export const subscribeToSession = (
  sessionId: string,
  onNext: (s: AttendanceSessionDocument | null) => void,
): (() => void) =>
  subscribeToDocument<AttendanceSessionDocument>(SESSIONS, sessionId, onNext);

// ─── Records ──────────────────────────────────────────────────────────────────

export const subscribeToSessionRecords = (
  sessionId: string,
  onNext: (records: AttendanceRecordDocument[]) => void,
): (() => void) =>
  subscribeToQuery<AttendanceRecordDocument>(
    RECORDS,
    {where: [{field: 'sessionId', op: '==', value: sessionId}], limit: 500},
    onNext,
  );

export const markSingleAttendance = async (params: {
  sessionId: string;
  devoteeId: string;
  devoteeTeamId: string;
  orgId: string;
  category: DevoteeCategory;
  dateString: string;
  weekString: string;
  month: number;
  year: number;
  status: AttendanceStatus;
  markedBy: string;
  arrivalTime?: Date;
}): Promise<void> => {
  const {sessionId, devoteeId, markedBy, arrivalTime, status, ...rest} = params;
  const recordId = buildRecordId(sessionId, devoteeId);
  const existing = await getDocument<AttendanceRecordDocument>(RECORDS, recordId);

  if (existing) {
    await updateDocument(RECORDS, recordId, {
      status,
      arrivalTime: arrivalTime ? toTimestamp(arrivalTime) : null,
      lastEditedBy: markedBy,
      lastEditedAt: serverTimestamp(),
      editCount: (existing.editCount ?? 0) + 1,
    });
  } else {
    await setDocument(RECORDS, recordId, {
      id: recordId,
      sessionId,
      devoteeId,
      status,
      arrivalTime: arrivalTime ? toTimestamp(arrivalTime) : null,
      minutesLate: null,
      markedBy,
      markedAt: serverTimestamp(),
      lastEditedBy: null,
      lastEditedAt: null,
      editCount: 0,
      callingConfirmation: null,
      notes: null,
      ...rest,
    });
  }
};

export const batchMarkAttendance = async (params: {
  sessionId: string;
  orgId: string;
  category: DevoteeCategory;
  dateString: string;
  weekString: string;
  month: number;
  year: number;
  marks: Array<{devoteeId: string; devoteeTeamId: string; status: AttendanceStatus}>;
  markedBy: string;
}): Promise<void> => {
  const {sessionId, orgId, category, dateString, weekString, month, year, marks, markedBy} = params;
  const CHUNK = 490;

  for (let i = 0; i < marks.length; i += CHUNK) {
    const chunk = marks.slice(i, i + CHUNK);
    const batch = firestore().batch();

    chunk.forEach(({devoteeId, devoteeTeamId, status}) => {
      const recordId = buildRecordId(sessionId, devoteeId);
      batch.set(
        firestore().collection(RECORDS).doc(recordId),
        {
          id: recordId,
          sessionId,
          devoteeId,
          devoteeTeamId,
          organizationId: orgId,
          category,
          dateString,
          weekString,
          month,
          year,
          status,
          arrivalTime: null,
          minutesLate: null,
          markedBy,
          markedAt: firestore.FieldValue.serverTimestamp(),
          lastEditedBy: null,
          lastEditedAt: null,
          editCount: 0,
          callingConfirmation: null,
          notes: null,
        },
        {merge: true},
      );
    });

    await batch.commit();
  }
};

// ─── Sheet query ──────────────────────────────────────────────────────────────

export const getSessionsForWeek = async (
  orgId: string,
  weekString: string,
  category?: DevoteeCategory,
): Promise<AttendanceSessionDocument[]> => {
  let q = firestore()
    .collection(SESSIONS)
    .where('organizationId', '==', orgId)
    .where('weekString', '==', weekString);
  if (category) q = q.where('category', '==', category);
  const snap = await q.get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as AttendanceSessionDocument[];
};

export const getRecordsForWeek = async (
  orgId: string,
  weekString: string,
  teamId?: string,
): Promise<AttendanceRecordDocument[]> => {
  let q = firestore()
    .collection(RECORDS)
    .where('organizationId', '==', orgId)
    .where('weekString', '==', weekString);
  if (teamId) q = q.where('devoteeTeamId', '==', teamId);
  const snap = await q.limit(1000).get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as AttendanceRecordDocument[];
};

// ─── New Comers ───────────────────────────────────────────────────────────────

export const addNewComer = async (
  data: Omit<NewComerDocument, 'id' | 'createdAt'>,
): Promise<string> => {
  const ref = await firestore()
    .collection(NEW_COMERS)
    .add({...data, createdAt: firestore.FieldValue.serverTimestamp()});
  return ref.id;
};

export const getNewComersForWeek = async (
  orgId: string,
  weekString: string,
): Promise<NewComerDocument[]> => {
  // Query by firstVisitDate range matching the week
  const snap = await firestore()
    .collection(NEW_COMERS)
    .where('organizationId', '==', orgId)
    .orderBy('firstVisitDate', 'desc')
    .limit(50)
    .get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as NewComerDocument[];
};
