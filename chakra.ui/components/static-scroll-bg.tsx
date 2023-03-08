import { chakra } from '@chakra-ui/react';

export const StaticScrollBackground = chakra('div', {
  baseStyle: {
    height: '70vh',
    width: 'full',
    overflow: 'hidden',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    bgSize: 'cover',
    zIndex: -1,
    perspective: '-1px',
  },
});
