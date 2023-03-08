import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function ColorMixIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      // xml:space="preserve"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 36.71 36.71"
      {...props}
    >
      <path
        fillRule="nonzero"
        d="M23.768 24.827c0 6.563-5.321 11.883-11.884 11.883-6.564 0-11.885-5.32-11.885-11.883 0-6.563 5.321-11.886 11.885-11.886 6.563 0 11.884 5.323 11.884 11.886"
        opacity=".8"
      />
      <path
        fillRule="nonzero"
        d="M30.239 11.884c0 6.565-5.321 11.885-11.884 11.885-6.564 0-11.885-5.32-11.885-11.885C6.47 5.321 11.791 0 18.355 0c6.563 0 11.884 5.321 11.884 11.884"
        opacity=".6"
      />
      <path
        fillRule="nonzero"
        d="M36.71 24.827c0 6.563-5.321 11.883-11.885 11.883-6.563 0-11.884-5.32-11.884-11.883 0-6.563 5.321-11.886 11.884-11.886 6.564 0 11.885 5.323 11.885 11.886"
        opacity=".4"
      />
    </chakra.svg>
  );
}
