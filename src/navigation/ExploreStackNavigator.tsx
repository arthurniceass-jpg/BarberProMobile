import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExploreScreen } from '../screens/ExploreScreen';
import { BarbershopDetailScreen } from '../screens/BarbershopDetailScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { ExploreStackParamList } from './types';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export function ExploreStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="ExploreMain" component={ExploreScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="BarbershopDetail"
        component={BarbershopDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          title: 'Agendar Horário',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack.Navigator>
  );
}
