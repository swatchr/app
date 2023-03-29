/* eslint-disable quotes */
import { theme as base, type ChakraTheme } from '@chakra-ui/react';

const systemSerifFallbacks = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
  Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", "Georgia", "Times New Roman", serif`;

const commonSerifFallbacks = `Cambria, "Times New Roman", serif`;

const systemSansSerifFallbacks = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
  Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`;

const commonSansSerifFallbacks = `Roboto, Arial, sans-serif`;

export const fonts: ChakraTheme['fonts'] = {
  heading: `'Bebas Neue', cursive` + commonSansSerifFallbacks,
  body:
    `Recursive` + `, ${commonSansSerifFallbacks}, ${commonSansSerifFallbacks}`,
  brand: `'Fredoka One', ${commonSansSerifFallbacks}`,
  accent: `'Text Me One', ${commonSansSerifFallbacks}`,
  default: `${commonSansSerifFallbacks}, ${systemSansSerifFallbacks}`,
};
