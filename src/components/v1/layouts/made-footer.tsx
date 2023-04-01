import { CloseIcon } from '@chakra-ui/icons';
import { Box, chakra, Icon, IconButton, Link, Slide } from '@chakra-ui/react';
import { useState } from 'react';
import { GPTIcon } from '../icons/swatchr/gpt-icon';

export function MadeFooter() {
  const [showCredits, setShowCredits] = useState(true);

  return (
    <Box
      w="full"
      py={1}
      bg="black"
      color="white"
      as={Slide}
      in={showCredits}
      direction="bottom"
      unmountOnExit
      transition="all 0.5s ease-in-out 2s"
      shadow="sm"
      textAlign="center"
      verticalAlign="middle"
    >
      <chakra.p
        display="inline"
        as={Link}
        href="https://twitter.com/@Soham_Asmi"
        isExternal
      >
        Made with&nbsp;
        <chakra.span fontSize="sm">💚</chakra.span>
        &nbsp;
      </chakra.p>
      <Link href="https://openai.com/blog/chatgpt" isExternal>
        and&nbsp;
        <Icon as={GPTIcon} display="inline" boxSize="1.2rem" />
      </Link>
      {/* <chakra.p display="inline">
        &nbsp;in&nbsp; <chakra.span>🇺🇸</chakra.span>
      </chakra.p> */}
      <IconButton
        position="absolute"
        right={6}
        aria-label="Close"
        icon={<CloseIcon color="white" />}
        size="xs"
        variant="unstyled"
        colorScheme="blackAlpha"
        color="black"
        onClick={() => {
          setShowCredits(false);
        }}
      />
    </Box>
  );
}
