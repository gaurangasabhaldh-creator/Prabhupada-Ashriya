import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ReportsStackParamList} from '@mytypes/navigation.types';
import {REPORTS_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import ReportsScreen from '@screens/reports/ReportsScreen';
import TeamManagementScreen from '@screens/reports/TeamManagementScreen';
import UserManagementScreen from '@screens/reports/UserManagementScreen';

const Stack = createNativeStackNavigator<ReportsStackParamList>();

export default function ReportsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: COLORS.surface},
        headerTintColor: COLORS.primary,
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name={REPORTS_ROUTES.REPORTS}
        component={ReportsScreen}
        options={{title: 'Reports'}}
      />
      <Stack.Screen
        name={REPORTS_ROUTES.TEAM_MANAGEMENT}
        component={TeamManagementScreen}
        options={{title: 'Manage Teams'}}
      />
      <Stack.Screen
        name={REPORTS_ROUTES.USER_MANAGEMENT}
        component={UserManagementScreen}
        options={{title: 'Manage Users'}}
      />
    </Stack.Navigator>
  );
}
