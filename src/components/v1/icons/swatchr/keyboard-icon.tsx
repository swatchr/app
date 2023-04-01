import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function KeyboardIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="16 48 224 160"
      {...props}
    >
      <path d="M223.51 48h-191A16.51 16.51 0 0 0 16 64.49v127A16.51 16.51 0 0 0 32.49 208h191A16.51 16.51 0 0 0 240 191.51v-127A16.51 16.51 0 0 0 223.51 48Zm.49 143.51a.49.49 0 0 1-.49.49h-191a.49.49 0 0 1-.49-.49v-127a.49.49 0 0 1 .49-.49h191a.49.49 0 0 1 .49.49ZM208 128a8 8 0 0 1-8 8H56a8 8 0 0 1 0-16h144a8 8 0 0 1 8 8Zm0-32a8 8 0 0 1-8 8H56a8 8 0 0 1 0-16h144a8 8 0 0 1 8 8ZM72 160a8 8 0 0 1-8 8h-8a8 8 0 0 1 0-16h8a8 8 0 0 1 8 8Zm96 0a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8Zm40 0a8 8 0 0 1-8 8h-8a8 8 0 0 1 0-16h8a8 8 0 0 1 8 8Z" />
    </chakra.svg>
  );
}
