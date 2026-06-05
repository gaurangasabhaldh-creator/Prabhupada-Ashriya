import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfilesStackParamList} from '@mytypes/navigation.types';
import {PROFILES_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import DevoteeListScreen from '@screens/devotees/DevoteeListScreen';
import DevoteeDetailScreen from '@screens/devotees/DevoteeDetailScreen';
import AddDevoteeScreen from '@screens/devotees/AddDevoteeScreen';
import EditDevoteeScreen from '@screens/devotees/EditDevoteeScreen';

const Stack = createNativeStackNavigator<ProfilesStackParamList>();

export default function ProfilesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: COLORS.surface},
        headerTintColor: COLORS.primary,
        headerTitleStyle: {fontWeight: '600'},
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name={PROFILES_ROUTES.DEVOTEE_LIST}
        component={DevoteeListScreen}
        options={{title: 'Devotees'}}
      />
      <Stack.Screen
        name={PROFILES_ROUTES.DEVOTEE_DETAIL}
        component={DevoteeDetailScreen}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name={PROFILES_ROUTES.ADD_DEVOTEE}
        component={AddDevoteeScreen}
        options={{title: 'Add Devotee'}}
      />
      <Stack.Screen
        name={PROFILES_ROUTES.EDIT_DEVOTEE}
        component={EditDevoteeScreen}
        options={{title: 'Edit Profile'}}
      />
    </Stack.Navigator>
  );
}
