import { theme as base } from '@chakra-ui/react';
import type { StyleConfig } from '@chakra-ui/theme-tools';

export const components: Record<string, StyleConfig> = {
  Button: {
    baseStyle: {
      fontFamily: 'body',
    },
    variants: {
      pill: (props) => ({
        ...base?.components?.Button?.variants?.outline(props),
        rounded: 'full',
        color: 'gray.500',
      }),
    },
  },
  Badge: {
    baseStyle: {
      ...base?.components?.Badge.baseStyle,
    },
    variants: {
      rounded: (props) => ({
        ...base?.components?.Badge?.variants?.subtle(props),
        rounded: 'md',
        p: 1,
      }),
    },
  },
  Bar: {
    baseStyle: {
      posiition: 'fixed',
      w: 'full',
      px: 8,
      py: 14,
      maxH: 20,
      bg: 'gray.900', // @FIXME: add mode support
    },
  },
};
