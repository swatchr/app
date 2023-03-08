import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function AAIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 42.44 25.98"
      {...props}
    >
      <path
        fillRule="nonzero"
        d="M22.958 25.978h-3.641l-2.6-7.107H6.092L3.64 25.978H0L9.724 0h3.527l9.707 25.978ZM15.693 15.93l-3.851-10.8c-.123-.35-.254-.955-.394-1.812h-.087c-.123.779-.254 1.382-.412 1.811l-3.825 10.8h8.569Z"
      />
      <path
        fillRule="nonzero"
        d="M42.437 25.978h-3.641l-2.6-7.107H25.571l-2.451 7.107h-3.641L29.203 0h3.527l9.707 25.978ZM35.172 15.93l-3.851-10.8c-.123-.35-.254-.955-.394-1.812h-.087c-.123.779-.254 1.382-.412 1.811l-3.825 10.8h8.569Z"
      />
    </chakra.svg>
  );
}
