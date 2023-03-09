import {
  Box,
  Button,
  CloseButton,
  Container,
  Icon,
  Square,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import type { FC, ReactNode } from 'react';

import { isBrowser } from '@/utils';
import { CookieIcon } from 'chakra.ui';

interface BannerProps {
  children: ReactNode;
  btnLabel: string;
  consent: boolean;
  handleConsent: () => void;
}

export const Banner: FC<BannerProps> = ({
  children,
  btnLabel,
  consent,
  handleConsent,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const boxShadow = useColorModeValue('xl-dark', 'xl');
  const bg = useColorModeValue('gray.300', 'gray.800');
  const borderColor = useColorModeValue('green.500', 'green.300');
  const overlayBg = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

  const [hide, setHide] = useState<boolean>(consent);

  useEffect(() => {
    if (isBrowser && !consent) document.body.style.overflow = 'hidden';
    () => {
      if (isBrowser) document.body.style.overflow = 'visible';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !hide ? (
    <>
      <Box
        position="absolute"
        zIndex={20}
        inset={0}
        bg={overlayBg}
        overflow="hidden"
      />
      <Box
        as="section"
        position="fixed"
        bottom={36}
        left={0}
        right={0}
        zIndex="banner"
      >
        <Container
          py={{ base: '4', md: '2.5' }}
          maxW="container.md"
          position="relative"
          rounded="md"
          bg={bg}
          border="1px solid"
          boxShadow={boxShadow}
          borderColor={borderColor}
        >
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            spacing={{ base: '3', md: '2' }}
          >
            <CloseButton
              display={{ sm: 'none' }}
              onClick={() => setHide(!hide)}
            />
            <Stack
              spacing="4"
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'start', md: 'center' }}
            >
              {!isMobile && (
                <Square
                  p={1}
                  size="12"
                  bg={bg}
                  borderRadius="md"
                  border="2px"
                  borderColor={borderColor}
                >
                  <Icon as={CookieIcon} boxSize="8" color={borderColor} />
                </Square>
              )}
              <Box pe={{ base: '4', sm: '0' }}>{children}</Box>
            </Stack>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={{ base: '3', sm: '2' }}
              align={{ base: 'stretch', sm: 'center' }}
            >
              <Button
                variant="solid"
                colorScheme="green"
                width="full"
                onClick={handleConsent}
              >
                {btnLabel}
              </Button>
              <CloseButton
                display={{ base: 'none', sm: 'inline-flex' }}
                onClick={() => {
                  if (isBrowser) document.body.style.overflow = 'visible';
                  setHide(!hide);
                }}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  ) : null;
};
