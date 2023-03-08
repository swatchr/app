import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function HueIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 36.67 36.67"
      {...props}
    >
      <path d="M12.224 0H0v36.674h12.224z" />
      <chakra.path fill="gray.500" d="M24.448 0H12.224v36.674h12.224z" />
      <chakra.path fill="gray.800" d="M36.673 0H24.449v36.674h12.224z" />
    </chakra.svg>
  );
}
