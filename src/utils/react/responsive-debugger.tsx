import { Box, Text } from '@chakra-ui/react';

export const ResponsiveDebugger: React.FC<{ colors?: string[] }> = ({
  colors,
}) => {
  const borderColors = colors || [
    'red.400',
    'green.400',
    'blue.400',
    'teal.400',
  ];

  return (
    <>
      <Box
        position="absolute"
        inset="0"
        zIndex="docked"
        border="2px"
        borderColor={borderColors}
      >
        {/* <Text display={{ xs: 'block', sm: 'none' }}>xs</Text> */}
        <Text display={['block', 'none', null]}>sm</Text>
        <Text display={['none', 'block', 'none']}>md</Text>
        <Text display={['none', null, 'block', 'none']}>lg</Text>
        <Text display={['none', null, null, null, 'block']}>xl</Text>
      </Box>
    </>
  );
};
