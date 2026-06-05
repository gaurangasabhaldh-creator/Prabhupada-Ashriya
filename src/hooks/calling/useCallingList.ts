import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect} from 'react';
import {QUERY_KEYS} from '../queryKeys';
import {
  getCallingListsForWeek,
  getOrCreateCallingList,
  subscribeToCallingList,
} from '@services/firestore/calling.repository';
import {useAuth} from '@hooks/auth/useAuth';
import {useTeams} from '@hooks/devotees/useTeams';
import {toWeekString, getWeekStart, getWeekEnd} from '@utils/date.utils';
import {CallingListDocument} from '@mytypes/calling.types';
import {USER_ROLES} from '@constants/roles';

export const useCallingListsForWeek = (weekString: string) => {
  const {organizationId, role, teamIds, user} = useAuth();
  const {data: teams = []} = useTeams();

  return useQuery({
    queryKey: QUERY_KEYS.calling.weekList(organizationId ?? '', weekString),
    queryFn: async () => {
      const allLists = await getCallingListsForWeek(organizationId!, weekString);

      if (role === USER_ROLES.ADMIN) return allLists;

      // For team leaders and volunteers — only their teams
      return allLists.filter(l => teamIds.includes(l.teamId));
    },
    enabled: !!organizationId && !!weekString,
    staleTime: 30_000,
  });
};

export const useCallingList = (listId: string | null) => {
  const queryClient = useQueryClient();
  const qKey = QUERY_KEYS.calling.list(listId ?? '');

  useEffect(() => {
    if (!listId) return;
    const unsub = subscribeToCallingList(listId, data => {
      if (data) queryClient.setQueryData<CallingListDocument>(qKey, data);
    });
    return unsub;
  }, [listId, queryClient]);

  return useQuery({
    queryKey: qKey,
    queryFn: () => null as CallingListDocument | null,
    enabled: !!listId,
    staleTime: Infinity,
  });
};

export const useCurrentWeekString = () => {
  const now = new Date();
  return toWeekString(now);
};
