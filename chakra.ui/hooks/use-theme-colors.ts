import { useTheme } from '@chakra-ui/react';

export function useThemeColors() {
  const theme = useTheme();
  return {
    colors: theme.colors,
    text: [
      theme.colors.gray[200],
      theme.colors.gray[500],
      theme.colors.gray[800],
    ],
  };
}
