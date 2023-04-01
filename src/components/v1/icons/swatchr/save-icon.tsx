import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function SaveIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="32 32 192 192"
      {...props}
    >
      <path d="M219.31 80 176 36.69A15.86 15.86 0 0 0 164.69 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V91.31A15.86 15.86 0 0 0 219.31 80ZM168 208H88v-56h80Zm40 0h-24v-56a16 16 0 0 0-16-16H88a16 16 0 0 0-16 16v56H48V48h116.69L208 91.31ZM160 72a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h56a8 8 0 0 1 8 8Z"></path>
    </chakra.svg>
  );
}
