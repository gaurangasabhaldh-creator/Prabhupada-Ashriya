import {useCallingStore} from '@store/calling.store';
import {useUIStore} from '@store/ui.store';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {batchUpdateCallRecords} from '@services/firestore/calling.repository';
import {QUERY_KEYS} from '../queryKeys';
import {CallStatus} from '@constants/callStatus';
import {useAuth} from '@hooks/auth/useAuth';

export const useUpdateCallStatus = () => {
  const setPendingUpdate = useCallingStore(s => s.setPendingUpdate);
  const showToast = useUIStore(s => s.showToast);

  const markCall = (recordId: string, status: CallStatus, notes: string | null = null) => {
    setPendingUpdate(recordId, {status, notes});
    showToast({message: 'Status saved locally', type: 'success', duration: 1500});
  };

  return {markCall};
};

export const useSaveCallingUpdates = (listId: string | null) => {
  const {user} = useAuth();
  const queryClient = useQueryClient();
  const pendingUpdates = useCallingStore(s => s.pendingUpdates);
  const clearPendingUpdates = useCallingStore(s => s.clearPendingUpdates);
  const showToast = useUIStore(s => s.showToast);

  return useMutation({
    mutationFn: async () => {
      if (!user || !listId) throw new Error('Not ready');
      const updates = Object.values(pendingUpdates).map(u => ({
        id: u.callRecordId,
        status: u.status,
        notes: u.notes,
        calledBy: user.uid,
      }));
      if (!updates.length) return;
      await batchUpdateCallRecords(updates);
    },
    onSuccess: () => {
      clearPendingUpdates();
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.calling.records(listId ?? '')});
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.calling.list(listId ?? '')});
      showToast({message: 'All call statuses saved', type: 'success'});
    },
    onError: (err: Error) => {
      showToast({message: err.message, type: 'error'});
    },
  });
};
