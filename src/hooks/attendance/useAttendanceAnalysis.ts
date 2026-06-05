import {useQuery} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryKeys';
import {getRecordsForWeek, getSessionsForWeek} from '@services/firestore/attendance.repository';
import {useAuth} from '@hooks/auth/useAuth';
import {toWeekString} from '@utils/date.utils';

export const useAttendanceAnalysis = (weekOffset = 0) => {
  const {organizationId, role, teamIds} = useAuth();
  const date = new Date();
  date.setDate(date.getDate() - weekOffset * 7);
  const weekString = toWeekString(date);
  const teamId = role !== 'admin' ? teamIds[0] : undefined;

  return useQuery({
    queryKey: ['attendance', 'analysis', organizationId, weekString, teamId],
    queryFn: async () => {
      const [sessions, records] = await Promise.all([
        getSessionsForWeek(organizationId!, weekString),
        getRecordsForWeek(organizationId!, weekString, teamId),
      ]);

      // Devotee summary map
      const devoteeMap: Record<string, {name: string; present: number; absent: number; late: number; excused: number}> = {};
      records.forEach(r => {
        if (!devoteeMap[r.devoteeId]) {
          devoteeMap[r.devoteeId] = {name: r.devoteeId, present: 0, absent: 0, late: 0, excused: 0};
        }
        const d = devoteeMap[r.devoteeId];
        if (r.status === 'present') d.present++;
        else if (r.status === 'absent') d.absent++;
        else if (r.status === 'late') d.late++;
        else if (r.status === 'excused') d.excused++;
      });

      const devotees = Object.entries(devoteeMap).map(([id, v]) => ({
        devoteeId: id,
        ...v,
        total: v.present + v.absent + v.late + v.excused,
        pct: v.present + v.late > 0
          ? Math.round(((v.present + v.late) / (v.present + v.absent + v.late + v.excused)) * 100)
          : 0,
      }));

      const consistent = devotees.filter(d => d.pct >= 80).sort((a, b) => b.pct - a.pct);
      const atRisk = devotees.filter(d => d.absent >= 2).sort((a, b) => b.absent - a.absent);

      // Day-by-day attendance
      const dayStats = sessions.map(s => ({
        dateString: s.dateString,
        present: s.present,
        absent: s.absent,
        late: s.late,
        total: s.totalEligible || (s.present + s.absent + s.late + s.excused),
        pct: s.attendancePct,
      })).sort((a, b) => a.dateString.localeCompare(b.dateString));

      return {
        weekString,
        sessions,
        records,
        devotees,
        consistent,
        atRisk,
        dayStats,
        totalPresent: records.filter(r => r.status === 'present' || r.status === 'late').length,
        totalAbsent: records.filter(r => r.status === 'absent').length,
        avgPct:
          dayStats.length > 0
            ? Math.round(dayStats.reduce((a, d) => a + d.pct, 0) / dayStats.length)
            : 0,
      };
    },
    enabled: !!organizationId,
    staleTime: 120_000,
  });
};

export const useWeeklyTrend = (weeks = 6) => {
  const {organizationId, role, teamIds} = useAuth();
  const teamId = role !== 'admin' ? teamIds[0] : undefined;

  return useQuery({
    queryKey: ['attendance', 'trend', organizationId, teamId, weeks],
    queryFn: async () => {
      const results = [];
      for (let i = weeks - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i * 7);
        const wStr = toWeekString(d);
        const sessions = await getSessionsForWeek(organizationId!, wStr);
        const totalPct =
          sessions.length > 0
            ? Math.round(sessions.reduce((a, s) => a + s.attendancePct, 0) / sessions.length)
            : 0;
        results.push({weekString: wStr, avgPct: totalPct, sessions: sessions.length});
      }
      return results;
    },
    enabled: !!organizationId,
    staleTime: 300_000,
  });
};
