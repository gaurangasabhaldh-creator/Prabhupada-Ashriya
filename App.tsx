import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import {ConfirmModal} from './src/components/common/Modal/ConfirmModal';
import {ToastContainer} from './src/components/common/Toast/ToastContainer';
import {ErrorBoundaryFull} from './src/components/common/ErrorBoundary/ErrorBoundary';
import {APP_CONFIG} from './src/config/app.config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.QUERY_STALE_TIME_MS,
      gcTime: APP_CONFIG.QUERY_CACHE_TIME_MS,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundaryFull>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <RootNavigator />
            <ConfirmModal />
            <ToastContainer />
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundaryFull>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});
