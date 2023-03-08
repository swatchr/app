import { extendTheme, type ChakraTheme } from '@chakra-ui/react';
import { theme } from '../theme';

export function mergeTheme(colorScheme: ChakraTheme['colors']) {
  const colors = {
    brand: {
      50: String(colorScheme?.bg),
      100: '#c2d1f0',
      200: String(colorScheme?.accent),
      300: String(colorScheme?.secondaryDark),
      400: String(colorScheme?.secondary),
      500: String(colorScheme?.primary),
      600: String(colorScheme?.accentDark),
      700: String(colorScheme?.primaryDark),
      800: '#0f1f3d',
      900: String(colorScheme?.bgDark),
    },
  };
  return extendTheme({
    ...theme,
    colors,
  });
}
