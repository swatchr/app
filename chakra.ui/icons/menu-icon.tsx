import { Box } from '@chakra-ui/react';

import type { BoxProps } from '@chakra-ui/react';

export const MenuIcon: React.FC<BoxProps> = (props) => {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      // xml:space="preserve"
      strokeMiterlimit="10"
      // style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round"
      viewBox="-1.72 0 371.72 280"
      {...props}
    >
      <clipPath id="a">
        <path d="M0 0h370v280H0z" />
      </clipPath>
      <g fillRule="evenodd" clipPath="url(#a)">
        <path d="M-1.715 119.69h369.01v39.895H-1.715V119.69ZM-1.715 239.36h369.01v39.895H-1.715V239.36ZM-1.715 0h369.01v39.895H-1.715V0Z" />
      </g>
    </Box>
  );
};
