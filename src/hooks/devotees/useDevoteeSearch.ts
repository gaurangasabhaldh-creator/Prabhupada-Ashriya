import {useQuery} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {searchDevotees} from '@services/firestore/devotees.repository';
import {useAuth} from '@hooks/auth/useAuth';
import {useDebounce} from '@hooks/shared/useDebounce';

export const useDevoteeSearch = (term: string, teamId?: string) => {
  const {organizationId} = useAuth();
  const debouncedTerm = useDebounce(term, 350);

  return useQuery({
    queryKey: QUERY_KEYS.devotees.search(organizationId ?? '', debouncedTerm),
    queryFn: () => searchDevotees(organizationId!, debouncedTerm, teamId),
    enabled: !!organizationId && debouncedTerm.length >= 2,
    staleTime: 30_000,
  });
};
