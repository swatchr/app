import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function SunglassesIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 37 11"
      {...props}
    >
      <path
        fillRule="nonzero"
        d="M37 1.88h-1.563l-.541-.254c-4.608-2.168-10.318-2.168-14.926 0l-.54.254h-1.753l-.507-.238c-4.609-2.168-10.318-2.168-14.926 0l-.507.238H0v1.573h1.992L3.06 8.721C3.106 9.984 4.217 11 5.576 11h8.391c1.362 0 2.474-1.019 2.516-2.287l.96-5.26h2.278l1.066 5.252c.046 1.264 1.156 2.279 2.515 2.279h8.391c1.362 0 2.474-1.019 2.516-2.287l.957-5.244H37V1.88Z"
      />
    </chakra.svg>
  );
}
