import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import {QUERY_KEYS} from '../queryKeys';
import {
  getSessionsForWeek,
  getRecordsForWeek,
} from '@services/firestore/attendance.repository';
import {useAuth} from '@hooks/auth/useAuth';
import {AttendanceStatus} from '@constants/attendance';

export const useAttendanceSheet = (weekString: string, teamId?: string) => {
  const {organizationId} = useAuth();

  const sessionsQuery = useQuery({
    queryKey: [...QUERY_KEYS.attendance.sheet(organizationId ?? '', weekString, teamId), 'sessions'],
    queryFn: () => getSessionsForWeek(organizationId!, weekString),
    enabled: !!organizationId,
    staleTime: 5 * 60_000,
  });

  const recordsQuery = useQuery({
    queryKey: QUERY_KEYS.attendance.sheet(organizationId ?? '', weekString, teamId),
    queryFn: () => getRecordsForWeek(organizationId!, weekString, teamId),
    enabled: !!organizationId,
    staleTime: 5 * 60_000,
  });

  // Build: Map<devoteeId, Map<dateString, status>>
  const sheetMap = useMemo(() => {
    const map = new Map<string, Map<string, AttendanceStatus>>();
    (recordsQuery.data ?? []).forEach(r => {
      if (!map.has(r.devoteeId)) map.set(r.devoteeId, new Map());
      map.get(r.devoteeId)!.set(r.dateString, r.status);
    });
    return map;
  }, [recordsQuery.data]);

  const dates = useMemo(
    () =>
      [...new Set((sessionsQuery.data ?? []).map(s => s.dateString))].sort(),
    [sessionsQuery.data],
  );

  return {
    sheetMap,
    dates,
    isLoading: sessionsQuery.isLoading || recordsQuery.isLoading,
  };
};
