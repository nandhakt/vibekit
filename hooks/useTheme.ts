import { useAppContext } from '@/contexts/AppContext';

export const useTheme = () => {
  const { isDarkMode, textSize } = useAppContext();

  const getTextSizeMultiplier = () => {
    switch (textSize) {
      case 'small': return 0.85;
      case 'normal': return 1;
      case 'large': return 1.15;
      case 'extralarge': return 1.3;
      default: return 1;
    }
  };

  const getSpacingMultiplier = () => {
    switch (textSize) {
      case 'small': return 0.9;
      case 'normal': return 1;
      case 'large': return 1.1;
      case 'extralarge': return 1.25;
      default: return 1;
    }
  };

  const colors = {
    primary: isDarkMode ? '#007AFF' : '#007AFF',
    background: isDarkMode ? '#000000' : '#FFFFFF',
    surface: isDarkMode ? '#1C1C1E' : '#F2F2F7',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#8E8E93' : '#6D6D80',
    border: isDarkMode ? '#38383A' : '#E5E5E7',
    card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    danger: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  };

  const textMultiplier = getTextSizeMultiplier();
  const spaceMultiplier = getSpacingMultiplier();

  const typography = {
    h1: { 
      fontSize: 32 * textMultiplier, 
      fontWeight: '700' as const,
      lineHeight: 40 * textMultiplier,
      marginBottom: 8 * spaceMultiplier,
    },
    h2: { 
      fontSize: 28 * textMultiplier, 
      fontWeight: '600' as const,
      lineHeight: 36 * textMultiplier,
      marginBottom: 6 * spaceMultiplier,
    },
    h3: { 
      fontSize: 24 * textMultiplier, 
      fontWeight: '600' as const,
      lineHeight: 32 * textMultiplier,
      marginBottom: 4 * spaceMultiplier,
    },
    body: { 
      fontSize: 16 * textMultiplier, 
      fontWeight: '400' as const,
      lineHeight: 24 * textMultiplier,
    },
    bodyLarge: { 
      fontSize: 18 * textMultiplier, 
      fontWeight: '400' as const,
      lineHeight: 26 * textMultiplier,
    },
    caption: { 
      fontSize: 14 * textMultiplier, 
      fontWeight: '400' as const,
      lineHeight: 20 * textMultiplier,
    },
    small: { 
      fontSize: 12 * textMultiplier, 
      fontWeight: '400' as const,
      lineHeight: 18 * textMultiplier,
    },
  };

  const spacing = {
    xs: 4 * spaceMultiplier,
    sm: 8 * spaceMultiplier,
    md: 16 * spaceMultiplier,
    lg: 24 * spaceMultiplier,
    xl: 32 * spaceMultiplier,
    xxl: 40 * spaceMultiplier,
  };

  return { colors, typography, spacing, isDarkMode, textSize, textMultiplier, spaceMultiplier };
};