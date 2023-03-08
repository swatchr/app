import type { ChakraTheme } from '@chakra-ui/react';
import { fonts } from './fonts';

export const typography: Pick<
  ChakraTheme,
  'fonts' | 'fontSizes' | 'fontWeights' | 'letterSpacings' | 'lineHeights'
> &
  typeof fonts = {
  fonts,
  fontSizes: {},
  fontWeights: {},
  letterSpacings: {},
  lineHeights: {},
};
