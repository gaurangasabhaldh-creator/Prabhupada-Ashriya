import {useMutation, useQueryClient} from '@tanstack/react-query';
import {submitCallingList} from '@services/firestore/calling.repository';
import {QUERY_KEYS} from '../queryKeys';
import {useAuth} from '@hooks/auth/useAuth';
import {useUIStore} from '@store/ui.store';
import {useCallingRecords} from './useCallingRecords';

export const useSubmitCallingReport = (listId: string | null) => {
  const {user, organizationId} = useAuth();
  const queryClient = useQueryClient();
  const showToast = useUIStore(s => s.showToast);
  const {stats} = useCallingRecords(listId);

  return useMutation({
    mutationFn: async () => {
      if (!listId || !user) throw new Error('Not ready');
      await submitCallingList(listId, user.uid, {
        totalCalled: stats.called,
        confirmedComing: stats.confirmedComing,
        notComing: stats.notComing,
        maybe: stats.maybe,
        noResponse: stats.noResponse,
        notReachable: stats.notReachable,
        callBackLater: stats.callBackLater,
        pendingCalls: stats.pending,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.calling.list(listId ?? '')});
      showToast({message: 'Calling report submitted!', type: 'success'});
    },
    onError: (err: Error) => {
      showToast({message: err.message, type: 'error'});
    },
  });
};
