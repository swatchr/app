import type { HTMLChakraProps, ThemingProps } from '@chakra-ui/react';
import { HStack, forwardRef, useStyleConfig } from '@chakra-ui/react';

export interface CustomBarProps extends HTMLChakraProps<'div'>, ThemingProps {}

export const Bar = forwardRef<CustomBarProps, 'div'>((props, ref) => {
  const { children, ...rest } = props;
  const styles = useStyleConfig('Bar', {});

  return (
    <HStack
      ref={ref}
      __css={styles}
      justifyContent="space-between"
      alignItems="center"
      {...rest}
    >
      {children}
    </HStack>
  );
});
