import {Timestamp} from './common.types';
import {DevoteeCategory} from '@constants/categories';

export interface TeamStats {
  weeklyPresent: number;
  weeklyTotal: number;
  weeklyAttendancePct: number;
  monthlyAttendancePct: number;
  currentWeekRank: number;
  currentMonthRank: number;
  growthPctWeekOnWeek: number;
  lastUpdated: Timestamp;
}

export interface TeamDocument {
  id: string;
  name: string;
  organizationId: string;
  leaderId: string;
  leaderName: string;
  category: DevoteeCategory;
  color: string | null;
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newComers: number;
  weeklyTarget: number;
  targetType: 'count' | 'percentage';
  stats: TeamStats;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
