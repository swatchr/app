import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export const ScalesIcon = (props: IconProps) => {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      // xml:space="preserve"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 37 37"
      {...props}
    >
      <path d="M0 24.667V37h37V24.667z" />
      <chakra.path fill="gray.600" d="M0 12.334v12.333h37V12.334z" />
      <chakra.path fill="gray.400" d="M0 0v12.333h37V0z" />
    </chakra.svg>
  );
};
