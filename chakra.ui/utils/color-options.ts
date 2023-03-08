import type { ChakraTheme, Colors } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';

import { colors } from '../theme/foundations/colors';
import { semanticTokens } from '../theme/foundations/tokens';

const tokenColors =
  (semanticTokens as ChakraTheme['semanticTokens'])?.colors ?? null;

const tokensColorOptions = tokenColors
  ? Object.keys(tokenColors).map((token) => ({
      value: token,
      label: `token:${token}`,
    }))
  : [
      { value: '#FFF1E4', label: 'white' },
      { value: '#4A5568', label: 'black' },
    ];

// const brandColorOptions = Object.keys(colors as Colors)
//   .map((key) =>
//     Object.keys(colors[key])
//       .map((color) => ({
//         value: `${key}.${color}}`,
//         label: `color:${key}.${color}`,
//       }))
//       .flat()
//   )
//   .flat();

// const themeColors = Object.keys(theme.colors)
//   .map((key) =>
//     Object.keys(theme.colors[key])
//       .map((color) => ({
//         value: `${key}.${color}}`,
//         label: `color:${key}.${color}`,
//       }))
//       .flat()
//   )
//   .flat();

// const colorOptions = [
//   ...new Set([...tokensColorOptions, ...brandColorOptions]),
// ];
