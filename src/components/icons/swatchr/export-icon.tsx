import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function ExportIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 37 34.7"
      {...props}
    >
      <path
        fillRule="nonzero"
        d="M32.484 11.22H21.213v1.806h11.271a2.717 2.717 0 0 1 2.709 2.71v14.449a2.711 2.711 0 0 1-2.709 2.709H4.515a2.711 2.711 0 0 1-2.709-2.709V15.736a2.717 2.717 0 0 1 2.709-2.71h11.28V11.22H4.515A4.522 4.522 0 0 0 0 15.736v14.449A4.523 4.523 0 0 0 4.515 34.7h27.969A4.517 4.517 0 0 0 37 30.185V15.736a4.517 4.517 0 0 0-4.516-4.516"
      />
      <path
        fillRule="nonzero"
        d="M17.601 3.459v19.496h1.806V3.464l2.361 2.36 1.276-1.277L18.501.004l-4.543 4.543 1.277 1.277 2.366-2.365Z"
      />
    </chakra.svg>
  );
}
