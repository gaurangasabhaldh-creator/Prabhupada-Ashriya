import {useQuery} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {getAbsentDevoteesForDate} from '@services/firestore/followup.repository';
import {useAuth} from '@hooks/auth/useAuth';
import {toDateString} from '@utils/date.utils';

export const useAbsentDevotees = (date: Date, teamId?: string) => {
  const {organizationId, role, teamIds} = useAuth();
  const dateString = toDateString(date);
  const effectiveTeamId = role === 'admin' ? teamId : (teamIds[0] ?? undefined);

  return useQuery({
    queryKey: QUERY_KEYS.care.absent(organizationId ?? '', dateString),
    queryFn: () =>
      getAbsentDevoteesForDate(organizationId!, dateString, effectiveTeamId),
    enabled: !!organizationId,
    staleTime: 60_000,
  });
};
