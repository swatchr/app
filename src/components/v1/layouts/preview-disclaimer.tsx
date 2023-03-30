import { CloseIcon } from '@chakra-ui/icons';
import { Box, chakra, IconButton, Slide } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';

export function PreviewDisclaimer() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  return (
    <Box
      position="absolute"
      top={0}
      w="full"
      py={1}
      bg="#BADA55"
      color="black"
      as={Slide}
      in={showDisclaimer}
      display="block"
      direction="top"
      unmountOnExit
      transition="all 0.5s ease-in-out 1.5s"
      shadow="sm"
      textAlign="center"
      verticalAlign="middle"
      zIndex="overlay"
    >
      Public Alpha Preview | &nbsp;
      <chakra.span fontWeight={600} display={{ base: 'inline', md: 'none' }}>
        DISCLAIMER:{' '}
      </chakra.span>
      <Link href="#">
        <chakra.span
          color="black"
          display={{ base: 'none', md: 'inline' }}
          textDecor="underline"
        >
          See Disclaimer
        </chakra.span>
      </Link>
      <chakra.span display={{ base: 'inline', md: 'none' }}>
        &nbsp; User data is not persisted during preview period.
      </chakra.span>
      <IconButton
        position="absolute"
        right={6}
        aria-label="Close"
        icon={<CloseIcon />}
        size="xs"
        variant="unstyled"
        colorScheme="blackAlpha"
        color="black"
        onClick={() => {
          setShowDisclaimer(false);
        }}
      />
    </Box>
  );
}
