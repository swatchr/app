import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function BinocularsIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="16 39.96 224 176.06"
      {...props}
    >
      <path d="M237.2 151.87a47.1 47.1 0 0 0-2.35-5.45L193.26 51.8a7.82 7.82 0 0 0-1.66-2.44 32 32 0 0 0-45.26 0A8 8 0 0 0 144 55v25h-32V55a8 8 0 0 0-2.34-5.66 32 32 0 0 0-45.26 0 7.82 7.82 0 0 0-1.66 2.44L21.15 146.4a47.1 47.1 0 0 0-2.35 5.45A48 48 0 1 0 112 168V96h32v72a48 48 0 1 0 93.2-16.13ZM76.71 59.75a16 16 0 0 1 19.29-1v73.51a47.9 47.9 0 0 0-46.79-9.92ZM64 200a32 32 0 1 1 32-32 32 32 0 0 1-32 32Zm96-141.26a16 16 0 0 1 19.29 1l27.5 62.58a47.9 47.9 0 0 0-46.79 9.93ZM192 200a32 32 0 1 1 32-32 32 32 0 0 1-32 32Z"></path>
    </chakra.svg>
  );
}
