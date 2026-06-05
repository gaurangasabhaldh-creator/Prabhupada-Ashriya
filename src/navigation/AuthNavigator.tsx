import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@mytypes/navigation.types';
import {AUTH_ROUTES} from '@constants/routes';
import LoginScreen from '@screens/auth/LoginScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';
import ChangePasswordScreen from '@screens/auth/ChangePasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={AUTH_ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen
        name={AUTH_ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name={AUTH_ROUTES.CHANGE_PASSWORD}
        component={ChangePasswordScreen}
      />
    </Stack.Navigator>
  );
}
