import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AttendanceStackParamList} from '@mytypes/navigation.types';
import {ATTENDANCE_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import AttendanceScreen from '@screens/attendance/AttendanceScreen';
import DevoteeAttendanceDetailScreen from '@screens/attendance/DevoteeAttendanceDetailScreen';

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

export default function AttendanceStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: COLORS.surface},
        headerTintColor: COLORS.primary,
        headerTitleStyle: {fontWeight: '600'},
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name={ATTENDANCE_ROUTES.ATTENDANCE}
        component={AttendanceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ATTENDANCE_ROUTES.DEVOTEE_ATTENDANCE_DETAIL}
        component={DevoteeAttendanceDetailScreen}
        options={({route}) => ({title: route.params.devoteeName})}
      />
    </Stack.Navigator>
  );
}
