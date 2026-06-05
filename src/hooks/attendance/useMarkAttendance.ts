import {useAttendanceStore} from '@store/attendance.store';
import {AttendanceStatus} from '@constants/attendance';
import {DevoteeDocument} from '@mytypes/devotee.types';

// Local-only mark — goes into Zustand pending.
// Saved to Firestore only when Save FAB is pressed.
export const useMarkAttendance = () => {
  const {setPendingMark, removePendingMark} = useAttendanceStore();

  const mark = (
    devotee: DevoteeDocument,
    status: AttendanceStatus,
    arrivalTime?: Date,
  ) => {
    setPendingMark(devotee.id, {
      devoteeTeamId: devotee.teamId,
      status,
      arrivalTime,
    });
  };

  const unmark = (devoteeId: string) => removePendingMark(devoteeId);

  return {mark, unmark};
};
