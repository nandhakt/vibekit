import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseComplete?: () => void;
}

// Mock Paywall component for web and fallback
const MockPaywall = ({ onClose }: { onClose: () => void }) => {
  const { colors, typography, spacing } = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    mockContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.background,
    },
    mockTitle: {
      ...typography.h2,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    mockDescription: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    mockButton: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: 12,
      marginBottom: spacing.md,
    },
    mockButtonText: {
      ...typography.body,
      color: colors.background,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.mockContainer}>
      <Text style={styles.mockTitle}>
        {t('revenuecat.mockPaywallTitle')}
      </Text>
      <Text style={styles.mockDescription}>
        {t('revenuecat.mockPaywallDescription')}
      </Text>
      <TouchableOpacity
        style={styles.mockButton}
        onPress={() => {
          Alert.alert(
            t('revenuecat.mockPurchaseTitle'),
            t('revenuecat.mockPurchaseMessage'),
            [{ text: 'OK', onPress: onClose }]
          );
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.mockButtonText}>
          {t('revenuecat.mockPurchaseButton')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Conditionally import and use Paywall for native platforms
const PaywallComponent = Platform.OS === 'web' ? MockPaywall : (() => {
  try {
    const PaywallModule = require('react-native-purchases-ui');
    return PaywallModule.Paywall || MockPaywall;
  } catch (error) {
    console.warn('react-native-purchases-ui not available:', error);
    return MockPaywall;
  }
})();

export default function PaywallModal({ 
  visible, 
  onClose, 
  onPurchaseComplete 
}: PaywallModalProps) {
  const { colors, typography, spacing } = useTheme();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchaseCompleted = () => {
    setIsLoading(false);
    onPurchaseComplete?.();
    onClose();
  };

  const handlePurchaseError = (error: any) => {
    setIsLoading(false);
    console.error('Purchase error:', error);
    Alert.alert(
      t('revenuecat.purchaseErrorTitle'),
      t('revenuecat.purchaseErrorMessage'),
      [{ text: 'OK' }]
    );
  };

  const handlePurchaseStarted = () => {
    setIsLoading(true);
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
      paddingTop: 60,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      ...typography.h3,
      color: colors.text,
      fontWeight: '600',
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    paywallContainer: {
      flex: 1,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {t('revenuecat.paywallTitle')}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.paywallContainer}>
          {Platform.OS === 'web' ? (
            <MockPaywall onClose={onClose} />
          ) : (
            <PaywallComponent
              offering="default"
              onPurchaseCompleted={handlePurchaseCompleted}
              onPurchaseError={handlePurchaseError}
              onPurchaseStarted={handlePurchaseStarted}
              onRestoreCompleted={handlePurchaseCompleted}
              onRestoreError={handlePurchaseError}
              onRestoreStarted={handlePurchaseStarted}
              onClose={onClose}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}