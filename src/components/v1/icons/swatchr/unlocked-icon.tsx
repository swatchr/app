import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function UnlockedIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 29.64 37"
      {...props}
    >
      <path
        fillRule="nonzero"
        d="M14.82 20.262a2.18 2.18 0 0 0-2.176 2.177c0 .802.441 1.496 1.088 1.873v4.936h2.176v-4.936a2.167 2.167 0 0 0 1.089-1.873 2.18 2.18 0 0 0-2.177-2.177"
      />
      <path
        fillRule="nonzero"
        d="M27.464 31.558a3.27 3.27 0 0 1-3.266 3.266H5.442a3.27 3.27 0 0 1-3.266-3.266V17.952a3.27 3.27 0 0 1 3.266-3.266h18.756a3.27 3.27 0 0 1 3.266 3.266v13.606Zm-3.029-19.024-2.176-.025H7.381V9.616c0-4.102 3.336-7.439 7.438-7.439 2.981 0 5.551 1.766 6.737 4.303l1.987-.885C22.017 2.298 18.685 0 14.819 0 9.518 0 5.204 4.314 5.204 9.616v2.918C2.315 12.662 0 15.033 0 17.952v13.606A5.448 5.448 0 0 0 5.442 37h18.756a5.449 5.449 0 0 0 5.443-5.442V17.952c0-2.919-2.317-5.291-5.206-5.418"
      />
    </chakra.svg>
  );
}
