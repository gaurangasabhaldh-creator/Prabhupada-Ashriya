import {useQuery} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {getTeamsByOrg} from '@services/firestore/teams.repository';
import {useAuth} from '@hooks/auth/useAuth';

export const useTeams = () => {
  const {organizationId} = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.teams.list(organizationId ?? ''),
    queryFn: () => getTeamsByOrg(organizationId!),
    enabled: !!organizationId,
    staleTime: 5 * 60_000,
  });
};
