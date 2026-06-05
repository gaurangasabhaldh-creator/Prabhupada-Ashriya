import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@mytypes/navigation.types';
import {HOME_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import HomeScreen from '@screens/home/HomeScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: COLORS.surface},
        headerTintColor: COLORS.primary,
        headerTitleStyle: {fontWeight: '600'},
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name={HOME_ROUTES.HOME}
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
