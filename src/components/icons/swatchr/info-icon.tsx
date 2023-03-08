import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function InfoIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 37 37"
      {...props}
    >
      <path
        fillRule="nonzero"
        d="M18.5 35.103c-9.155 0-16.603-7.448-16.603-16.603 0-9.154 7.448-16.602 16.603-16.602 9.155 0 16.603 7.448 16.603 16.602 0 9.155-7.448 16.603-16.603 16.603M18.5 0C8.299 0 0 8.3 0 18.5 0 28.702 8.299 37 18.5 37S37 28.702 37 18.5C37 8.3 28.701 0 18.5 0"
      />
      <path d="M16.815 15.254h3.37v12.738h-3.37zm0-6.243h3.37v3.119h-3.37z" />
    </chakra.svg>
  );
}
