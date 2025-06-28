import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/contexts/AppContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { initializePurchases } from '@/hooks/usePurchases';
import Toast from 'react-native-toast-message';

// Conditionally import CopilotProvider only for native platforms
let CopilotProvider: any = null;

if (Platform.OS !== 'web') {
  try {
    const copilotModule = require('react-native-copilot');
    CopilotProvider = copilotModule.CopilotProvider;
  } catch (error) {
    console.warn('react-native-copilot not available:', error);
  }
}

// Create a conditional wrapper for CopilotProvider
const ConditionalCopilotProvider = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS !== 'web' && CopilotProvider) {
    return <CopilotProvider>{children}</CopilotProvider>;
  }
  return <>{children}</>;
};

export default function RootLayout() {
  useFrameworkReady();
  
  // Initialize RevenueCat
  initializePurchases();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConditionalCopilotProvider>
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
      </ConditionalCopilotProvider>
    </GestureHandlerRootView>
  );
}