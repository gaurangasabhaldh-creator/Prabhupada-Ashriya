declare module 'react-native-config' {
  export interface NativeConfig {
    APP_ENV: 'development' | 'production';
    APP_NAME: string;
    FIREBASE_PROJECT_ID: string;
    FEATURE_EXPORT_ENABLED: 'true' | 'false';
    FEATURE_DARK_MODE_ENABLED: 'true' | 'false';
  }

  export const Config: NativeConfig;
  export default Config;
}
