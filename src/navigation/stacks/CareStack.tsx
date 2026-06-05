import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CareStackParamList} from '@mytypes/navigation.types';
import {CARE_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import CareScreen from '@screens/care/CareScreen';
import FollowUpDetailScreen from '@screens/care/FollowUpDetailScreen';

const Stack = createNativeStackNavigator<CareStackParamList>();

export default function CareStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: COLORS.surface},
        headerTintColor: COLORS.primary,
        headerTitleStyle: {fontWeight: '600'},
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name={CARE_ROUTES.CARE}
        component={CareScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={CARE_ROUTES.FOLLOW_UP_DETAIL}
        component={FollowUpDetailScreen}
        options={{title: 'Follow-Up'}}
      />
    </Stack.Navigator>
  );
}
