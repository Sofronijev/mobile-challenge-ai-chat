import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useColors() {
  const colorScheme = useColorScheme() ?? 'light';
  return Colors[colorScheme];
}
