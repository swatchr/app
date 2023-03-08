import {
  Box,
  Button,
  Center,
  chakra,
  HStack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';

import { Drawer } from 'chakra.ui';
import { MenuIcon } from 'chakra.ui/icons/menu-icon';

type MenuLink = Record<string, string>;
const menu: MenuLink = {
  home: '/',
  about: '/#about',
  services: '/services',
  reviews: '/#reviews',
  contact: '/#contact',
};

export const MobileMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box as="nav">
      <Box display={{ base: 'block', lg: 'none' }}>
        <Center
          as={Button}
          variant="outline"
          py={8}
          shadow="md"
          onClick={onOpen}
        >
          <MenuIcon w={12} h={12} fill="primary" />
        </Center>
      </Box>
      <Drawer
        {...{ isOpen, onOpen, onClose }}
        size="full"
        placement="right"
        isFullHeight
      >
        <Center w="100%" h="100%" p={24}>
          <VStack gap={4}>
            <chakra.p textStyle="h1">MyApp</chakra.p>
            {Object.entries(menu).map(([key, value]) => (
              <chakra.h2
                key={key}
                textTransform="capitalize"
                color="primary"
                cursor="pointer"
              >
                <Link
                  className="mobile-nav-link"
                  href={value}
                  onClick={onClose}
                >
                  {key}
                </Link>
              </chakra.h2>
            ))}
          </VStack>
        </Center>
      </Drawer>
    </Box>
  );
};
