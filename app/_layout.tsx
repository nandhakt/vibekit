import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/contexts/AppContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { initializePurchases } from '@/hooks/usePurchases';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  useFrameworkReady();
  
  // Initialize RevenueCat
  initializePurchases();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ProfileProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
          <Toast />
        </ProfileProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}