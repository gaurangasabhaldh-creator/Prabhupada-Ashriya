import {useMemo} from 'react';
import {useAttendanceRecords} from './useAttendanceRecords';
import {ATTENDANCE_STATUS} from '@constants/attendance';

export const useAttendanceStats = (sessionId: string | null, totalEligible: number) => {
  const {statusMap} = useAttendanceRecords(sessionId);

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    statusMap.forEach(status => {
      if (status === ATTENDANCE_STATUS.PRESENT || status === ATTENDANCE_STATUS.LATE) present++;
      if (status === ATTENDANCE_STATUS.ABSENT) absent++;
      if (status === ATTENDANCE_STATUS.LATE) late++;
      if (status === ATTENDANCE_STATUS.EXCUSED) excused++;
    });

    return {present, absent, late, excused, marked: statusMap.size, total: totalEligible};
  }, [statusMap, totalEligible]);

  return stats;
};
