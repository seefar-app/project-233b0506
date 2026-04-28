import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  const colorScheme = useRNColorScheme();
  // Force dark mode for Midnight Elegance theme
  return 'dark' as const;
}