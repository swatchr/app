import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function TrashIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 30 37"
      {...props}
    >
      <path
        fillRule="nonzero"
        d="M28.104 10.056H1.896V8.884A2.849 2.849 0 0 1 4.74 6.038h20.52a2.849 2.849 0 0 1 2.844 2.846v1.172Zm-3.087 22.372c-.088 1.5-1.324 2.674-2.812 2.674H7.6a2.831 2.831 0 0 1-2.814-2.674L3.582 11.953h22.639l-1.204 20.475ZM13.104 1.898h3.792a2.85 2.85 0 0 1 2.781 2.242h-9.353a2.85 2.85 0 0 1 2.78-2.242M25.26 4.14h-3.684c-.3-2.328-2.272-4.14-4.68-4.14h-3.792c-2.407 0-4.379 1.812-4.679 4.14H4.74A4.748 4.748 0 0 0 0 8.884v3.069h1.683l1.211 20.586C3.04 35.041 5.107 37 7.6 37h14.605c2.491 0 4.558-1.959 4.705-4.461l1.21-20.586H30V8.884a4.748 4.748 0 0 0-4.74-4.744"
      />
      <path d="M15.851 15.271h-1.896v16.516h1.896zM10.16 31.732l-.95-16.515-1.892.109.95 16.515zm12.322-16.407-1.896-.109-.943 16.516 1.896.108z" />
    </chakra.svg>
  );
}
