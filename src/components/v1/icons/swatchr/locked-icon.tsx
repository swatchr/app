import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function LockedIcon({ ...props }: IconProps) {
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
        d="M27.464 31.558a3.27 3.27 0 0 1-3.266 3.267H5.442a3.271 3.271 0 0 1-3.266-3.267V17.952a3.27 3.27 0 0 1 3.266-3.266h18.756a3.27 3.27 0 0 1 3.266 3.266v13.606ZM7.381 9.616c0-4.102 3.336-7.439 7.438-7.439 4.103 0 7.44 3.337 7.44 7.439v2.894H7.381V9.616Zm17.054 2.918V9.616C24.435 4.314 20.122 0 14.819 0 9.518 0 5.204 4.314 5.204 9.616v2.918C2.315 12.662 0 15.033 0 17.952v13.606A5.448 5.448 0 0 0 5.442 37h18.756a5.448 5.448 0 0 0 5.442-5.442V17.952c0-2.919-2.316-5.291-5.205-5.418"
      />
      <path
        fillRule="nonzero"
        d="M14.819 20.262a2.18 2.18 0 0 0-2.176 2.177 2.17 2.17 0 0 0 1.088 1.874v4.935h2.176v-4.935a2.17 2.17 0 0 0 1.089-1.874 2.18 2.18 0 0 0-2.177-2.177"
      />
    </chakra.svg>
  );
}
