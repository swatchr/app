import { Center, chakra, Flex, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import type { useColorDispatch } from '@/contexts';

import { useThemeColors } from 'chakra.ui';
import ColorLab from 'lib/color';

export function HistoryViewer({
  colorHandlers,
}: {
  colorHandlers: ReturnType<typeof useColorDispatch>;
}) {
  const [show, setShow] = useState(false);
  const { text } = useThemeColors();

  return (
    <VStack
      position="absolute"
      bottom={16}
      w="full"
      mx={2}
      borderRadius="xl"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0.2 }}
    >
      <Center
        w="full"
        maxW={72}
        py={2}
        textAlign="center"
        border="1px"
        borderColor="currentColor"
        borderTopRadius="md"
        borderBottom="none"
        as={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: show ? 0.6 : 0, y: show ? 0 : 30 }}
      >
        <chakra.p fontSize="sm" w="full">
          Swatch History
        </chakra.p>
      </Center>
      <Flex
        w="full"
        justifyContent="center"
        borderLeft="1px"
        borderRight="1px"
        borderColor="currentColor"
      >
        {colorHandlers.history.history.map((color, i) => {
          const borderColor = new ColorLab(color).getBestContrastColor(text);
          return (
            <Center
              key={color + i}
              ml={1}
              bg={color}
              rounded="xl"
              boxSize="1.25em"
              border={
                colorHandlers.history.historyIndex === i ? '1px solid' : 'none'
              }
              borderColor={borderColor}
            />
          );
        })}
      </Flex>
    </VStack>
  );
}
