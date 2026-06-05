import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect} from 'react';
import {QUERY_KEYS} from '../queryKeys';
import {
  getOrCreateSession,
  subscribeToSession,
} from '@services/firestore/attendance.repository';
import {useAuth} from '@hooks/auth/useAuth';
import {toDateString} from '@utils/date.utils';
import {DevoteeCategory} from '@constants/categories';
import {AttendanceSessionDocument} from '@mytypes/attendance.types';

export const useAttendanceSession = (date: Date, category: DevoteeCategory | null) => {
  const {user, organizationId} = useAuth();
  const queryClient = useQueryClient();
  const dateString = toDateString(date);
  const qKey = QUERY_KEYS.attendance.session(organizationId ?? '', dateString, category ?? '');

  useEffect(() => {
    if (!organizationId || !category) return;
    const sessionId = `${organizationId}_${category}_${dateString}`;
    const unsub = subscribeToSession(sessionId, data => {
      if (data) queryClient.setQueryData<AttendanceSessionDocument>(qKey, data);
    });
    return unsub;
  }, [organizationId, category, dateString, queryClient]);

  return useQuery({
    queryKey: qKey,
    queryFn: () =>
      getOrCreateSession(organizationId!, dateString, category!, user?.uid ?? 'system'),
    enabled: !!organizationId && !!category,
    staleTime: Infinity,
  });
};
