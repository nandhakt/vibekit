import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';

interface WalkthroughButtonProps {
  onPress: () => void;
}

export default function WalkthroughButton({ onPress }: WalkthroughButtonProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      ...typography.body,
      color: colors.background,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Play size={20} color={colors.background} />
      <Text style={styles.buttonText}>
        {t('home.walkthrough.startTutorial')}
      </Text>
    </TouchableOpacity>
  );
}