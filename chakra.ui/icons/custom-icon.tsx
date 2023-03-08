import { Box } from '@chakra-ui/react';
import { paths } from './paths';

import type { BoxProps, ChakraProps } from '@chakra-ui/react';

type CustomIconProps = {
  size: string | number | string[] | number[];
  icon: string;
  color?: string;
  stroke?: string;
} & BoxProps;

const Icon: React.FC<CustomIconProps & ChakraProps> = ({
  color,
  size,
  icon,
  stroke,
  ...rest
}) => {
  return (
    <Box
      as="svg"
      viewBox={paths[icon]?.viewBox}
      width={size}
      height={size}
      fill={color}
      stroke={stroke}
      {...rest}
    >
      {paths[icon]?.d.map((d: string, i: number) => (
        <path key={i} d={d} transform={paths[icon]?.transform} />
      ))}
    </Box>
  );
};

export const CustomIcon: React.FC<CustomIconProps> = ({
  size = '1.25rem',
  icon = 'add',
  color,
  stroke,
  ...rest
}) => {
  return (
    <Icon color={color} size={size} icon={icon} stroke={stroke} {...rest} />
  );
};
