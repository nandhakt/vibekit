import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Check, X } from 'lucide-react-native';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

export default function SettingsModal({
  visible,
  onClose,
  title,
  subtitle,
  children,
}: SettingsModalProps) {
  const { colors, typography, spacing } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      // Delay unmounting to allow animation to complete
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    setIsAnimating(false);
    // Small delay before calling onClose to prevent flash
    setTimeout(() => {
      onClose();
    }, 50);
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalContainer: {
      width: Math.min(width - (spacing.lg * 2), 400),
      maxHeight: height * 0.8,
      backgroundColor: colors.background,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 20,
      overflow: 'hidden',
      zIndex: 1000,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    headerContent: {
      flex: 1,
      marginRight: spacing.md,
    },
    title: {
      ...typography.h3,
      color: colors.text,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textSecondary,
      opacity: 0.8,
      lineHeight: typography.caption.lineHeight,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      backgroundColor: colors.background,
      maxHeight: height * 0.6,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingTop: spacing.md,
    },
  });

  // Don't render anything if modal shouldn't be shown
  if (!shouldRender) {
    return null;
  }

  return (
    <Modal
      visible={visible && isAnimating}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={Platform.OS === 'android'}
      presentationStyle="overFullScreen"
      hardwareAccelerated={true}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>
                {title}
              </Text>
              {subtitle && (
                <Text style={styles.subtitle}>
                  {subtitle}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={true}
              scrollEventThrottle={16}
            >
              {children}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface OptionItemProps {
  label: string;
  description?: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  preview?: React.ReactNode;
}

export function OptionItem({
  label,
  description,
  isSelected,
  onPress,
  icon,
  preview,
}: OptionItemProps) {
  const { colors, typography, spacing, isDarkMode } = useTheme();

  const handlePress = () => {
    // Add small delay to prevent flash effect when closing modal
    setTimeout(() => {
      onPress();
    }, 100);
  };

  const styles = StyleSheet.create({
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      borderRadius: 12,
      marginBottom: spacing.sm,
      borderWidth: isDarkMode ? 2 : 1,
      backgroundColor: isSelected ? colors.primary + '15' : colors.card,
      borderColor: isSelected ? colors.primary : colors.border,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      ...typography.body,
      color: colors.text,
      fontWeight: '600',
      marginBottom: 2,
    },
    optionDescription: {
      ...typography.caption,
      color: colors.textSecondary,
      opacity: 0.8,
      lineHeight: typography.caption.lineHeight,
    },
    optionPreview: {
      marginTop: spacing.sm,
    },
    checkContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: spacing.sm,
    },
  });

  return (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.optionLeft}>
        {icon && (
          <View style={styles.optionIcon}>
            {icon}
          </View>
        )}
        <View style={styles.optionContent}>
          <Text style={styles.optionLabel}>
            {label}
          </Text>
          {description && (
            <Text style={styles.optionDescription}>
              {description}
            </Text>
          )}
          {preview && (
            <View style={styles.optionPreview}>
              {preview}
            </View>
          )}
        </View>
      </View>
      
      {isSelected && (
        <View style={styles.checkContainer}>
          <Check size={16} color={colors.background} />
        </View>
      )}
    </TouchableOpacity>
  );
}