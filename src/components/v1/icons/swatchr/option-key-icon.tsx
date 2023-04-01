import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function OptionKeyIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="24 64 208 128"
      {...props}
    >
      <path d="M232 184a8 8 0 0 1-8 8h-63.06a15.92 15.92 0 0 1-14.31-8.84L95.06 80H32a8 8 0 0 1 0-16h63.06a15.92 15.92 0 0 1 14.31 8.84L160.94 176H224a8 8 0 0 1 8 8ZM152 80h72a8 8 0 0 0 0-16h-72a8 8 0 0 0 0 16Z" />
    </chakra.svg>
  );
}
