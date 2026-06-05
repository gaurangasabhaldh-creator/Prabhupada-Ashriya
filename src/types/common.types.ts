import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type Timestamp = FirebaseFirestoreTypes.Timestamp;

export interface PaginatedResult<T> {
  data: T[];
  lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null;
  hasMore: boolean;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  code: string;
  message: string;
}

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

export type SortDirection = 'asc' | 'desc';

export interface QueryFilter {
  field: string;
  op: FirebaseFirestoreTypes.WhereFilterOp;
  value: unknown;
}

export interface QueryOptions {
  limit?: number;
  startAfter?: FirebaseFirestoreTypes.DocumentSnapshot | null;
  orderBy?: {field: string; direction?: SortDirection};
  where?: QueryFilter[];
}
