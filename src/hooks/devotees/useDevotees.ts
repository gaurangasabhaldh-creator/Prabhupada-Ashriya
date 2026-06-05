import {useInfiniteQuery} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {getDevotees} from '@services/firestore/devotees.repository';
import {useAuth} from '@hooks/auth/useAuth';
import {APP_CONFIG} from '@config/app.config';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface Filters {
  teamId?: string;
  status?: string;
  category?: string;
}

export const useDevotees = (filters: Filters = {}) => {
  const {organizationId} = useAuth();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.devotees.list(
      organizationId ?? '',
      filters.teamId,
      filters.status,
      filters.category,
    ),
    queryFn: ({pageParam}) =>
      getDevotees(organizationId!, {
        ...filters,
        cursor: pageParam as FirebaseFirestoreTypes.DocumentSnapshot | undefined,
        pageSize: APP_CONFIG.PAGE_SIZE,
      }),
    initialPageParam: null,
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.lastDoc : undefined),
    enabled: !!organizationId,
    staleTime: APP_CONFIG.QUERY_STALE_TIME_MS,
  });
};
