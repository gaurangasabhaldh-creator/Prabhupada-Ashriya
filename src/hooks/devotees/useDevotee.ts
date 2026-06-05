import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect} from 'react';
import {QUERY_KEYS} from '../queryKeys';
import {getDevoteeById, subscribeToDevotee} from '@services/firestore/devotees.repository';
import {DevoteeDocument} from '@mytypes/devotee.types';
import {APP_CONFIG} from '@config/app.config';

export const useDevotee = (id: string) => {
  const queryClient = useQueryClient();

  // Real-time subscription hydrates the cache
  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToDevotee(id, data => {
      queryClient.setQueryData<DevoteeDocument | null>(
        QUERY_KEYS.devotees.detail(id),
        data,
      );
    });
    return unsub;
  }, [id, queryClient]);

  return useQuery({
    queryKey: QUERY_KEYS.devotees.detail(id),
    queryFn: () => getDevoteeById(id),
    enabled: !!id,
    staleTime: APP_CONFIG.QUERY_STALE_TIME_MS,
  });
};
