import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';
import SplashScreen from '@/components/SplashScreen';
import OnboardingScreen from '@/components/OnboardingScreen';

export default function Index() {
  const { hasCompletedOnboarding, completeOnboarding, isLoading } = useAppContext();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = async () => {
    await completeOnboarding();
  };

  // Move navigation logic to useEffect to prevent Rules of Hooks violation
  useEffect(() => {
    if (!isLoading && !showSplash && hasCompletedOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isLoading, showSplash, hasCompletedOnboarding]);

  if (isLoading || showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Return a view while navigation is happening
  return <View />;
}