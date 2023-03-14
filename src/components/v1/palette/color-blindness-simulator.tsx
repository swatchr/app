import { Box, Button, Flex, HStack, VStack } from '@chakra-ui/react';
import ColorLab from 'lib/color';
import { useState } from 'react';

export function ColorBlindnessSimulator({
  contrast,
  palette,
}: {
  contrast: string;
  palette: string[];
}) {
  const colorBlindnessFilters: Record<string, string> = {
    protanomaly: 'protanomaly',
    protanopia: 'protanopia',
    deuteranomaly: 'deuteranomaly',
    deuteranopia: 'deuteranopia',
    tritanomaly: 'tritanomaly',
    tritanopia: 'tritanopia',
    achromatomaly: 'achromatomaly',
    achromatopsia: 'achromatopsia',
  };

  const [colorBlindnessMode, setColorBlindnessMode] =
    useState<keyof typeof colorBlindnessFilters>('protanomaly');
  return (
    <>
      <VStack
        position="absolute"
        top={10}
        left={12}
        zIndex={10}
        p={2}
        bg={`${contrast}.600`}
        rounded="md"
      >
        {Object.keys(colorBlindnessFilters).map((filter) => (
          <Button
            role="button"
            key={filter}
            // colorScheme={contrast}
            size="sm"
            cursor="pointer"
            border={filter === colorBlindnessMode ? '2px solid' : ''}
            onClick={() =>
              setColorBlindnessMode(
                filter as keyof typeof colorBlindnessFilters
              )
            }
          >
            {filter}
          </Button>
        ))}
      </VStack>
      <Flex w="full" h="100vh" position="absolute" inset={0} zIndex={2}>
        {palette?.length
          ? palette.map((color) => {
              const filters = new ColorLab(color).applyColorFilters();
              const filter =
                filters[colorBlindnessMode as keyof typeof filters];
              return <Box key={color} bg={filter} w="full" h="100vh" />;
            })
          : null}
      </Flex>
    </>
  );
}
