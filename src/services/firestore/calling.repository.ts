import firestore from '@react-native-firebase/firestore';
import {CallingListDocument, CallRecordDocument} from '@mytypes/calling.types';
import {CallStatus, CALL_STATUS} from '@constants/callStatus';
import {
  getDocument,
  setDocument,
  updateDocument,
  addDocument,
  subscribeToQuery,
  serverTimestamp,
} from './base.repository';
import {toWeekString} from '@utils/date.utils';

const LISTS = 'callingLists';
const RECORDS = 'callRecords';

// ─── List helpers ─────────────────────────────────────────────────────────────

export const getOrCreateCallingList = async (params: {
  orgId: string;
  teamId: string;
  teamName: string;
  weekString: string;
  weekStartDate: Date;
  weekEndDate: Date;
  assignedTo: string;
  assignedToName: string;
  devoteeIds: string[];
}): Promise<CallingListDocument> => {
  const listId = `${params.orgId}_${params.teamId}_${params.weekString}`;
  const existing = await getDocument<CallingListDocument>(LISTS, listId);
  if (existing) return existing;

  const submissionDeadline = new Date(params.weekEndDate);
  submissionDeadline.setHours(21, 0, 0, 0); // 9 PM on week end

  const doc: Omit<CallingListDocument, 'id'> = {
    organizationId: params.orgId,
    teamId: params.teamId,
    teamName: params.teamName,
    weekString: params.weekString,
    weekStartDate: firestore.Timestamp.fromDate(params.weekStartDate) as any,
    weekEndDate: firestore.Timestamp.fromDate(params.weekEndDate) as any,
    assignedTo: params.assignedTo,
    assignedToName: params.assignedToName,
    assignedDevoteeIds: params.devoteeIds,
    totalAssigned: params.devoteeIds.length,
    totalCalled: 0,
    pendingCalls: params.devoteeIds.length,
    confirmedComing: 0,
    notComing: 0,
    maybe: 0,
    noResponse: 0,
    notReachable: 0,
    callBackLater: 0,
    isSubmitted: false,
    submittedAt: null,
    submittedBy: null,
    isLateSubmission: false,
    submissionDeadline: firestore.Timestamp.fromDate(submissionDeadline) as any,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };

  await setDocument(LISTS, listId, doc);
  return {id: listId, ...doc};
};

export const getCallingListsForWeek = async (
  orgId: string,
  weekString: string,
): Promise<CallingListDocument[]> => {
  const snap = await firestore()
    .collection(LISTS)
    .where('organizationId', '==', orgId)
    .where('weekString', '==', weekString)
    .get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as CallingListDocument[];
};

export const getCallingListsForUser = async (
  orgId: string,
  userId: string,
  limit = 12,
): Promise<CallingListDocument[]> => {
  const snap = await firestore()
    .collection(LISTS)
    .where('organizationId', '==', orgId)
    .where('assignedTo', '==', userId)
    .orderBy('weekStartDate', 'desc')
    .limit(limit)
    .get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as CallingListDocument[];
};

export const subscribeToCallingList = (
  listId: string,
  onNext: (list: CallingListDocument | null) => void,
): (() => void) =>
  firestore()
    .collection(LISTS)
    .doc(listId)
    .onSnapshot(snap =>
      onNext(snap.exists ? ({id: snap.id, ...snap.data()} as CallingListDocument) : null),
    );

// ─── Record helpers ────────────────────────────────────────────────────────────

export const getOrCreateCallRecords = async (params: {
  listId: string;
  orgId: string;
  teamId: string;
  weekString: string;
  devotees: Array<{id: string; fullName: string; mobileNumber: string; lastAttendanceStatus: any}>;
}): Promise<CallRecordDocument[]> => {
  const {listId, orgId, teamId, weekString, devotees} = params;

  const snap = await firestore()
    .collection(RECORDS)
    .where('callingListId', '==', listId)
    .get();

  if (!snap.empty) {
    return snap.docs.map(d => ({id: d.id, ...d.data()})) as CallRecordDocument[];
  }

  const batch = firestore().batch();
  const records: CallRecordDocument[] = [];

  devotees.forEach(d => {
    const recordId = `${listId}_${d.id}`;
    const record: Omit<CallRecordDocument, 'id'> = {
      callingListId: listId,
      devoteeId: d.id,
      devoteeTeamId: teamId,
      organizationId: orgId,
      weekString,
      devoteeName: d.fullName,
      devoteeMobile: d.mobileNumber,
      devoteeLastStatus: d.lastAttendanceStatus ?? null,
      calledBy: null,
      calledAt: null,
      callAttempts: 0,
      lastAttemptAt: null,
      status: CALL_STATUS.PENDING,
      notes: null,
      actuallyAttended: null,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };
    batch.set(firestore().collection(RECORDS).doc(recordId), record);
    records.push({id: recordId, ...record});
  });

  await batch.commit();
  return records;
};

export const subscribeToCallRecords = (
  listId: string,
  onNext: (records: CallRecordDocument[]) => void,
): (() => void) =>
  subscribeToQuery<CallRecordDocument>(
    RECORDS,
    {where: [{field: 'callingListId', op: '==', value: listId}], limit: 500},
    onNext,
  );

export const updateCallRecord = async (
  recordId: string,
  calledBy: string,
  status: CallStatus,
  notes: string | null,
): Promise<void> => {
  await updateDocument(RECORDS, recordId, {
    status,
    notes,
    calledBy,
    calledAt: serverTimestamp(),
    lastAttemptAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// ─── Batch update call records ────────────────────────────────────────────────

export const batchUpdateCallRecords = async (
  updates: Array<{id: string; status: CallStatus; notes: string | null; calledBy: string}>,
): Promise<void> => {
  const CHUNK = 490;
  for (let i = 0; i < updates.length; i += CHUNK) {
    const chunk = updates.slice(i, i + CHUNK);
    const batch = firestore().batch();
    chunk.forEach(u => {
      batch.update(firestore().collection(RECORDS).doc(u.id), {
        status: u.status,
        notes: u.notes,
        calledBy: u.calledBy,
        calledAt: firestore.FieldValue.serverTimestamp(),
        lastAttemptAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
  }
};

// ─── Submit calling list ──────────────────────────────────────────────────────

export const submitCallingList = async (
  listId: string,
  submittedBy: string,
  stats: {
    totalCalled: number;
    confirmedComing: number;
    notComing: number;
    maybe: number;
    noResponse: number;
    notReachable: number;
    callBackLater: number;
    pendingCalls: number;
  },
): Promise<void> => {
  const list = await getDocument<CallingListDocument>(LISTS, listId);
  const now = new Date();
  const isLate = list?.submissionDeadline
    ? now > (list.submissionDeadline as any).toDate()
    : false;

  await updateDocument(LISTS, listId, {
    ...stats,
    isSubmitted: true,
    submittedAt: serverTimestamp(),
    submittedBy,
    isLateSubmission: isLate,
    updatedAt: serverTimestamp(),
  });
};
