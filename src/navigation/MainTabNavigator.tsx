import React from 'react';
import {View, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@mytypes/navigation.types';
import {TAB_ROUTES} from '@constants/routes';
import HomeStack from './stacks/HomeStack';
import AttendanceStack from './stacks/AttendanceStack';
import CallingStack from './stacks/CallingStack';
import CareStack from './stacks/CareStack';
import ProfilesStack from './stacks/ProfilesStack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, {focused: string; unfocused: string}> = {
  [TAB_ROUTES.HOME_TAB]: {focused: 'home', unfocused: 'home-outline'},
  [TAB_ROUTES.ATTENDANCE_TAB]: {focused: 'calendar-check', unfocused: 'calendar-check-outline'},
  [TAB_ROUTES.CALLING_TAB]: {focused: 'phone', unfocused: 'phone-outline'},
  [TAB_ROUTES.CARE_TAB]: {focused: 'heart', unfocused: 'heart-outline'},
  [TAB_ROUTES.PROFILES_TAB]: {focused: 'account-circle', unfocused: 'account-circle-outline'},
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 75,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 8,
          elevation: 16,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -4},
          shadowOpacity: 0.1,
          shadowRadius: 12,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarActiveTintColor: '#FF8F00',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
          marginTop: 2,
        },
        tabBarIcon: ({focused, color}) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          if (focused) {
            return (
              <View style={{
                backgroundColor: '#FFF3E0',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 6,
              }}>
                <Icon name={iconName} size={24} color="#FF8F00" />
              </View>
            );
          }
          return <Icon name={iconName} size={22} color={color} />;
        },
      })}>
      <Tab.Screen name={TAB_ROUTES.HOME_TAB} component={HomeStack} options={{tabBarLabel: 'Home'}} />
      <Tab.Screen name={TAB_ROUTES.ATTENDANCE_TAB} component={AttendanceStack} options={{tabBarLabel: 'Attendance'}} />
      <Tab.Screen name={TAB_ROUTES.CALLING_TAB} component={CallingStack} options={{tabBarLabel: 'Calling'}} />
      <Tab.Screen name={TAB_ROUTES.CARE_TAB} component={CareStack} options={{tabBarLabel: 'Care'}} />
      <Tab.Screen name={TAB_ROUTES.PROFILES_TAB} component={ProfilesStack} options={{tabBarLabel: 'Profile'}} />
    </Tab.Navigator>
  );
}
