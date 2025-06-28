import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { useAppContext } from '@/contexts/AppContext';
import { 
  User, 
  Globe, 
  Moon, 
  Type, 
  CircleHelp as HelpCircle, 
  FileText, 
  Shield, 
  ChevronRight,
  Sun,
  Smartphone
} from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import SettingsModal, { OptionItem } from '@/components/SettingsModal';
import { Language, Theme, TextSize } from '@/contexts/AppContext';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { colors, typography, spacing, isDarkMode } = useTheme();
  const { theme, textSize, language, setTheme, setTextSize, setLanguage } = useAppContext();
  
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [textSizeModalVisible, setTextSizeModalVisible] = useState(false);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: t('settings.languages.en'), nativeName: 'English' },
    { code: 'es', name: t('settings.languages.es'), nativeName: 'Español' },
    { code: 'fr', name: t('settings.languages.fr'), nativeName: 'Français' },
  ];

  const themes: { code: Theme; name: string; description: string; icon: any }[] = [
    { 
      code: 'light', 
      name: t('settings.themes.light'), 
      description: t('settings.themeDescriptions.light'),
      icon: Sun
    },
    { 
      code: 'dark', 
      name: t('settings.themes.dark'), 
      description: t('settings.themeDescriptions.dark'),
      icon: Moon
    },
    { 
      code: 'system', 
      name: t('settings.themes.system'), 
      description: t('settings.themeDescriptions.system'),
      icon: Smartphone
    },
  ];

  const textSizes: { code: TextSize; name: string; description: string; multiplier: number }[] = [
    { 
      code: 'small', 
      name: t('settings.textSize.small'), 
      description: t('settings.textSizeDescriptions.small'),
      multiplier: 0.85
    },
    { 
      code: 'normal', 
      name: t('settings.textSize.normal'), 
      description: t('settings.textSizeDescriptions.normal'),
      multiplier: 1
    },
    { 
      code: 'large', 
      name: t('settings.textSize.large'), 
      description: t('settings.textSizeDescriptions.large'),
      multiplier: 1.15
    },
    { 
      code: 'extralarge', 
      name: t('settings.textSize.extralarge'), 
      description: t('settings.textSizeDescriptions.extralarge'),
      multiplier: 1.3
    },
  ];

  const handleLanguageSelect = async (selectedLanguage: Language) => {
    await setLanguage(selectedLanguage);
    setLanguageModalVisible(false);
  };

  const handleThemeSelect = async (selectedTheme: Theme) => {
    await setTheme(selectedTheme);
    setThemeModalVisible(false);
  };

  const handleTextSizeSelect = async (selectedSize: TextSize) => {
    await setTextSize(selectedSize);
    setTextSizeModalVisible(false);
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleExternalLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open link');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: spacing.lg,
      paddingBottom: spacing.sm,
    },
    title: {
      ...typography.h1,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    section: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.card,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: isDarkMode ? 0 : 0.5,
      borderColor: isDarkMode ? 'transparent' : colors.border,
    },
    sectionTitle: {
      ...typography.caption,
      color: colors.textSecondary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      backgroundColor: colors.card,
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingsItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
      backgroundColor: colors.surface,
    },
    settingsTitle: {
      ...typography.body,
      color: colors.text,
      fontWeight: '500',
      marginBottom: 2,
    },
    settingsSubtitle: {
      ...typography.caption,
      color: colors.textSecondary,
      opacity: 0.7,
      marginTop: 2,
    },
  });

  const SettingsItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
    rightComponent,
    isLast = false,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightComponent?: React.ReactNode;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingsItem, 
        { 
          borderBottomColor: colors.border,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
        }
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.settingsTitle}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingsSubtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightComponent}
        {showChevron && <ChevronRight size={16} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('settings.title')}
          </Text>
        </View>

        <View style={styles.section}>
          <SettingsItem
            icon={User}
            title={t('settings.profile.title')}
            subtitle={t('settings.profile.subtitle')}
            onPress={handleProfilePress}
            isLast={true}
          />
        </View>

        <View style={styles.section}>
          <SettingsItem
            icon={Globe}
            title={t('settings.language.title')}
            subtitle={`${t('settings.languages.' + language)}`}
            onPress={() => setLanguageModalVisible(true)}
          />
          <SettingsItem
            icon={Moon}
            title={t('settings.darkMode.title')}
            subtitle={t('settings.themes.' + theme)}
            onPress={() => setThemeModalVisible(true)}
          />
          <SettingsItem
            icon={Type}
            title={t('settings.textSize.title')}
            subtitle={t('settings.textSize.' + textSize)}
            onPress={() => setTextSizeModalVisible(true)}
            isLast={true}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.links.title')}
          </Text>
          <SettingsItem
            icon={HelpCircle}
            title={t('settings.links.faqs')}
            onPress={() => handleExternalLink('https://example.com/faq')}
          />
          <SettingsItem
            icon={FileText}
            title={t('settings.links.terms')}
            onPress={() => handleExternalLink('https://example.com/terms')}
          />
          <SettingsItem
            icon={Shield}
            title={t('settings.links.privacy')}
            onPress={() => handleExternalLink('https://example.com/privacy')}
            isLast={true}
          />
        </View>
      </ScrollView>

      {/* Language Modal */}
      <SettingsModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title={t('settings.language.title')}
        subtitle={t('settings.language.subtitle')}
      >
        {languages.map((lang) => (
          <OptionItem
            key={lang.code}
            label={lang.name}
            description={lang.nativeName}
            isSelected={language === lang.code}
            onPress={() => handleLanguageSelect(lang.code)}
            icon={<Globe size={20} color={colors.primary} />}
          />
        ))}
      </SettingsModal>

      {/* Theme Modal */}
      <SettingsModal
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        title={t('settings.darkMode.title')}
        subtitle={t('settings.darkMode.subtitle')}
      >
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          return (
            <OptionItem
              key={themeOption.code}
              label={themeOption.name}
              description={themeOption.description}
              isSelected={theme === themeOption.code}
              onPress={() => handleThemeSelect(themeOption.code)}
              icon={<IconComponent size={20} color={colors.primary} />}
            />
          );
        })}
      </SettingsModal>

      {/* Text Size Modal */}
      <SettingsModal
        visible={textSizeModalVisible}
        onClose={() => setTextSizeModalVisible(false)}
        title={t('settings.textSize.title')}
        subtitle={t('settings.textSize.subtitle')}
      >
        {textSizes.map((size) => (
          <OptionItem
            key={size.code}
            label={size.name}
            description={size.description}
            isSelected={textSize === size.code}
            onPress={() => handleTextSizeSelect(size.code)}
            icon={<Type size={20} color={colors.primary} />}
            preview={
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16 * size.multiplier,
                  lineHeight: 24 * size.multiplier,
                  fontStyle: 'italic',
                  opacity: 0.8,
                  marginTop: spacing.xs,
                }}
              >
                {t('settings.textSizePreview')}
              </Text>
            }
          />
        ))}
      </SettingsModal>
    </SafeAreaView>
  );
}