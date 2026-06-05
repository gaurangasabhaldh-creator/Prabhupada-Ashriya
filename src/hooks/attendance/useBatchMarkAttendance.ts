import {useAttendanceStore} from '@store/attendance.store';
import {useUIStore} from '@store/ui.store';
import {ATTENDANCE_STATUS, AttendanceStatus} from '@constants/attendance';
import {DevoteeDocument} from '@mytypes/devotee.types';

export const useBatchMarkAttendance = () => {
  const {setPendingMark, clearPendingMarks} = useAttendanceStore();
  const {showConfirm} = useUIStore();

  const markAll = (devotees: DevoteeDocument[], status: AttendanceStatus) => {
    const label = status === ATTENDANCE_STATUS.PRESENT ? 'present' : 'absent';
    showConfirm({
      title: `Mark All ${label === 'present' ? 'Present' : 'Absent'}`,
      message: `Mark all ${devotees.length} devotees as ${label}?`,
      confirmLabel: `Mark All ${label === 'present' ? 'Present' : 'Absent'}`,
      destructive: status === ATTENDANCE_STATUS.ABSENT,
      onConfirm: () => {
        devotees.forEach(d =>
          setPendingMark(d.id, {devoteeTeamId: d.teamId, status}),
        );
      },
    });
  };

  const clearAll = (devotees: DevoteeDocument[]) => {
    showConfirm({
      title: 'Clear All Marks',
      message: 'Remove all pending marks for this session?',
      confirmLabel: 'Clear All',
      destructive: true,
      onConfirm: () => {
        devotees.forEach(d => {
          const {pendingMarks} = useAttendanceStore.getState();
          if (pendingMarks[d.id]) {
            const {removePendingMark} = useAttendanceStore.getState();
            removePendingMark(d.id);
          }
        });
      },
    });
  };

  return {markAll, clearAll};
};
