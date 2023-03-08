import type { IconProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';

export function DotIcon(props: IconProps) {
  return (
    <chakra.svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="50" cy="50" r="50" />
    </chakra.svg>
  );
}
