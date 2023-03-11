import { Box, Text, useDisclosure, VStack } from '@chakra-ui/react';

import type { DrawerProps } from '@chakra-ui/react';

import docLinks from '__data/docs/links.json';
import { Drawer, mapDocs } from '../components';

export const Sidebar: React.FC<Partial<DrawerProps> & { open: boolean }> = ({
  open,
  children,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="aside">
      <Box
        pos="absolute"
        left={0}
        bottom={0}
        top={0}
        w={12}
        onClick={onOpen}
        _hover={{ bg: 'brand.800' }}
      />
      <Drawer
        {...{ isOpen: open || isOpen, onOpen, onClose }}
        placement="right"
      >
        {children ?? (
          <>
            <Text
              as="p"
              m={0}
              fontWeight={400}
              fontSize="1.5rem"
              lineHeight="2rem"
            >
              This stack uses:
            </Text>
            <VStack w="90%" mt={6} ml="auto" gap={4}>
              {docLinks.map(mapDocs)}
            </VStack>
          </>
        )}
      </Drawer>
    </Box>
  );
};
