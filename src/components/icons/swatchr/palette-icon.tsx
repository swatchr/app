import { chakra } from '@chakra-ui/react';

import type { IconProps } from '@chakra-ui/react';

export function PaletteIcon({ ...props }: IconProps) {
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
        d="M35.1 34.152a.95.95 0 0 1-.922.944c-.01 0-.016.005-.026.005h-5.736a.952.952 0 0 1-.948-.949V3.401c0-.523.427-.95.949-.95h5.735c.522 0 .949.427.949.95v30.751ZM25.988 1.91c-.266.436-.418.95-.418 1.491v23.376L19.62 4.574c-.107-.389.042-.797.332-1.007.113-.072.224-.123.337-.151l5.539-1.49c.053-.013.105-.012.158-.016ZM3.41 35.101a.95.95 0 0 1-.95-.949v-5.237l23.1 6.186H3.41Zm-1.476-9.277 1.255-4.691 19.414 11.21-20-5.356a.852.852 0 0 1-.335-.167.94.94 0 0 1-.334-.996m1.71-7.717 2.344-4.06c.002.001.003.004.004.006.038.047.086.104.133.152L21.34 29.421 3.985 19.4a.941.941 0 0 1-.341-1.293m3.829-6.589 3.409-3.408c.066.228.152.446.265.645L21.78 27.164 7.473 12.857a.901.901 0 0 1-.275-.741.857.857 0 0 1 .275-.598m5.364-4.728.038-.057a.929.929 0 0 1 .133-.133.669.669 0 0 1 .133-.095l4.594-2.658c-.07.402-.058.818.053 1.223l5.687 21.224-.014-.022L12.8 7.806a.93.93 0 0 1-.115-.636.84.84 0 0 1 .152-.38M37 34.152V3.401A2.85 2.85 0 0 0 34.152.552h-5.735c-.198 0-.397.019-.586.066a2.87 2.87 0 0 0-2.49-.527L19.805 1.58a2.699 2.699 0 0 0-.425.15h-.001a2.808 2.808 0 0 0-2.212.256l-4.975 2.867a2.608 2.608 0 0 0-.617.503 2.741 2.741 0 0 0-1.396.76L6.125 10.17a2.86 2.86 0 0 0-.77 1.405v.007a2.794 2.794 0 0 0-.49.61l-2.867 4.967a2.825 2.825 0 0 0-.26 2.201 2.892 2.892 0 0 0-.157.438L.1 25.33a2.823 2.823 0 0 0 .523 2.519 2.906 2.906 0 0 0-.063.568v5.735A2.852 2.852 0 0 0 3.41 37h30.742c.037 0 .072-.01.108-.011a2.84 2.84 0 0 0 2.26-1.261c.047-.073.093-.145.138-.219.034-.062.058-.127.086-.19.015-.034.03-.065.044-.1.063-.152.115-.309.149-.478l.006-.019v-.001c.007-.034.005-.073.01-.108.026-.151.047-.303.047-.461Z"
      />
      <path
        fillRule="nonzero"
        d="M31.284 32.254a.957.957 0 0 1-.956-.956.957.957 0 0 1 1.912 0c0 .527-.43.956-.956.956m0-3.81a2.858 2.858 0 0 0-2.855 2.854 2.858 2.858 0 0 0 2.855 2.854 2.857 2.857 0 0 0 2.854-2.854 2.857 2.857 0 0 0-2.854-2.854"
      />
    </chakra.svg>
  );
}
