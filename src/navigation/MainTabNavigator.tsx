import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@mytypes/navigation.types';
import {TAB_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import HomeStack from './stacks/HomeStack';
import AttendanceStack from './stacks/AttendanceStack';
import CallingStack from './stacks/CallingStack';
import CareStack from './stacks/CareStack';
import ProfilesStack from './stacks/ProfilesStack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Platform} from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, {focused: string; unfocused: string}> = {
  [TAB_ROUTES.HOME_TAB]: {focused: 'home', unfocused: 'home-outline'},
  [TAB_ROUTES.ATTENDANCE_TAB]: {focused: 'calendar-check', unfocused: 'calendar-check-outline'},
  [TAB_ROUTES.CALLING_TAB]: {focused: 'phone', unfocused: 'phone-outline'},
  [TAB_ROUTES.CARE_TAB]: {focused: 'heart', unfocused: 'heart-outline'},
  [TAB_ROUTES.PROFILES_TAB]: {focused: 'account-group', unfocused: 'account-group-outline'},
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: COLORS.outlineVariant,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -3},
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
          marginTop: 2,
        },
        tabBarIcon: ({focused, color, size}) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Icon name={iconName} size={24} color={color} />;
        },
      })}>
      <Tab.Screen
        name={TAB_ROUTES.HOME_TAB}
        component={HomeStack}
        options={{tabBarLabel: 'Home'}}
      />
      <Tab.Screen
        name={TAB_ROUTES.ATTENDANCE_TAB}
        component={AttendanceStack}
        options={{tabBarLabel: 'Attendance'}}
      />
      <Tab.Screen
        name={TAB_ROUTES.CALLING_TAB}
        component={CallingStack}
        options={{tabBarLabel: 'Calling'}}
      />
      <Tab.Screen
        name={TAB_ROUTES.CARE_TAB}
        component={CareStack}
        options={{tabBarLabel: 'Care'}}
      />
      <Tab.Screen
        name={TAB_ROUTES.PROFILES_TAB}
        component={ProfilesStack}
        options={{tabBarLabel: 'Profiles'}}
      />
    </Tab.Navigator>
  );
}
