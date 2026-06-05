import {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useAuthStore} from '@store/auth.store';

export const useOnlineStatus = () => {
  const setOffline = useAuthStore(s => s.setOffline);
  const isOffline = useAuthStore(s => s.isOffline);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setOffline(!(state.isConnected && state.isInternetReachable));
    });
    return unsubscribe;
  }, [setOffline]);

  return {isOffline};
};
