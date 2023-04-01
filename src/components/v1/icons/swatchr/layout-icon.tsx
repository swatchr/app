import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function LayoutIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="24 40 208 176"
      {...props}
    >
      <path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 16v40H40V56ZM40 112h56v88H40Zm176 88H112v-88h104v88Z"></path>
    </chakra.svg>
  );
}
