export const USER_ROLES = {
  ADMIN: 'admin',
  TEAM_LEADER: 'team_leader',
  VOLUNTEER: 'volunteer',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin / Coordinator',
  team_leader: 'Team Leader',
  volunteer: 'Volunteer',
};

// Defines which tabs are visible per role.
// All roles see Home, Attendance, Calling, Care, Profiles.
// Admin additionally sees the Reports drawer.
export const ROLE_TAB_ACCESS: Record<UserRole, string[]> = {
  admin: ['HomeTab', 'AttendanceTab', 'CallingTab', 'CareTab', 'ProfilesTab'],
  team_leader: ['HomeTab', 'AttendanceTab', 'CallingTab', 'CareTab', 'ProfilesTab'],
  volunteer: ['HomeTab', 'AttendanceTab', 'CallingTab', 'CareTab', 'ProfilesTab'],
};

// Attendance sub-tabs visible per role
export const ROLE_ATTENDANCE_TAB_ACCESS: Record<UserRole, string[]> = {
  admin: ['live', 'sheet', 'late', 'new', 'analysis', 'leaderboard', 'trends'],
  team_leader: ['live', 'sheet', 'late', 'new', 'analysis', 'leaderboard', 'trends'],
  volunteer: ['live', 'sheet', 'analysis', 'leaderboard', 'trends'],
};
