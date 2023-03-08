import { Box, Tooltip } from '@chakra-ui/react';
import { paths } from './paths';

import type { ChakraProps } from '@chakra-ui/react';

type ToolIconProps = {
  icon: string;
  color: string;
  size: string;
  tipLabel?: string;
};

export const ToolIcon: React.FC<ToolIconProps & ChakraProps> = ({
  icon = 'add',
  color = 'inherit',
  size = '1.25em',
  tipLabel = null,
  ...rest
}) => {
  const CustomToolIcon: React.FC<ToolIconProps & ChakraProps> = ({
    color,
    icon,
    size,
    ...rest
  }) => {
    return (
      <Box
        as="svg"
        viewBox={paths[icon]?.viewBox}
        width={size}
        height={size}
        fill={color}
        {...rest}
      >
        {/*
        NOTE:  svgs might have multiple paths in order to compose the icon, we'll render each one if we encounter an array
        */}

        {paths[icon]?.d.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </Box>
    );
  };

  return tipLabel ? (
    <Tooltip label={tipLabel} aria-label={tipLabel}>
      <Box
        as="span"
        tabIndex={0}
        /* span is required by chakra as a wrapper on icons when using tooltips */
        // @link https://chakra-ui.com/docs/overlay/tooltip
      >
        <CustomToolIcon
          icon={icon}
          size={size}
          tipLabel={tipLabel}
          color={color}
          {...rest}
        />
      </Box>
    </Tooltip>
  ) : (
    <CustomToolIcon icon={icon} size={size} color={color} {...rest} />
  );
};
