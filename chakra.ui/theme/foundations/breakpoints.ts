import type { ChakraTheme } from '@chakra-ui/react';

// breakpoints equivalent to TailwindCSS @SEE: https://v2.tailwindcss.com/docs/breakpoints
// :: dS4OgwSTmS :: these same sizes are also reflected in next.config.js
export const breakpoints: ChakraTheme['breakpoints'] = {
  base: '0em',
  sm: '30em', // 480px
  md: '48em', // 768px
  lg: '62em', // 992px
  xl: '80em', // 1280px
  '2xl': '96em', // 1536pxs
};
