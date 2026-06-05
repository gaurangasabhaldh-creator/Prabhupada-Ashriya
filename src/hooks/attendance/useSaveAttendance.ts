import {useMutation, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {batchMarkAttendance} from '@services/firestore/attendance.repository';
import {useAttendanceStore} from '@store/attendance.store';
import {useAuth} from '@hooks/auth/useAuth';
import {useUIStore} from '@store/ui.store';
import {parseError} from '@utils/error.utils';
import {AttendanceSessionDocument} from '@mytypes/attendance.types';
import {toWeekString} from '@utils/date.utils';
import {parse} from 'date-fns';

export const useSaveAttendance = () => {
  const queryClient = useQueryClient();
  const {pendingMarks, clearPendingMarks} = useAttendanceStore();
  const {user, organizationId} = useAuth();
  const {showToast} = useUIStore();

  return useMutation({
    mutationFn: async (session: AttendanceSessionDocument) => {
      const marks = Object.values(pendingMarks).map(m => ({
        devoteeId: m.devoteeId,
        devoteeTeamId: m.devoteeTeamId,
        status: m.status,
      }));

      if (marks.length === 0) return;

      const date = parse(session.dateString, 'yyyy-MM-dd', new Date());

      await batchMarkAttendance({
        sessionId: session.id,
        orgId: organizationId!,
        category: session.category,
        dateString: session.dateString,
        weekString: toWeekString(date),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        marks,
        markedBy: user!.uid,
      });
    },
    onSuccess: (_data, session) => {
      clearPendingMarks();
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.attendance.records(session.id),
      });
      showToast({type: 'success', message: 'Attendance saved successfully'});
    },
    onError: err => showToast({type: 'error', message: parseError(err).userMessage}),
  });
};
