import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@mytypes/navigation.types';
import {TAB_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import {TYPOGRAPHY} from '@constants/typography';
import HomeStack from './stacks/HomeStack';
import AttendanceStack from './stacks/AttendanceStack';
import CallingStack from './stacks/CallingStack';
import CareStack from './stacks/CareStack';
import ProfilesStack from './stacks/ProfilesStack';
import {Text} from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({name, focused}: {name: string; focused: boolean}) => (
  <Text
    style={{
      fontFamily: 'MaterialSymbolsOutlined',
      fontSize: 24,
      color: focused ? COLORS.onPrimaryContainer : COLORS.onSurfaceVariant,
    }}>
    {name}
  </Text>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.outlineVariant,
          borderTopWidth: 0.5,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.onPrimaryContainer,
        tabBarInactiveTintColor: COLORS.onSurfaceVariant,
        tabBarLabelStyle: {
          ...TYPOGRAPHY['label-md'],
          marginTop: 2,
        },
        tabBarActiveBackgroundColor: 'transparent',
      }}>
      <Tab.Screen
        name={TAB_ROUTES.HOME_TAB}
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.ATTENDANCE_TAB}
        component={AttendanceStack}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({focused}) => (
            <TabIcon name="event_available" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.CALLING_TAB}
        component={CallingStack}
        options={{
          tabBarLabel: 'Calling',
          tabBarIcon: ({focused}) => (
            <TabIcon name="call" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.CARE_TAB}
        component={CareStack}
        options={{
          tabBarLabel: 'Care',
          tabBarIcon: ({focused}) => (
            <TabIcon name="volunteer_activism" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PROFILES_TAB}
        component={ProfilesStack}
        options={{
          tabBarLabel: 'Profiles',
          tabBarIcon: ({focused}) => (
            <TabIcon name="group" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
