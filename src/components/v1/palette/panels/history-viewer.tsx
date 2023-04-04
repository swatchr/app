import { Center, chakra, Flex, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import type { useColorDispatch } from '@/contexts';

import { useClipboard } from '@/hooks';
import { publish } from '@/utils';
import { useThemeColors } from 'chakra.ui';
import ColorLab from 'lib/color';

export function HistoryViewer({
  colorHandlers,
}: {
  colorHandlers: ReturnType<typeof useColorDispatch>;
}) {
  const [show, setShow] = useState(false);
  const { text } = useThemeColors();
  const { history } = colorHandlers;

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
        {history.history.map((color, i) => {
          return (
            <HistorySwatch
              key={color + i + '-history'}
              index={i}
              color={color}
              history={history}
              text={text}
            />
          );
        })}
      </Flex>
    </VStack>
  );
}

function HistorySwatch({
  index,
  color,
  history,
  text,
}: {
  index: number;
  color: string;
  history: ReturnType<typeof useColorDispatch>['history'];
  text: string[];
}) {
  const borderColor = new ColorLab(color).getBestContrastColor(text);
  const { isCopied, copy } = useClipboard({
    text: color,
    onCopy: () => {
      publish('show-toast', {
        id: `copied-${color}`,
        title: 'Copied to clipboard',
        description: color,
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
    },
  });
  return (
    <Center
      ml={1}
      bg={color}
      rounded="xl"
      boxSize="1.25em"
      border={
        history.historyIndex === index
          ? `${isCopied ? '2px' : '1px'} solid`
          : 'none'
      }
      borderColor={borderColor}
      cursor="pointer"
      onClick={copy}
      onDoubleClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        history.handleChange(color);
      }}
    />
  );
}
