import {Timestamp} from './common.types';
import {UserRole} from '@constants/roles';

export type {UserRole};

export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  organizationId: string;
  teamIds: string[];
  callingListId: string | null;
  fcmToken: string | null;
  isActive: boolean;
  requiresPasswordChange: boolean;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateUserPayload = Omit<
  UserDocument,
  'uid' | 'createdAt' | 'updatedAt' | 'lastLoginAt'
>;
