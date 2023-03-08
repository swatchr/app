import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function AAAIcon({ ...props }: IconProps) {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 41.58 25.98"
      {...props}
    >
      <path
        fillRule="nonzero"
        d="M32.642 25.977h-3.641l-2.6-7.107H15.776l-2.45 7.107H9.683L19.408 0h3.527l9.707 25.977ZM25.377 15.93l-3.85-10.8c-.123-.35-.255-.954-.395-1.812h-.087c-.123.779-.254 1.383-.411 1.812l-3.825 10.8h8.568Zm-12.15-8.08a11.074 11.074 0 0 0-1.95 2.388L9.914 6.412c-.102-.292-.212-.798-.33-1.516h-.065c-.103.652-.22 1.157-.344 1.516l-3.2 9.036h3.66a11.808 11.808 0 0 0 .085 2.46H5.095l-2.05 5.947H-.002L8.134 2.121h2.951l2.142 5.728Zm15.127 0a11.074 11.074 0 0 1 1.95 2.388l1.364-3.826c.103-.292.213-.798.33-1.516h.065c.103.652.22 1.157.345 1.516l3.2 9.036h-3.66a11.808 11.808 0 0 1-.085 2.46h4.623l2.05 5.947h3.047L33.448 2.121h-2.952L28.354 7.85Z"
      />
    </chakra.svg>
  );
}
