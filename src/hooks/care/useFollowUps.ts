import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect} from 'react';
import {QUERY_KEYS} from '../queryKeys';
import {
  getFollowUpById,
  subscribeToFollowUps,
} from '@services/firestore/followup.repository';
import {useAuth} from '@hooks/auth/useAuth';
import {FollowUpDocument} from '@mytypes/followUp.types';

export const useFollowUps = (teamId?: string) => {
  const {organizationId, role, teamIds} = useAuth();
  const queryClient = useQueryClient();
  const effectiveTeamId = role === 'admin' ? teamId : (teamIds[0] ?? undefined);
  const qKey = QUERY_KEYS.care.followUps(organizationId ?? '', effectiveTeamId);

  useEffect(() => {
    if (!organizationId) return;
    const unsub = subscribeToFollowUps(organizationId, effectiveTeamId, data => {
      queryClient.setQueryData<FollowUpDocument[]>(qKey, data);
    });
    return unsub;
  }, [organizationId, effectiveTeamId, queryClient]);

  return useQuery({
    queryKey: qKey,
    queryFn: () => [] as FollowUpDocument[],
    enabled: !!organizationId,
    staleTime: Infinity,
  });
};

export const useFollowUp = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.care.followUp(id),
    queryFn: () => getFollowUpById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
};
