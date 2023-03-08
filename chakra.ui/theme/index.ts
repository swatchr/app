import {
  extendTheme,
  withDefaultColorScheme,
  withDefaultProps,
  type ChakraTheme,
} from '@chakra-ui/react';
import { components } from './components';
import { foundations } from './foundations';
import { typography } from './typography';

const debug = false;

export const theme: Partial<ChakraTheme> = extendTheme(
  {
    blur: {},
    components,
    ...foundations,
    ...typography,
  },
  withDefaultColorScheme({ colorScheme: 'brand' }),
  withDefaultProps({
    defaultProps: {
      color: 'body',
    },
    // components: ['Heading', 'Text'],
  })
);

// console.log('chakra theme', theme, debug);
