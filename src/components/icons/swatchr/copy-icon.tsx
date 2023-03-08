import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export const CopyIcon = (props: IconProps) => {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      // xml:space="preserve"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 511.94 511.95"
      {...props}
    >
      <chakra.path
        fillRule="nonzero"
        d="M176.651 0h261.12c20.414 0 38.961 8.332 52.398 21.773 13.441 13.441 21.773 31.988 21.773 52.398v259.16c0 20.414-8.332 38.961-21.773 52.398-13.441 13.441-31.988 21.773-52.398 21.773h-28.309v30.273c0 20.414-8.352 38.961-21.773 52.398-13.441 13.441-31.988 21.773-52.398 21.773H74.171c-20.414 0-38.961-8.332-52.398-21.773C8.332 476.732 0 458.185 0 437.775v-259.16c0-20.414 8.332-38.961 21.773-52.398 13.441-13.441 31.988-21.773 52.398-21.773h28.309V74.171c0-20.414 8.352-38.961 21.773-52.398C137.694 8.332 156.241 0 176.651 0Zm207.63 407.5h-207.63c-20.414 0-38.961-8.332-52.398-21.773-13.441-13.441-21.773-31.988-21.773-52.398v-203.7H74.171c-13.473 0-25.703 5.512-34.59 14.398-8.887 8.886-14.398 21.133-14.398 34.59v259.16c0 13.473 5.512 25.703 14.398 34.59 8.886 8.887 21.133 14.398 34.59 14.398h261.12c13.457 0 25.703-5.512 34.59-14.398 8.887-8.887 14.398-21.133 14.398-34.59l.002-30.277Zm53.477-382.32h-261.12c-13.457 0-25.703 5.512-34.59 14.398-8.887 8.886-14.398 21.133-14.398 34.59v259.14c0 13.457 5.512 25.703 14.398 34.59 8.886 8.887 21.133 14.398 34.59 14.398h261.12c13.473 0 25.703-5.512 34.59-14.398 8.887-8.887 14.398-21.133 14.398-34.59V74.148c0-13.473-5.512-25.703-14.398-34.59-8.887-8.887-21.133-14.398-34.59-14.398v.02Z"
      />
    </chakra.svg>
  );
};
