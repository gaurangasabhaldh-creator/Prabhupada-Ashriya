import {useQuery} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {getInactiveDevotees} from '@services/firestore/followup.repository';
import {useAuth} from '@hooks/auth/useAuth';

export const useInactiveDevotees = (teamId?: string) => {
  const {organizationId, role, teamIds} = useAuth();
  const effectiveTeamId = role === 'admin' ? teamId : (teamIds[0] ?? undefined);

  return useQuery({
    queryKey: QUERY_KEYS.care.inactive(organizationId ?? '', effectiveTeamId),
    queryFn: () => getInactiveDevotees(organizationId!, effectiveTeamId, 3),
    enabled: !!organizationId,
    staleTime: 120_000,
  });
};
