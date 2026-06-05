import firestore from '@react-native-firebase/firestore';
import {UserDocument} from '@mytypes/user.types';
import {getDocument, setDocument, updateDocument, serverTimestamp} from './base.repository';

const COLLECTION = 'users';

export const getUserDocument = async (uid: string): Promise<UserDocument | null> =>
  getDocument<UserDocument>(COLLECTION, uid);

export const createUserDocument = async (
  uid: string,
  data: Omit<UserDocument, 'uid' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>,
): Promise<void> =>
  setDocument(COLLECTION, uid, {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });

export const updateLastLogin = async (uid: string): Promise<void> =>
  updateDocument(COLLECTION, uid, {
    lastLoginAt: serverTimestamp(),
  });

export const updateFcmToken = async (
  uid: string,
  fcmToken: string | null,
): Promise<void> =>
  updateDocument(COLLECTION, uid, {fcmToken, updatedAt: serverTimestamp()});

export const updateUserRole = async (
  uid: string,
  role: UserDocument['role'],
  teamIds: string[],
): Promise<void> =>
  updateDocument(COLLECTION, uid, {role, teamIds, updatedAt: serverTimestamp()});

export const getUsersByOrg = async (
  organizationId: string,
): Promise<UserDocument[]> => {
  const snap = await firestore()
    .collection(COLLECTION)
    .where('organizationId', '==', organizationId)
    .where('isActive', '==', true)
    .get();
  return snap.docs.map(d => ({id: d.id, ...d.data()})) as unknown as UserDocument[];
};
