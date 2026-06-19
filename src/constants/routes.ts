// Single source of truth for all screen/navigator names.
// Use these constants everywhere — never use raw strings.

export const AUTH_ROUTES = {
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  FORGOT_PASSWORD: 'ForgotPassword',
  CHANGE_PASSWORD: 'ChangePassword',
} as const;

export const HOME_ROUTES = {
  HOME: 'Home',
} as const;

export const ATTENDANCE_ROUTES = {
  ATTENDANCE: 'Attendance',
  DEVOTEE_ATTENDANCE_DETAIL: 'DevoteeAttendanceDetail',
} as const;

export const CALLING_ROUTES = {
  CALLING: 'Calling',
  CALL_DETAIL: 'CallDetail',
} as const;

export const CARE_ROUTES = {
  CARE: 'Care',
  FOLLOW_UP_DETAIL: 'FollowUpDetail',
} as const;

export const PROFILES_ROUTES = {
  DEVOTEE_LIST: 'DevoteeList',
  DEVOTEE_DETAIL: 'DevoteeDetail',
  ADD_DEVOTEE: 'AddDevotee',
  EDIT_DEVOTEE: 'EditDevotee',
} as const;

export const REPORTS_ROUTES = {
  REPORTS: 'Reports',
  WEEKLY_REPORT: 'WeeklyReport',
  MONTHLY_REPORT: 'MonthlyReport',
  TEAM_MANAGEMENT: 'TeamManagement',
  USER_MANAGEMENT: 'UserManagement',
  SETTINGS: 'Settings',
} as const;

export const TAB_ROUTES = {
  HOME_TAB: 'HomeTab',
  ATTENDANCE_TAB: 'AttendanceTab',
  CALLING_TAB: 'CallingTab',
  CARE_TAB: 'CareTab',
  PROFILES_TAB: 'ProfilesTab',
} as const;

export const DRAWER_ROUTES = {
  MAIN_TABS: 'MainTabs',
  REPORTS_DRAWER: 'ReportsDrawer',
} as const;

export const ROOT_ROUTES = {
  AUTH: 'Auth',
  APP: 'App',
} as const;
