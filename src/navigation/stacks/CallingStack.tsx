import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CallingStackParamList} from '@mytypes/navigation.types';
import {CALLING_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import CallingScreen from '@screens/calling/CallingScreen';
import CallDetailScreen from '@screens/calling/CallDetailScreen';

const Stack = createNativeStackNavigator<CallingStackParamList>();

export default function CallingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: COLORS.surface},
        headerTintColor: COLORS.primary,
        headerTitleStyle: {fontWeight: '600'},
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name={CALLING_ROUTES.CALLING}
        component={CallingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={CALLING_ROUTES.CALL_DETAIL}
        component={CallDetailScreen}
        options={{title: 'Call Details'}}
      />
    </Stack.Navigator>
  );
}
