import {useAuth} from './useAuth';
import {hasPermission, isAdmin} from '@utils/role.utils';

export const usePermissions = () => {
  const {role, teamIds} = useAuth();

  return {
    canMarkAttendance: (targetTeamId?: string) =>
      hasPermission(role, 'mark_attendance', {teamIds, targetTeamId}),

    canEditAttendance: (targetTeamId?: string) =>
      hasPermission(role, 'edit_attendance', {teamIds, targetTeamId}),

    canViewAttendanceReports: () =>
      hasPermission(role, 'view_attendance_reports'),

    canViewCare: () => hasPermission(role, 'view_care'),

    canViewCareAnalytics: () => hasPermission(role, 'view_care_analytics'),

    canManageFollowUps: (targetTeamId?: string) =>
      hasPermission(role, 'manage_follow_ups', {teamIds, targetTeamId}),

    canAddDevotee: () => hasPermission(role, 'add_devotee'),

    canEditDevotee: (targetTeamId?: string) =>
      hasPermission(role, 'edit_devotee', {teamIds, targetTeamId}),

    canDeleteDevotee: () => hasPermission(role, 'delete_devotee'),

    canManageTeams: () => hasPermission(role, 'manage_teams'),

    canManageUsers: () => hasPermission(role, 'manage_users'),

    canExportData: () => hasPermission(role, 'export_data'),

    canViewReportsDrawer: () => hasPermission(role, 'view_reports_drawer'),

    isAdmin: isAdmin(role),
  };
};
