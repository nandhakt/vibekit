import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  bio: string;
  profilePicture: string | null;
  joinDate: string;
  lastUpdated: string;
}

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetProfile: () => Promise<void>;
  isLoading: boolean;
}

const defaultProfile: UserProfile = {
  id: 'user_001',
  displayName: '',
  email: '',
  bio: '',
  profilePicture: null,
  joinDate: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
      } else {
        // Set join date for new users
        const newProfile = {
          ...defaultProfile,
          joinDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        setProfile(newProfile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = {
        ...profile,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      setProfile(updatedProfile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const resetProfile = async () => {
    try {
      const newProfile = {
        ...defaultProfile,
        joinDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      setProfile(newProfile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
    } catch (error) {
      console.error('Error resetting profile:', error);
      throw error;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        isLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}