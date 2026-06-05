import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {PaginatedResult, QueryOptions} from '@mytypes/common.types';

type DocumentData = FirebaseFirestoreTypes.DocumentData;
type QueryRef = FirebaseFirestoreTypes.Query<DocumentData>;

const db = () => firestore();

// ─── Single document ─────────────────────────────────────────────────────────

export async function getDocument<T>(
  collectionPath: string,
  docId: string,
): Promise<T | null> {
  const snap = await db().collection(collectionPath).doc(docId).get();
  if (!snap.exists) return null;
  return {id: snap.id, ...snap.data()} as T;
}

export async function setDocument<T extends DocumentData>(
  collectionPath: string,
  docId: string,
  data: T,
): Promise<void> {
  await db().collection(collectionPath).doc(docId).set(data);
}

export async function addDocument<T extends DocumentData>(
  collectionPath: string,
  data: T,
): Promise<string> {
  const ref = await db().collection(collectionPath).add(data);
  return ref.id;
}

export async function updateDocument<T extends DocumentData>(
  collectionPath: string,
  docId: string,
  data: Partial<T>,
): Promise<void> {
  await db()
    .collection(collectionPath)
    .doc(docId)
    .update(data as DocumentData);
}

export async function deleteDocument(
  collectionPath: string,
  docId: string,
): Promise<void> {
  await db().collection(collectionPath).doc(docId).delete();
}

// ─── Batch writes ─────────────────────────────────────────────────────────────

export async function batchSet<T extends DocumentData>(
  collectionPath: string,
  docs: Array<{id: string; data: T}>,
): Promise<void> {
  const batch = db().batch();
  docs.forEach(({id, data}) => {
    batch.set(db().collection(collectionPath).doc(id), data);
  });
  await batch.commit();
}

export async function batchUpdate<T extends DocumentData>(
  collectionPath: string,
  docs: Array<{id: string; data: Partial<T>}>,
): Promise<void> {
  const batch = db().batch();
  docs.forEach(({id, data}) => {
    batch.update(
      db().collection(collectionPath).doc(id),
      data as DocumentData,
    );
  });
  await batch.commit();
}

// ─── Paginated query ──────────────────────────────────────────────────────────

export async function getPaginatedDocuments<T>(
  collectionPath: string,
  options: QueryOptions = {},
): Promise<PaginatedResult<T>> {
  const {limit = 25, startAfter, orderBy, where: filters} = options;

  let q: QueryRef = db().collection(collectionPath);

  filters?.forEach(({field, op, value}) => {
    q = q.where(field, op, value);
  });

  if (orderBy) {
    q = q.orderBy(orderBy.field, orderBy.direction ?? 'asc');
  }

  if (startAfter) {
    q = q.startAfter(startAfter);
  }

  // Fetch one extra to determine hasMore
  q = q.limit(limit + 1);

  const snap = await q.get();
  const hasMore = snap.docs.length > limit;
  const docs = hasMore ? snap.docs.slice(0, limit) : snap.docs;

  return {
    data: docs.map(d => ({id: d.id, ...d.data()})) as T[],
    lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    hasMore,
  };
}

// ─── Real-time listeners ──────────────────────────────────────────────────────

export function subscribeToDocument<T>(
  collectionPath: string,
  docId: string,
  onNext: (data: T | null) => void,
  onError?: (err: Error) => void,
): () => void {
  return db()
    .collection(collectionPath)
    .doc(docId)
    .onSnapshot(
      snap => onNext(snap.exists ? ({id: snap.id, ...snap.data()} as T) : null),
      onError ?? console.error,
    );
}

export function subscribeToQuery<T>(
  collectionPath: string,
  options: QueryOptions,
  onNext: (data: T[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const {limit = 100, orderBy, where: filters} = options;

  let q: QueryRef = db().collection(collectionPath);

  filters?.forEach(({field, op, value}) => {
    q = q.where(field, op, value);
  });

  if (orderBy) {
    q = q.orderBy(orderBy.field, orderBy.direction ?? 'asc');
  }

  q = q.limit(limit);

  return q.onSnapshot(
    snap =>
      onNext(snap.docs.map(d => ({id: d.id, ...d.data()})) as T[]),
    onError ?? console.error,
  );
}

// ─── Server timestamp helper ──────────────────────────────────────────────────

export const serverTimestamp = () => firestore.FieldValue.serverTimestamp();
