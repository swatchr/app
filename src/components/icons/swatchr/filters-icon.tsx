import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function FiltersIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 36.51 29.67"
      {...props}
    >
      <path
        fillRule="nonzero"
        d="M36.51 24.377h-7.096c-.491-1.734-2.051-3.011-3.921-3.011-1.87 0-3.43 1.277-3.921 3.011H0v2.291h21.574c.494 1.73 2.052 3.004 3.919 3.004 1.868 0 3.425-1.274 3.92-3.004h7.097v-2.291Zm0-21.373h-7.104C28.912 1.273 27.355 0 25.488 0c-1.868 0-3.425 1.273-3.92 3.004H0v2.29h21.566c.492 1.735 2.052 3.012 3.922 3.012s3.429-1.277 3.921-3.012h7.101v-2.29Zm0 10.688H14.345c-.494-1.732-2.052-3.007-3.92-3.007-1.87 0-3.428 1.275-3.921 3.007H0v2.291h6.504c.493 1.732 2.051 3.007 3.92 3.007 1.87 0 3.427-1.275 3.92-3.007H36.51v-2.291Z"
      />
    </chakra.svg>
  );
}
