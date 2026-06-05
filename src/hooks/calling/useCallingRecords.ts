import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect} from 'react';
import {QUERY_KEYS} from '../queryKeys';
import {subscribeToCallRecords} from '@services/firestore/calling.repository';
import {CallRecordDocument} from '@mytypes/calling.types';
import {useCallingStore} from '@store/calling.store';
import {CALL_STATUS} from '@constants/callStatus';

export const useCallingRecords = (listId: string | null) => {
  const queryClient = useQueryClient();
  const qKey = QUERY_KEYS.calling.records(listId ?? '');
  const pendingUpdates = useCallingStore(s => s.pendingUpdates);

  useEffect(() => {
    if (!listId) return;
    const unsub = subscribeToCallRecords(listId, data => {
      queryClient.setQueryData<CallRecordDocument[]>(qKey, data);
    });
    return unsub;
  }, [listId, queryClient]);

  const query = useQuery({
    queryKey: qKey,
    queryFn: () => [] as CallRecordDocument[],
    enabled: !!listId,
    staleTime: Infinity,
    select: (data: CallRecordDocument[]) => {
      // Merge pending updates on top of Firestore data
      return data.map(record => {
        const pending = pendingUpdates[record.id];
        if (pending) return {...record, status: pending.status, notes: pending.notes};
        return record;
      });
    },
  });

  // Derived stats
  const records = query.data ?? [];
  const stats = {
    total: records.length,
    called: records.filter(r => r.status !== CALL_STATUS.PENDING).length,
    confirmedComing: records.filter(r => r.status === CALL_STATUS.CONFIRMED_COMING).length,
    notComing: records.filter(r => r.status === CALL_STATUS.NOT_COMING).length,
    maybe: records.filter(r => r.status === CALL_STATUS.MAYBE).length,
    noResponse: records.filter(r => r.status === CALL_STATUS.NO_RESPONSE).length,
    notReachable: records.filter(r => r.status === CALL_STATUS.NOT_REACHABLE).length,
    callBackLater: records.filter(r => r.status === CALL_STATUS.CALL_BACK_LATER).length,
    pending: records.filter(r => r.status === CALL_STATUS.PENDING).length,
  };

  return {...query, stats};
};
