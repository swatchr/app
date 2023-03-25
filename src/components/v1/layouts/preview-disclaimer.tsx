import { CloseIcon } from '@chakra-ui/icons';
import { Center, chakra, IconButton, Slide } from '@chakra-ui/react';
import { useState } from 'react';

export function PreviewDisclaimer() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  return (
    <Center
      w="full"
      bg="#BADA55"
      color="black"
      position="absolute"
      top={0}
      py={1}
      zIndex={10}
      as={Slide}
      in={showDisclaimer}
      direction="top"
      unmountOnExit
      // @ts-expect-error transition is not properly typed
      transition={{ delay: 2000 }}
      shadow="sm"
    >
      Public Alpha Preview | &nbsp;
      <chakra.span fontWeight={600}>DISCLAIMER: </chakra.span>&nbsp; User data
      is not persisted during preview period.
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
        float="right"
      />
    </Center>
  );
}
