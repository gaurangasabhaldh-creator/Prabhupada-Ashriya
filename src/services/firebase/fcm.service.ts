import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  // Android 13+ runtime permission handled by the system
  return true;
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return null;
    return await messaging().getToken();
  } catch {
    return null;
  }
};

export const onForegroundMessage = (
  handler: (remoteMessage: Record<string, unknown>) => void,
): (() => void) =>
  messaging().onMessage(async remoteMessage => {
    handler(remoteMessage as Record<string, unknown>);
  });

export const onBackgroundMessage = (
  handler: (remoteMessage: Record<string, unknown>) => Promise<void>,
): void => {
  messaging().setBackgroundMessageHandler(
    handler as Parameters<typeof messaging['setBackgroundMessageHandler']>[0],
  );
};

export const getInitialNotification = async () =>
  messaging().getInitialNotification();

export const onNotificationOpenedApp = (
  handler: (remoteMessage: Record<string, unknown>) => void,
): (() => void) =>
  messaging().onNotificationOpenedApp(
    handler as Parameters<ReturnType<typeof messaging>['onNotificationOpenedApp']>[0],
  );
