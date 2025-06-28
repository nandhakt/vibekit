import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Mock types for web compatibility
interface CustomerInfo {
  entitlements: {
    active: Record<string, any>;
  };
}

interface PurchasesStatic {
  configure: (config: { apiKey: string; appUserID?: string }) => void;
  getCustomerInfo: () => Promise<CustomerInfo>;
  setLogLevel: (level: string) => void;
}

// Mock Purchases object for web
const MockPurchases: PurchasesStatic = {
  configure: () => console.log('Purchases.configure called (web mock)'),
  getCustomerInfo: async () => ({
    entitlements: { active: {} }
  }),
  setLogLevel: () => console.log('Purchases.setLogLevel called (web mock)')
};

// Conditionally import Purchases for native platforms
let Purchases: PurchasesStatic = MockPurchases;

if (Platform.OS !== 'web') {
  try {
    const PurchasesModule = require('react-native-purchases');
    Purchases = PurchasesModule.default || PurchasesModule;
  } catch (error) {
    console.warn('react-native-purchases not available:', error);
  }
}

export const initializePurchases = () => {
  useEffect(() => {
    if (Platform.OS === 'web') {
      console.log('RevenueCat initialization skipped on web platform');
      return;
    }

    try {
      // Configure RevenueCat
      // Replace with your actual RevenueCat API keys
      const apiKey = Platform.select({
        ios: 'appl_YOUR_IOS_API_KEY_HERE',
        android: 'goog_YOUR_ANDROID_API_KEY_HERE',
      });

      if (apiKey) {
        Purchases.configure({ apiKey });
        
        // Set log level for debugging (remove in production)
        if (__DEV__) {
          Purchases.setLogLevel('DEBUG');
        }
        
        console.log('RevenueCat initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
    }
  }, []);
};

export const useSubscriptionStatus = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (Platform.OS === 'web') {
      setIsLoading(false);
      return;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      
      // Check if user has any active entitlements
      const hasActiveEntitlements = Object.keys(customerInfo.entitlements.active).length > 0;
      
      setIsSubscribed(hasActiveEntitlements);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscriptionStatus = () => {
    setIsLoading(true);
    checkSubscriptionStatus();
  };

  return {
    isSubscribed,
    isLoading,
    refreshSubscriptionStatus
  };
};