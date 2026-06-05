import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AppDrawerParamList} from '@mytypes/navigation.types';
import {DRAWER_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import MainTabNavigator from './MainTabNavigator';
import ReportsStack from './stacks/ReportsStack';
import {usePermissions} from '@hooks/auth/usePermissions';

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export default function AppNavigator() {
  const {canViewReportsDrawer} = usePermissions();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {backgroundColor: COLORS.surfaceContainerLow},
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.onSurfaceVariant,
        drawerActiveBackgroundColor: COLORS.primaryContainer + '30',
      }}>
      <Drawer.Screen
        name={DRAWER_ROUTES.MAIN_TABS}
        component={MainTabNavigator}
        options={{drawerLabel: 'Home', title: 'Prabhupad Ashraya'}}
      />
      {canViewReportsDrawer && (
        <Drawer.Screen
          name={DRAWER_ROUTES.REPORTS_DRAWER}
          component={ReportsStack}
          options={{drawerLabel: 'Reports & Admin', title: 'Reports'}}
        />
      )}
    </Drawer.Navigator>
  );
}
