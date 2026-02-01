import { useHydration } from '@/lib/hydration-store';
import { useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorScheme() {
    const systemColorScheme = useNativeColorScheme();
    const hydration = useHydration();

    if (!hydration || !hydration.settings) return systemColorScheme;

    const { settings } = hydration;
    if (settings.theme === 'system') return systemColorScheme;
    return settings.theme;
}


