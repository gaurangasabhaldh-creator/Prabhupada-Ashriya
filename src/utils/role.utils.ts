import {USER_ROLES, UserRole} from '@constants/roles';

type Action =
  | 'mark_attendance'
  | 'edit_attendance'
  | 'view_attendance_reports'
  | 'view_care'
  | 'view_care_analytics'
  | 'manage_follow_ups'
  | 'add_devotee'
  | 'edit_devotee'
  | 'delete_devotee'
  | 'manage_teams'
  | 'manage_users'
  | 'export_data'
  | 'view_all_teams'
  | 'view_reports_drawer';

interface PermissionContext {
  teamIds?: string[];
  targetTeamId?: string;
}

const PERMISSIONS: Record<Action, UserRole[]> = {
  mark_attendance: [USER_ROLES.ADMIN, USER_ROLES.TEAM_LEADER, USER_ROLES.VOLUNTEER],
  edit_attendance: [USER_ROLES.ADMIN, USER_ROLES.TEAM_LEADER, USER_ROLES.VOLUNTEER],
  view_attendance_reports: [USER_ROLES.ADMIN, USER_ROLES.TEAM_LEADER, USER_ROLES.VOLUNTEER],
  view_care: [USER_ROLES.ADMIN, USER_ROLES.TEAM_LEADER, USER_ROLES.VOLUNTEER],
  view_care_analytics: [USER_ROLES.ADMIN, USER_ROLES.TEAM_LEADER, USER_ROLES.VOLUNTEER],
  manage_follow_ups: [USER_ROLES.ADMIN, USER_ROLES.TEAM_LEADER],
  add_devotee: [USER_ROLES.ADMIN, USER_ROLES.TEAM_LEADER],
  edit_devotee: [USER_ROLES.ADMIN, USER_ROLES.TEAM_LEADER],
  delete_devotee: [USER_ROLES.ADMIN],
  manage_teams: [USER_ROLES.ADMIN],
  manage_users: [USER_ROLES.ADMIN],
  export_data: [USER_ROLES.ADMIN],
  view_all_teams: [USER_ROLES.ADMIN],
  view_reports_drawer: [USER_ROLES.ADMIN],
};

export const hasPermission = (
  role: UserRole | null | undefined,
  action: Action,
  context?: PermissionContext,
): boolean => {
  if (!role) return false;
  if (!PERMISSIONS[action].includes(role)) return false;

  // Team-scoped check for non-admins
  if (
    context?.targetTeamId &&
    context?.teamIds &&
    role !== USER_ROLES.ADMIN
  ) {
    return context.teamIds.includes(context.targetTeamId);
  }

  return true;
};

export const isAdmin = (role: UserRole | null | undefined): boolean =>
  role === USER_ROLES.ADMIN;

export const isTeamLeader = (role: UserRole | null | undefined): boolean =>
  role === USER_ROLES.TEAM_LEADER;

export const isVolunteer = (role: UserRole | null | undefined): boolean =>
  role === USER_ROLES.VOLUNTEER;
