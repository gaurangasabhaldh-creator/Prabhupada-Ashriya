import {useQuery} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {getCallingListsForUser} from '@services/firestore/calling.repository';
import {useAuth} from '@hooks/auth/useAuth';

export const useCallingHistory = () => {
  const {user, organizationId} = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.calling.history(organizationId ?? ''),
    queryFn: () => getCallingListsForUser(organizationId!, user!.uid, 12),
    enabled: !!organizationId && !!user,
    staleTime: 60_000,
  });
};
