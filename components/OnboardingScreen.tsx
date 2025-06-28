import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { ChevronRight, ArrowRight } from 'lucide-react-native';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: t('onboarding.page1.title'),
      description: t('onboarding.page1.description'),
      icon: '🎉',
    },
    {
      title: t('onboarding.page2.title'),
      description: t('onboarding.page2.description'),
      icon: '🤝',
    },
    {
      title: t('onboarding.page3.title'),
      description: t('onboarding.page3.description'),
      icon: '🚀',
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: spacing.lg,
      paddingTop: 60,
    },
    skipButton: {
      padding: spacing.sm,
    },
    skipText: {
      ...typography.body,
      opacity: 0.7,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xxl,
    },
    iconContainer: {
      marginBottom: spacing.xxl,
    },
    icon: {
      fontSize: 80,
    },
    title: {
      ...typography.h2,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    description: {
      ...typography.body,
      textAlign: 'center',
      lineHeight: typography.body.lineHeight,
      opacity: 0.8,
    },
    footer: {
      padding: spacing.xxl,
      paddingBottom: 60,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: spacing.xxl,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    nextButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: 12,
      gap: spacing.sm,
    },
    nextText: {
      ...typography.body,
      fontWeight: '600',
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>
            {t('onboarding.skip')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{pages[currentPage].icon}</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {pages[currentPage].title}
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {pages[currentPage].description}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentPage ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={[styles.nextText, { color: colors.background }]}>
            {currentPage === pages.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
          </Text>
          {currentPage === pages.length - 1 ? (
            <ArrowRight size={20} color={colors.background} />
          ) : (
            <ChevronRight size={20} color={colors.background} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}