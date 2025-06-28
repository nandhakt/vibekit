import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { useProfile } from '@/contexts/ProfileContext';
import { useSubscriptionStatus } from '@/hooks/usePurchases';
import { ArrowLeft, PenLine, Save, X, Camera, User, Mail, FileText, Calendar, Settings, Trash2, Image as ImageIcon, Crown, Shield } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_AVATARS = [
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors, typography, spacing, isDarkMode } = useTheme();
  const { profile, updateProfile } = useProfile();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscriptionStatus();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSave = async () => {
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
      Toast.show({
        type: 'success',
        text1: t('profile.profileUpdated'),
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('profile.profileUpdateError'),
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.deleteAccount'),
      t('profile.confirmDeleteAccount'),
      [
        {
          text: t('profile.deleteAccountCancel'),
          style: 'cancel',
        },
        {
          text: t('profile.deleteAccountConfirm'),
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert('Account deletion would be processed here');
          },
        },
      ]
    );
  };

  const selectAvatar = (avatarUrl: string) => {
    setEditedProfile({ ...editedProfile, profilePicture: avatarUrl });
    setShowAvatarPicker(false);
  };

  const removeAvatar = () => {
    setEditedProfile({ ...editedProfile, profilePicture: null });
    setShowAvatarPicker(false);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'web') {
      Toast.show({
        type: 'info',
        text1: t('profile.cameraNotAvailable'),
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
      return false;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('profile.permissionRequired'),
        t('profile.cameraPermissionMessage'),
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need explicit permission for file picker
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('profile.permissionRequired'),
        t('profile.photoLibraryPermissionMessage'),
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setEditedProfile({ ...editedProfile, profilePicture: result.assets[0].uri });
        setShowAvatarPicker(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('profile.photoError'),
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
    }
  };

  const pickFromLibrary = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setEditedProfile({ ...editedProfile, profilePicture: result.assets[0].uri });
        setShowAvatarPicker(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('profile.photoError'),
        position: 'top',
        visibilityTime: 3000,
        topOffset: 60,
      });
    }
  };

  const showPhotoSourceOptions = () => {
    Alert.alert(
      t('profile.selectPhotoSource'),
      t('profile.choosePhotoSource'),
      [
        {
          text: t('profile.camera'),
          onPress: takePhoto,
        },
        {
          text: t('profile.photoLibrary'),
          onPress: pickFromLibrary,
        },
        {
          text: t('profile.defaultPhotos'),
          onPress: () => setShowAvatarPicker(true),
        },
        {
          text: t('profile.cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
      paddingTop: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      padding: spacing.sm,
      marginRight: spacing.sm,
    },
    headerTitle: {
      ...typography.h3,
      color: colors.text,
      fontWeight: '600',
    },
    headerRight: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    actionButton: {
      padding: spacing.sm,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: spacing.xxl,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: spacing.md,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.primary,
    },
    avatarImage: {
      width: 114,
      height: 114,
      borderRadius: 57,
    },
    avatarEditButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.background,
    },
    displayName: {
      ...typography.h2,
      color: colors.text,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    memberSince: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    subscriptionStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 12,
      marginTop: spacing.md,
      gap: spacing.sm,
    },
    subscribedStatus: {
      backgroundColor: colors.success + '15',
    },
    notSubscribedStatus: {
      backgroundColor: colors.textSecondary + '15',
    },
    subscriptionStatusText: {
      ...typography.body,
      fontWeight: '600',
    },
    subscribedText: {
      color: colors.success,
    },
    notSubscribedText: {
      color: colors.textSecondary,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      fontWeight: '600',
      marginBottom: spacing.md,
    },
    inputGroup: {
      marginBottom: spacing.md,
    },
    inputLabel: {
      ...typography.body,
      color: colors.text,
      fontWeight: '500',
      marginBottom: spacing.xs,
    },
    input: {
      ...typography.body,
      color: colors.text,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 48,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    infoText: {
      ...typography.body,
      color: colors.text,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 48,
      textAlignVertical: 'center',
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: spacing.sm,
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingsIcon: {
      marginRight: spacing.sm,
    },
    settingsText: {
      ...typography.body,
      color: colors.text,
      fontWeight: '500',
    },
    dangerItem: {
      backgroundColor: colors.danger + '15',
    },
    dangerText: {
      color: colors.danger,
    },
    avatarPickerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    avatarPickerContainer: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: spacing.lg,
      margin: spacing.lg,
      maxWidth: 400,
      width: '90%',
    },
    avatarPickerTitle: {
      ...typography.h3,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    avatarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    avatarOption: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: spacing.md,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    avatarOptionSelected: {
      borderColor: colors.primary,
    },
    avatarPickerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    avatarPickerButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: 12,
      alignItems: 'center',
    },
    removeButton: {
      backgroundColor: colors.danger + '15',
    },
    cancelButton: {
      backgroundColor: colors.surface,
    },
    removeButtonText: {
      ...typography.body,
      color: colors.danger,
      fontWeight: '600',
    },
    cancelButtonText: {
      ...typography.body,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    customPhotoSection: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
      marginTop: spacing.md,
    },
    customPhotoTitle: {
      ...typography.body,
      color: colors.text,
      fontWeight: '600',
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    customPhotoButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    customPhotoButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: 12,
      backgroundColor: colors.primary + '15',
      borderWidth: 1,
      borderColor: colors.primary,
      gap: spacing.xs,
    },
    customPhotoButtonText: {
      ...typography.body,
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? t('profile.editingProfile') : t('profile.viewingProfile')}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Save size={20} color={colors.background} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.7}
            >
              <PenLine size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {(isEditing ? editedProfile.profilePicture : profile.profilePicture) ? (
                <Image
                  source={{ uri: isEditing ? editedProfile.profilePicture! : profile.profilePicture! }}
                  style={styles.avatarImage}
                />
              ) : (
                <User size={48} color={colors.textSecondary} />
              )}
            </View>
            {isEditing && (
              <TouchableOpacity
                style={styles.avatarEditButton}
                onPress={showPhotoSourceOptions}
                activeOpacity={0.7}
              >
                <Camera size={18} color={colors.background} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.displayName}>
            {(isEditing ? editedProfile.displayName : profile.displayName) || 'User'}
          </Text>
          <Text style={styles.memberSince}>
            {t('profile.memberSince')} {formatDate(profile.joinDate)}
          </Text>
          
          {!subscriptionLoading && (
            <View style={[
              styles.subscriptionStatus,
              isSubscribed ? styles.subscribedStatus : styles.notSubscribedStatus
            ]}>
              {isSubscribed ? (
                <Crown size={20} color={colors.success} />
              ) : (
                <Shield size={20} color={colors.textSecondary} />
              )}
              <Text style={[
                styles.subscriptionStatusText,
                isSubscribed ? styles.subscribedText : styles.notSubscribedText
              ]}>
                {isSubscribed ? t('revenuecat.subscribed') : t('revenuecat.notSubscribed')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.personalInfo')}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('profile.displayName')}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedProfile.displayName}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, displayName: text })}
                placeholder={t('profile.displayNamePlaceholder')}
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoText}>{profile.displayName || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('profile.email')}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedProfile.email}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
                placeholder={t('profile.emailPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.infoText}>{profile.email || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('profile.bio')}</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.bio}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                placeholder={t('profile.bioPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={[styles.infoText, { minHeight: 100 }]}>
                {profile.bio || 'No bio added yet'}
              </Text>
            )}
          </View>
        </View>

        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('profile.accountSettings')}</Text>
            
            <TouchableOpacity
              style={[styles.settingsItem, styles.dangerItem]}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.settingsItemLeft}>
                <Trash2 size={20} color={colors.danger} style={styles.settingsIcon} />
                <Text style={[styles.settingsText, styles.dangerText]}>
                  {t('profile.deleteAccount')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {showAvatarPicker && (
        <View style={styles.avatarPickerOverlay}>
          <View style={styles.avatarPickerContainer}>
            <Text style={styles.avatarPickerTitle}>{t('profile.defaultPhotos')}</Text>
            
            <View style={styles.customPhotoSection}>
              <Text style={styles.customPhotoTitle}>{t('profile.customPhoto')}</Text>
              <View style={styles.customPhotoButtons}>
                <TouchableOpacity
                  style={styles.customPhotoButton}
                  onPress={() => {
                    setShowAvatarPicker(false);
                    setTimeout(takePhoto, 100);
                  }}
                  activeOpacity={0.7}
                >
                  <Camera size={18} color={colors.primary} />
                  <Text style={styles.customPhotoButtonText}>{t('profile.camera')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.customPhotoButton}
                  onPress={() => {
                    setShowAvatarPicker(false);
                    setTimeout(pickFromLibrary, 100);
                  }}
                  activeOpacity={0.7}
                >
                  <ImageIcon size={18} color={colors.primary} />
                  <Text style={styles.customPhotoButtonText}>{t('profile.photoLibrary')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.avatarGrid}>
              {DEFAULT_AVATARS.map((avatarUrl, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectAvatar(avatarUrl)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: avatarUrl }}
                    style={[
                      styles.avatarOption,
                      editedProfile.profilePicture === avatarUrl && styles.avatarOptionSelected,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.avatarPickerActions}>
              <TouchableOpacity
                style={[styles.avatarPickerButton, styles.removeButton]}
                onPress={removeAvatar}
                activeOpacity={0.7}
              >
                <Text style={styles.removeButtonText}>{t('profile.removePhoto')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.avatarPickerButton, styles.cancelButton]}
                onPress={() => setShowAvatarPicker(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{t('profile.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}