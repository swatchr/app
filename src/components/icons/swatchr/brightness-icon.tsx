import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function BrightnessIcon({ ...props }: IconProps) {
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
        d="M22.82 25.53a8.15 8.15 0 0 1-4.29 1.22h-.03a8.108 8.108 0 0 1-4.33-1.27 8.249 8.249 0 0 1-3.85-6.98c0-2.94 1.54-5.52 3.85-6.98 1.25-.8 2.74-1.26 4.33-1.27h.03c1.57 0 3.04.45 4.29 1.22a8.263 8.263 0 0 1 3.93 7.03c0 2.97-1.58 5.58-3.93 7.03m5.93-7.03c0-1.58-.36-3.08-1-4.42a10.337 10.337 0 0 0-4.81-4.83.612.612 0 0 1-.12-.05c-1.3-.609-2.76-.95-4.29-.95-1.56 0-3.04.35-4.36.98-.01.01-.03.02-.05.02a10.312 10.312 0 0 0-4.87 4.99c-.6 1.3-.93 2.74-.93 4.26 0 1.52.33 2.96.93 4.26.99 2.18 2.73 3.95 4.87 4.99.02 0 .04.01.05.02 1.32.63 2.8.98 4.36.98 1.53 0 2.99-.34 4.29-.949a.561.561 0 0 1 .12-.051c2.09-1.01 3.8-2.72 4.81-4.83.64-1.34 1-2.84 1-4.42"
      />
      <path d="M17.501 31.58h2V37h-2zm2-31.58h-2v5.41h2zM31.58 17.5h5.421v2H31.58zm-26.16 0H0v2h5.42zm21.624 10.957 3.828 3.83 1.415-1.414-3.829-3.83zM4.723 30.863l1.414 1.414 3.82-3.82-1.414-1.414z" />
      <path
        fillRule="nonzero"
        d="M27.751 9.25h.01c.24.24.46.48.67.74l.74-.74 2.41-2.409.69-.691.02-.02-1.42-1.42-.7.7-2.42 2.431-.7.699.7.7v.01ZM5.42 6.841l2.4 2.409.74.74c.21-.259.44-.5.68-.74v-.01h.01v-.009l.7-.691-.7-.699L6.83 5.41l-.68-.679-.02-.021-1.42 1.42.02.021.69.69Z"
      />
    </chakra.svg>
  );
}
