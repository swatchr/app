import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function ContrastIcon({ ...props }: IconProps) {
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
        d="M18.5 35.103c-9.155 0-16.603-7.448-16.603-16.603 0-9.154 7.448-16.602 16.603-16.602 9.154 0 16.603 7.448 16.603 16.602 0 9.155-7.449 16.603-16.603 16.603M18.5 0C8.299 0 0 8.3 0 18.5 0 28.701 8.299 37 18.5 37 28.7 37 37 28.701 37 18.5 37 8.3 28.7 0 18.5 0"
      />
      <path
        fillRule="nonzero"
        d="M18.5 3.786v29.43c8.13 0 14.715-6.584 14.715-14.715 0-8.121-6.585-14.715-14.715-14.715"
      />
    </chakra.svg>
  );
}
