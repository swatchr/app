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
    panels: [theme.colors.whiteAlpha[500], theme.colors.blackAlpha[500]],
  };
}
