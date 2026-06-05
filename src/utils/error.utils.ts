export interface AppError {
  code: string;
  message: string;
  userMessage: string;
}

const FIREBASE_AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled. Contact your coordinator.',
  'auth/network-request-failed': 'No internet connection. Please check your network.',
  'auth/requires-recent-login': 'Please log in again to complete this action.',
};

const FIRESTORE_ERRORS: Record<string, string> = {
  'firestore/permission-denied': 'You do not have permission to perform this action.',
  'firestore/not-found': 'The requested data was not found.',
  'firestore/unavailable': 'Service temporarily unavailable. Your changes will sync when you reconnect.',
  'firestore/deadline-exceeded': 'Request timed out. Please try again.',
};

export const parseError = (error: unknown): AppError => {
  if (error instanceof Error) {
    const code = (error as {code?: string}).code ?? 'unknown';
    const userMessage =
      FIREBASE_AUTH_ERRORS[code] ??
      FIRESTORE_ERRORS[code] ??
      'Something went wrong. Please try again.';

    return {code, message: error.message, userMessage};
  }

  return {
    code: 'unknown',
    message: String(error),
    userMessage: 'An unexpected error occurred.',
  };
};

export const isOfflineError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const code = (error as {code?: string}).code ?? '';
    return (
      code === 'firestore/unavailable' ||
      code === 'auth/network-request-failed' ||
      error.message.includes('network')
    );
  }
  return false;
};
