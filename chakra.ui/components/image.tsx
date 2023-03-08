import { chakra } from '@chakra-ui/react';
import Image from 'next/image';

import type { ChakraProps } from '@chakra-ui/react';
import type { ImageProps } from 'next/image';

export const ChakraNextImage = chakra(Image, {
  shouldForwardProp: (prop) => {
    return [
      'width',
      'height',
      'src',
      'alt',
      'quality',
      'placeholder',
      'blurDataURL',
      'loader ',
      'fill',
    ].includes(prop);
  },
});

type ChNextImageProps = Omit<ImageProps, 'fill'> & ChakraProps;

export const ChImage: React.FC<ChNextImageProps> = (props) => {
  return <ChakraNextImage {...props} />;
};
