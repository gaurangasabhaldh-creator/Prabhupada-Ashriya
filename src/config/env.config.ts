import Config from 'react-native-config';

const toBool = (val: string | undefined): boolean => val === 'true';

export const ENV = {
  isDev: Config.APP_ENV === 'development',
  isProd: Config.APP_ENV === 'production',
  appName: Config.APP_NAME ?? 'Prabhupad Ashraya',
  firebaseProjectId: Config.FIREBASE_PROJECT_ID ?? '',
} as const;

export const FEATURE_FLAGS = {
  exportEnabled: toBool(Config.FEATURE_EXPORT_ENABLED),
  darkModeEnabled: toBool(Config.FEATURE_DARK_MODE_ENABLED),
} as const;
