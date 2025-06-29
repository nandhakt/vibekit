import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { useAppContext } from '@/contexts/AppContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useSubscriptionStatus } from '@/hooks/usePurchases';
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  Star, 
  CreditCard, 
  Lock, 
  Share2, 
  User 
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';
import InAppReview from 'react-native-in-app-review';
import PaywallModal from '@/components/PaywallModal';

function HomeScreen() {
  const { t } = useTranslation();
  const { colors, typography, spacing, isDarkMode } = useTheme();
  const { appOpenCount } = useAppContext();
  const { profile } = useProfile();
  const { isSubscribed, isLoading: subscriptionLoading, refreshSubscriptionStatus } = useSubscriptionStatus();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  const handleInAppReview = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        t('home.reviewApp'),
        t('home.reviewUnavailable'),
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsReviewLoading(true);
      
      // Check if in-app review is available
      const isAvailable = InAppReview.isAvailable();
      
      if (isAvailable) {
        // Request the in-app review
        InAppReview.RequestInAppReview()
          .then((hasFlowFinishedSuccessfully) => {
            if (hasFlowFinishedSuccessfully) {
              // The flow has finished. The API does not indicate whether the user
              // reviewed or not, or even whether the review dialog was shown.
              console.log('InAppReview flow finished');
            }
          })
          .catch((error) => {
            console.log('InAppReview error:', error);
            Alert.alert(
              t('home.reviewApp'),
              t('home.reviewError'),
              [{ text: 'OK' }]
            );
          });
      } else {
        Alert.alert(
          t('home.reviewApp'),
          t('home.reviewUnavailable'),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Review error:', error);
      Alert.alert(
        t('home.reviewApp'),
        t('home.reviewError'),
        [{ text: 'OK' }]
      );
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleShareApp = async () => {
    if (Platform.OS === 'web') {
      // Web fallback using Web Share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Check this out!',
            text: 'Hey, Check out VibeKit.',
            url: 'https://vibekit.app'
          });
          Toast.show({
            type: 'success',
            text1: t('home.shareApp.shareSuccess'),
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 60,
          });
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            Toast.show({
              type: 'error',
              text1: t('home.shareApp.shareError'),
              position: 'top',
              visibilityTime: 3000,
              autoHide: true,
              topOffset: 60,
            });
          }
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        try {
          await navigator.clipboard.writeText('Hey, Check out VibeKit. https://vibekit.app');
          Toast.show({
            type: 'success',
            text1: 'Link copied to clipboard!',
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 60,
          });
        } catch (error) {
          Alert.alert(
            t('home.shareApp.title'),
            t('home.shareApp.shareUnavailable'),
            [{ text: 'OK' }]
          );
        }
      }
      return;
    }

    if (!Share) {
      Alert.alert(
        t('home.shareApp.title'),
        t('home.shareApp.shareUnavailable'),
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsShareLoading(true);
      
      const shareOptions = {
        title: 'Check this out!',
        message: 'Hey, Check out VibeKit.',
        url: 'https://vibekit.app',
      };

      const result = await Share.open(shareOptions);
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: t('home.shareApp.shareSuccess'),
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 60,
        });
      }
    } catch (error) {
      // User cancelled the share or an error occurred
      if (error instanceof Error && error.message !== 'User did not share') {
        Toast.show({
          type: 'error',
          text1: t('home.shareApp.shareError'),
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 60,
        });
      }
    } finally {
      setIsShareLoading(false);
    }
  };

  const showSuccessToast = () => {
    Toast.show({
      type: 'success',
      text1: t('home.toastMessages.success.title'),
      text2: t('home.toastMessages.success.message'),
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: 'error',
      text1: t('home.toastMessages.error.title'),
      text2: t('home.toastMessages.error.message'),
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });
  };

  const showInfoToast = () => {
    Toast.show({
      type: 'info',
      text1: t('home.toastMessages.info.title'),
      text2: t('home.toastMessages.info.message'),
      position: 'top',
      visibilityTime: 3500,
      autoHide: true,
      topOffset: 60,
    });
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleShowPaywall = () => {
    setPaywallVisible(true);
  };

  const handlePaywallClose = () => {
    setPaywallVisible(false);
  };

  const handlePurchaseComplete = () => {
    refreshSubscriptionStatus();
    Toast.show({
      type: 'success',
      text1: t('revenuecat.purchaseSuccessTitle'),
      text2: t('revenuecat.purchaseSuccessMessage'),
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: spacing.lg,
      paddingBottom: spacing.sm,
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      ...typography.h1,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      opacity: 0.7,
    },
    profileButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    profileImage: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    content: {
      padding: spacing.lg,
      paddingTop: 0,
    },
    appOpenContainer: {
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: 12,
      marginBottom: spacing.lg,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: isDarkMode ? 0 : 0.5,
      borderColor: isDarkMode ? 'transparent' : colors.border,
    },
    appOpenContent: {
      alignItems: 'center',
    },
    appOpenText: {
      ...typography.bodyLarge,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    appOpenCount: {
      ...typography.h2,
      color: colors.primary,
      fontWeight: '700',
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    subscriptionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success + '15',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 8,
      marginTop: spacing.sm,
      gap: spacing.xs,
    },
    subscriptionBadgeText: {
      ...typography.caption,
      color: colors.success,
      fontWeight: '600',
    },
    reviewCard: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: 12,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: isDarkMode ? 0 : 0.5,
      borderColor: isDarkMode ? 'transparent' : colors.border,
    },
    toastCard: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: 12,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: isDarkMode ? 0 : 0.5,
      borderColor: isDarkMode ? 'transparent' : colors.border,
    },

    revenuecatCard: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: 12,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: isDarkMode ? 0 : 0.5,
      borderColor: isDarkMode ? 'transparent' : colors.border,
    },
    shareCard: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: 12,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: isDarkMode ? 0 : 0.5,
      borderColor: isDarkMode ? 'transparent' : colors.border,
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    toastHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },

    revenuecatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    shareHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    reviewIcon: {
      marginRight: spacing.sm,
    },
    toastIcon: {
      marginRight: spacing.sm,
    },

    revenuecatIcon: {
      marginRight: spacing.sm,
    },
    shareIcon: {
      marginRight: spacing.sm,
    },
    cardTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    cardContent: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: typography.body.lineHeight,
    },
    reviewButton: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      marginTop: spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    reviewButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.6,
    },
    reviewButtonText: {
      ...typography.body,
      color: colors.background,
      fontWeight: '600',
    },
    toastButtonsContainer: {
      marginTop: spacing.md,
      gap: spacing.sm,
    },
    toastButton: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
      borderWidth: 1,
    },
    successButton: {
      backgroundColor: colors.success + '15',
      borderColor: colors.success,
    },
    errorButton: {
      backgroundColor: colors.danger + '15',
      borderColor: colors.danger,
    },
    infoButton: {
      backgroundColor: colors.primary + '15',
      borderColor: colors.primary,
    },
    toastButtonText: {
      ...typography.body,
      fontWeight: '600',
    },
    successButtonText: {
      color: colors.success,
    },
    errorButtonText: {
      color: colors.danger,
    },
    infoButtonText: {
      color: colors.primary,
    },

    revenuecatButton: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      marginTop: spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    revenuecatButtonText: {
      ...typography.body,
      color: colors.background,
      fontWeight: '600',
    },
    shareButton: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      marginTop: spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    shareButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.6,
    },
    shareButtonText: {
      ...typography.body,
      color: colors.background,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>
            {t('home.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('home.subtitle')}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}
          activeOpacity={0.7}
        >
          {profile.profilePicture ? (
            <Image
              source={{ uri: profile.profilePicture }}
              style={styles.profileImage}
            />
          ) : (
            <User size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.appOpenContainer}>
          <View style={styles.appOpenContent}>
            <Text style={styles.appOpenText}>
              {t('home.appOpen')}
            </Text>
            <Text style={styles.appOpenCount}>
              {appOpenCount}
            </Text>
          </View>
          {!subscriptionLoading && isSubscribed && (
            <View style={styles.subscriptionBadge}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.subscriptionBadgeText}>
                {t('revenuecat.subscribedBadge')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.toastCard}>
          <View style={styles.toastHeader}>
            <View style={styles.toastIcon}>
              <Info size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>
                {t('home.toastNotifications')}
              </Text>
            </View>
          </View>
          <Text style={styles.cardContent}>
            {t('home.toastNotificationsDescription')}
          </Text>
          <View style={styles.toastButtonsContainer}>
            <TouchableOpacity
              style={[styles.toastButton, styles.successButton]}
              onPress={showSuccessToast}
              activeOpacity={0.8}
            >
              <CheckCircle size={20} color={colors.success} />
              <Text style={[styles.toastButtonText, styles.successButtonText]}>
                {t('home.showSuccessToast')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toastButton, styles.errorButton]}
              onPress={showErrorToast}
              activeOpacity={0.8}
            >
              <XCircle size={20} color={colors.danger} />
              <Text style={[styles.toastButtonText, styles.errorButtonText]}>
                {t('home.showErrorToast')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toastButton, styles.infoButton]}
              onPress={showInfoToast}
              activeOpacity={0.8}
            >
              <Info size={20} color={colors.primary} />
              <Text style={[styles.toastButtonText, styles.infoButtonText]}>
                {t('home.showInfoToast')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewIcon}>
              <Star size={24} color={colors.primary} fill={colors.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>
                {t('home.reviewApp')}
              </Text>
            </View>
          </View>
          <Text style={styles.cardContent}>
            {t('home.reviewAppDescription')}
          </Text>
          <TouchableOpacity
            style={[
              styles.reviewButton,
              isReviewLoading && styles.reviewButtonDisabled
            ]}
            onPress={handleInAppReview}
            disabled={isReviewLoading}
            activeOpacity={0.8}
          >
            <Star size={20} color={colors.background} />
            <Text style={styles.reviewButtonText}>
              {t('home.reviewButton')}
            </Text>
          </TouchableOpacity>
        </View>



        <View style={styles.revenuecatCard}>
          <View style={styles.revenuecatHeader}>
            <View style={styles.revenuecatIcon}>
              <CreditCard size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>
                {t('revenuecat.title')}
              </Text>
            </View>
          </View>
          <Text style={styles.cardContent}>
            {t('revenuecat.description')}
          </Text>
          <TouchableOpacity
            style={styles.revenuecatButton}
            onPress={handleShowPaywall}
            activeOpacity={0.8}
          >
            {isSubscribed ? (
              <CheckCircle size={20} color={colors.background} />
            ) : (
              <Lock size={20} color={colors.background} />
            )}
            <Text style={styles.revenuecatButtonText}>
              {isSubscribed ? t('revenuecat.manageSubscription') : t('revenuecat.showPaywall')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shareCard}>
          <View style={styles.shareHeader}>
            <View style={styles.shareIcon}>
              <Share2 size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>
                {t('home.shareApp.title')}
              </Text>
            </View>
          </View>
          <Text style={styles.cardContent}>
            {t('home.shareApp.description')}
          </Text>
          <TouchableOpacity
            style={[
              styles.shareButton,
              isShareLoading && styles.shareButtonDisabled
            ]}
            onPress={handleShareApp}
            disabled={isShareLoading}
            activeOpacity={0.8}
          >
            <Share2 size={20} color={colors.background} />
            <Text style={styles.shareButtonText}>
              {t('home.shareApp.shareButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PaywallModal
        visible={paywallVisible}
        onClose={handlePaywallClose}
        onPurchaseComplete={handlePurchaseComplete}
      />
    </SafeAreaView>
  );
}

// Export the component directly without HOC wrapper
export default HomeScreen;