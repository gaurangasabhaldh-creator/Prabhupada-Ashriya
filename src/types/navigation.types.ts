import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {DrawerScreenProps} from '@react-navigation/drawer';

// ─── Auth ────────────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ChangePassword: undefined;
};

// ─── Feature stacks ──────────────────────────────────────────────────────────

export type HomeStackParamList = {
  Home: undefined;
};

export type AttendanceStackParamList = {
  Attendance: undefined;
  DevoteeAttendanceDetail: {devoteeId: string; devoteeName: string};
};

export type CallingStackParamList = {
  Calling: undefined;
  CallDetail: {callId: string; listId: string};
};

export type CareStackParamList = {
  Care: undefined;
  FollowUpDetail: {followUpId: string};
};

export type ProfilesStackParamList = {
  DevoteeList: undefined;
  DevoteeDetail: {devoteeId: string};
  AddDevotee: undefined;
  EditDevotee: {devoteeId: string};
};

export type ReportsStackParamList = {
  Reports: undefined;
  WeeklyReport: {weekString: string};
  MonthlyReport: {month: number; year: number};
  TeamManagement: undefined;
  UserManagement: undefined;
  Settings: undefined;
};

// ─── Main tabs ───────────────────────────────────────────────────────────────

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  AttendanceTab: NavigatorScreenParams<AttendanceStackParamList>;
  CallingTab: NavigatorScreenParams<CallingStackParamList>;
  CareTab: NavigatorScreenParams<CareStackParamList>;
  ProfilesTab: NavigatorScreenParams<ProfilesStackParamList>;
};

// ─── Drawer ──────────────────────────────────────────────────────────────────

export type AppDrawerParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ReportsDrawer: NavigatorScreenParams<ReportsStackParamList>;
};

// ─── Root ────────────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppDrawerParamList>;
};

// ─── Screen prop helpers ─────────────────────────────────────────────────────

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type AttendanceScreenProps<T extends keyof AttendanceStackParamList> =
  NativeStackScreenProps<AttendanceStackParamList, T>;

export type CallingScreenProps<T extends keyof CallingStackParamList> =
  NativeStackScreenProps<CallingStackParamList, T>;

export type CareScreenProps<T extends keyof CareStackParamList> =
  NativeStackScreenProps<CareStackParamList, T>;

export type ProfilesScreenProps<T extends keyof ProfilesStackParamList> =
  NativeStackScreenProps<ProfilesStackParamList, T>;

export type ReportsScreenProps<T extends keyof ReportsStackParamList> =
  NativeStackScreenProps<ReportsStackParamList, T>;

export type MainTabProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

export type AppDrawerProps<T extends keyof AppDrawerParamList> =
  DrawerScreenProps<AppDrawerParamList, T>;
