import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      marginBottom: spacing.xxl,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    logoText: {
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    loadingText: {
      ...typography.body,
      marginTop: spacing.lg,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.logoContainer}>
        <View style={[styles.logo, { backgroundColor: colors.background }]}>
          <Text style={[styles.logoText, { color: colors.primary }]}>VibeKit</Text>
        </View>
      </View>
      <Text style={[styles.loadingText, { color: colors.background }]}>
        {t('splash.loading')}
      </Text>
    </View>
  );
}