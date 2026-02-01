/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F0F9FF',
    card: '#FFFFFF',
    secondaryBackground: '#F1F5F9',
    tint: '#0EA5E9',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0EA5E9',
    bottle: {
      happy: '#10B981',
      okay: '#0EA5E9',
      mild: '#EAB308',
      sad: '#EF4444',
    },
    bottleFill: {
      happyStart: '#0ea5e9', // Sky 500
      happyEnd: '#06b6d4', // Cyan 500
      okayStart: '#0EA5E9',
      okayEnd: '#38BDF8',
      mildStart: '#EAB308',
      mildEnd: '#FBBF24',
      sadStart: '#EF4444',
      sadEnd: '#F87171',
    }
  },
  dark: {
    text: '#ECEDEE',
    background: '#242426',
    card: '#1E1E1E',
    secondaryBackground: '#2C2C2E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    bottle: {
      happy: '#10B981',
      okay: '#0EA5E9',
      mild: '#EAB308',
      sad: '#EF4444',
    },
    bottleFill: {
      happyStart: '#0284c7', // Sky 600
      happyEnd: '#0891b2', // Cyan 600
      okayStart: '#075985',
      okayEnd: '#0EA5E9',
      mildStart: '#854D0E',
      mildEnd: '#EAB308',
      sadStart: '#991B1B',
      sadEnd: '#EF4444',
    }
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
