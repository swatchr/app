import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function DropperIcon({ ...props }: IconProps) {
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
        d="M10.258 32.213a3.868 3.868 0 1 1-5.471-5.471l12.994-12.994 5.471 5.471-12.994 12.994Zm-6.839-6.839c-2.031 2.031-2.229 5.198-.622 7.461L0 35.632 1.368 37l2.797-2.797a5.8 5.8 0 0 0 7.461-.622l14.361-14.362-8.206-8.207L3.419 25.374ZM35.302 1.697a5.807 5.807 0 0 0-8.207 0l-4.103 4.104-1.025-1.026a2.782 2.782 0 0 0-3.926 0l-.171.171a2.785 2.785 0 0 0-.007 3.932l10.258 10.258a2.786 2.786 0 0 0 3.94 0l.171-.17a2.786 2.786 0 0 0-.007-3.933l-1.026-1.026 4.103-4.103a5.807 5.807 0 0 0 0-8.207"
      />
    </chakra.svg>
  );
}
