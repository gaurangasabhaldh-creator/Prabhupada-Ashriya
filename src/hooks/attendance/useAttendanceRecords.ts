import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useMemo} from 'react';
import {QUERY_KEYS} from '../queryKeys';
import {subscribeToSessionRecords} from '@services/firestore/attendance.repository';
import {useAttendanceStore} from '@store/attendance.store';
import {AttendanceRecordDocument} from '@mytypes/attendance.types';
import {AttendanceStatus} from '@constants/attendance';

export const useAttendanceRecords = (sessionId: string | null) => {
  const queryClient = useQueryClient();
  const pendingMarks = useAttendanceStore(s => s.pendingMarks);

  // Real-time subscription hydrates cache
  useEffect(() => {
    if (!sessionId) return;
    const unsub = subscribeToSessionRecords(sessionId, records => {
      queryClient.setQueryData<AttendanceRecordDocument[]>(
        QUERY_KEYS.attendance.records(sessionId),
        records,
      );
    });
    return unsub;
  }, [sessionId, queryClient]);

  const {data: firestoreRecords = []} = useQuery({
    queryKey: QUERY_KEYS.attendance.records(sessionId ?? ''),
    queryFn: () => [] as AttendanceRecordDocument[],
    enabled: !!sessionId,
    staleTime: Infinity,
  });

  // Merge Firestore records + pending marks (pending takes priority)
  const statusMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    firestoreRecords.forEach(r => map.set(r.devoteeId, r.status));
    Object.values(pendingMarks).forEach(m => map.set(m.devoteeId, m.status));
    return map;
  }, [firestoreRecords, pendingMarks]);

  return {firestoreRecords, statusMap};
};
