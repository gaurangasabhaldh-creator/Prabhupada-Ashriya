import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {useAuthStore} from '@store/auth.store';
import {onAuthStateChanged} from '@services/firebase/auth.service';
import {
  getFCMToken,
  onForegroundMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@services/firebase/fcm.service';
import {getUserDocument, createUserDocument, updateLastLogin, updateFcmToken} from '@services/firestore/users.repository';
import {useUIStore} from '@store/ui.store';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import {linkingConfig} from './linking.config';
import {COLORS} from '@constants/colors';
import {RootStackParamList} from '@mytypes/navigation.types';

// Import firebase config to ensure offline persistence is initialized first
import '@config/firebase.config';

export default function RootNavigator() {
  const {isAuthenticated, isLoading, user, setUser, setLoading} = useAuthStore();
  const showToast = useUIStore(s => s.showToast);
  const navRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        try {
          let userDoc = await getUserDocument(firebaseUser.uid);
          if (!userDoc) {
            await createUserDocument(firebaseUser.uid, {
              email: firebaseUser.email ?? '',
              displayName: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
              photoURL: firebaseUser.photoURL ?? null,
              role: 'volunteer',
              organizationId: 'default',
              teamIds: [],
              callingListId: null,
              fcmToken: null,
              isActive: true,
              requiresPasswordChange: false,
            });
            userDoc = await getUserDocument(firebaseUser.uid);
          }
          if (userDoc) {
            updateLastLogin(firebaseUser.uid).catch(() => null);
            getFCMToken().then(token => {
              if (token) updateFcmToken(firebaseUser.uid, token).catch(() => null);
            });
            setUser(userDoc);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('[Auth] Failed to load user profile:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  // Foreground FCM messages — show as toast
  useEffect(() => {
    const unsub = onForegroundMessage(msg => {
      const notification = (msg as any)?.notification;
      if (notification?.title) {
        showToast({
          message: `${notification.title}: ${notification.body ?? ''}`,
          type: 'info',
          duration: 5000,
        });
      }
    });
    return unsub;
  }, [showToast]);

  // Background/quit notification tap — navigate to deep link
  useEffect(() => {
    // App opened from notification while in background
    const unsub = onNotificationOpenedApp(msg => {
      const data = (msg as any)?.data;
      if (data?.screen) handleNotificationNav(data);
    });

    // App opened from quit state
    getInitialNotification().then(msg => {
      if (msg?.data?.screen) handleNotificationNav(msg.data as Record<string, string>);
    });

    return unsub;
  }, []);

  const handleNotificationNav = (data: Record<string, string>) => {
    if (!navRef.current) return;
    const {screen, followUpId, callId, listId, devoteeId} = data;
    try {
      if (screen === 'FollowUpDetail' && followUpId) {
        navRef.current.navigate('App' as any, {screen: 'MainTabs', params: {screen: 'CareTab', params: {screen: 'FollowUpDetail', params: {followUpId}}}});
      } else if (screen === 'CallDetail' && callId && listId) {
        navRef.current.navigate('App' as any, {screen: 'MainTabs', params: {screen: 'CallingTab', params: {screen: 'CallDetail', params: {callId, listId}}}});
      } else if (screen === 'DevoteeDetail' && devoteeId) {
        navRef.current.navigate('App' as any, {screen: 'MainTabs', params: {screen: 'ProfilesTab', params: {screen: 'DevoteeDetail', params: {devoteeId}}}});
      }
    } catch (e) {
      console.warn('[FCM nav]', e);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const shouldForcePasswordChange =
    isAuthenticated && user?.requiresPasswordChange;

  return (
    <NavigationContainer linking={linkingConfig} ref={navRef}>
      {isAuthenticated && !shouldForcePasswordChange ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
