import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import * as Localization from 'expo-localization';
import i18n from '@/localization/i18n';

export type Theme = 'light' | 'dark' | 'system';
export type TextSize = 'small' | 'normal' | 'large' | 'extralarge';
export type Language = 'en' | 'es' | 'fr';

interface AppContextType {
  theme: Theme;
  textSize: TextSize;
  language: Language;
  isDarkMode: boolean;
  hasCompletedOnboarding: boolean;
  appOpenCount: number;
  setTheme: (theme: Theme) => void;
  setTextSize: (size: TextSize) => void;
  setLanguage: (language: Language) => void;
  completeOnboarding: () => void;
  incrementAppOpenCount: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');
  const [textSize, setTextSizeState] = useState<TextSize>('normal');
  const [language, setLanguageState] = useState<Language>('en');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [appOpenCount, setAppOpenCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const isDarkMode = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [
        savedTheme,
        savedTextSize,
        savedLanguage,
        onboardingCompleted,
        savedAppOpenCount,
      ] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('textSize'),
        AsyncStorage.getItem('language'),
        AsyncStorage.getItem('onboardingCompleted'),
        AsyncStorage.getItem('appOpenCount'),
      ]);

      if (savedTheme) setThemeState(savedTheme as Theme);
      if (savedTextSize) setTextSizeState(savedTextSize as TextSize);
      if (onboardingCompleted) setHasCompletedOnboarding(true);
      
      // Load and increment app open count
      const currentCount = savedAppOpenCount ? parseInt(savedAppOpenCount, 10) : 0;
      const newCount = currentCount + 1;
      setAppOpenCount(newCount);
      await AsyncStorage.setItem('appOpenCount', newCount.toString());

      // Determine the language to use
      let languageToUse: Language;
      if (savedLanguage) {
        languageToUse = savedLanguage as Language;
      } else {
        const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
        const supportedLanguages = ['en', 'es', 'fr'];
        languageToUse = supportedLanguages.includes(deviceLanguage) 
          ? deviceLanguage as Language 
          : 'en';
      }

      setLanguageState(languageToUse);
      // Update i18n instance with the determined language
      await i18n.changeLanguage(languageToUse);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const setTextSize = async (newSize: TextSize) => {
    setTextSizeState(newSize);
    await AsyncStorage.setItem('textSize', newSize);
  };

  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    await AsyncStorage.setItem('language', newLanguage);
    // Update i18n instance when language changes
    await i18n.changeLanguage(newLanguage);
  };

  const completeOnboarding = async () => {
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem('onboardingCompleted', 'true');
  };

  const incrementAppOpenCount = async () => {
    const newCount = appOpenCount + 1;
    setAppOpenCount(newCount);
    await AsyncStorage.setItem('appOpenCount', newCount.toString());
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        textSize,
        language,
        isDarkMode,
        hasCompletedOnboarding,
        appOpenCount,
        setTheme,
        setTextSize,
        setLanguage,
        completeOnboarding,
        incrementAppOpenCount,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}