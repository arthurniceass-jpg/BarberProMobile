import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { BarbershopDetailScreen } from '../screens/BarbershopDetailScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { HomeStackParamList } from './types';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
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
