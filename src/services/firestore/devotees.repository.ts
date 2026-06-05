import firestore from '@react-native-firebase/firestore';
import {DevoteeDocument, CreateDevoteePayload, UpdateDevoteePayload} from '@mytypes/devotee.types';
import {QueryOptions, PaginatedResult} from '@mytypes/common.types';
import {
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  getPaginatedDocuments,
  subscribeToDocument,
  serverTimestamp,
} from './base.repository';

const COLLECTION = 'devotees';

// ─── Read ─────────────────────────────────────────────────────────────────────

export const getDevoteeById = (id: string): Promise<DevoteeDocument | null> =>
  getDocument<DevoteeDocument>(COLLECTION, id);

export const getDevotees = (
  orgId: string,
  options: Partial<{
    teamId: string;
    status: string;
    category: string;
    cursor: QueryOptions['startAfter'];
    pageSize: number;
  }> = {},
): Promise<PaginatedResult<DevoteeDocument>> => {
  const filters: QueryOptions['where'] = [
    {field: 'organizationId', op: '==', value: orgId},
  ];
  if (options.teamId) filters.push({field: 'teamId', op: '==', value: options.teamId});
  if (options.status) filters.push({field: 'status', op: '==', value: options.status});
  if (options.category)
    filters.push({field: 'categories', op: 'array-contains', value: options.category});

  return getPaginatedDocuments<DevoteeDocument>(COLLECTION, {
    where: filters,
    orderBy: {field: 'fullNameLower', direction: 'asc'},
    limit: options.pageSize ?? 25,
    startAfter: options.cursor ?? null,
  });
};

export const searchDevotees = async (
  orgId: string,
  term: string,
  teamId?: string,
): Promise<DevoteeDocument[]> => {
  const lower = term.toLowerCase().trim();
  if (!lower) return [];

  const isPhone = /^\d{4,}$/.test(lower);

  let query = firestore()
    .collection(COLLECTION)
    .where('organizationId', '==', orgId);

  if (teamId) query = query.where('teamId', '==', teamId);

  if (isPhone) {
    query = query.where('mobileNumberLast4', '==', lower.slice(-4));
  } else {
    // Prefix search on fullNameLower
    query = query
      .where('fullNameLower', '>=', lower)
      .where('fullNameLower', '<=', lower + '');
  }

  const snap = await query.limit(20).get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as DevoteeDocument[];
};

export const checkMobileExists = async (
  orgId: string,
  mobileNumber: string,
  excludeId?: string,
): Promise<boolean> => {
  const snap = await firestore()
    .collection(COLLECTION)
    .where('organizationId', '==', orgId)
    .where('mobileNumber', '==', mobileNumber)
    .limit(2)
    .get();

  if (snap.empty) return false;
  if (excludeId) return snap.docs.some(d => d.id !== excludeId);
  return true;
};

export const subscribeToDevotee = (
  id: string,
  onNext: (d: DevoteeDocument | null) => void,
): (() => void) => subscribeToDocument<DevoteeDocument>(COLLECTION, id, onNext);

// ─── Write ────────────────────────────────────────────────────────────────────

export const createDevotee = async (
  payload: CreateDevoteePayload,
): Promise<string> => {
  const data = {
    ...payload,
    fullNameLower: payload.fullName.toLowerCase(),
    mobileNumberLast4: payload.mobileNumber.slice(-4),
    consecutiveAbsences: 0,
    lastAttendedDate: null,
    attendancePct30d: 0,
    attendancePct90d: 0,
    attendanceStreak: 0,
    longestStreak: 0,
    totalSessionsAttended: 0,
    totalSessionsEligible: 0,
    isNewComer: true,
    status: 'new' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  return addDocument(COLLECTION, data);
};

export const updateDevotee = async (
  id: string,
  updates: UpdateDevoteePayload,
): Promise<void> => {
  const data: Record<string, unknown> = {...updates, updatedAt: serverTimestamp()};
  if (updates.fullName) data.fullNameLower = updates.fullName.toLowerCase();
  if (updates.mobileNumber) data.mobileNumberLast4 = updates.mobileNumber.slice(-4);
  return updateDocument(COLLECTION, id, data);
};

export const deleteDevotee = (id: string): Promise<void> =>
  deleteDocument(COLLECTION, id);
