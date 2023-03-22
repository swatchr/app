import {
  chakra,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Tooltip,
  useDisclosure,
  useToast,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';

import { LockedIcon, Swatch, UnlockedIcon } from '@/components';
import { ColorProvider, ContentProvider, usePaletteState } from '@/contexts';
import { useKeyPress } from '@/hooks';
import { useInput } from '@/hooks/use-input';
import { isClient, isDev, slugify } from '@/utils';
import { api } from '@/utils/api';
import ColorLab from 'lib/color';
import { CommandPalette } from '../_wip/command-palette';
import { LogoCredits } from '../_wip/logo-credits';
import { ColorBlindnessSimulator } from './color-blindness-simulator';
import { HeaderIconStack } from './header-icon-stack';
import { ExportPanel } from './panels/export-panel';

export function Palette() {
  const { palette } = usePaletteState();
  const [showCB, setShowCB] = useState(false);
  const showColorBlindness = useCallback(
    () => setShowCB(!showCB),
    [showCB, setShowCB]
  );

  const { isOpen, onOpen, onClose } = useDisclosure(); // export modal

  const contrast =
    new ColorLab(palette[0]!).contrast == 'dark' ? 'whiteAlpha' : 'blackAlpha';

  const controlsText =
    new ColorLab(palette[palette.length - 1]!).contrast == 'dark'
      ? 'gray.600'
      : 'gray.300';

  return (
    <>
      {/* @TODO: WIP: finish command Palette logic */}
      {isDev ? <CommandPalette /> : null}
      <HeaderIconStack
        palette={palette}
        openModal={onOpen}
        showColorBlindness={showColorBlindness}
        showCB={showCB}
      />
      <ExportPanel isOpen={isOpen} onClose={onClose} />
      {showCB ? (
        <ColorBlindnessSimulator palette={palette} contrast={contrast} />
      ) : null}
      {palette.length && <EditableInput text={controlsText} />}
      <Flex className="swatches" m={0} p={0} gap={0}>
        {palette && palette.length
          ? palette.map((swatch, index) => (
              <ColorProvider key={index} color={swatch} index={index}>
                <ContentProvider>
                  <Swatch index={index} />
                </ContentProvider>
              </ColorProvider>
            ))
          : null}
      </Flex>
      {/* @TODO: WIP: Finish LogoCredits */}
      <LogoCredits />
    </>
  );
}

function EditableInput({ text }: { text: string }) {
  const toast = useToast();
  const { status } = useSession();

  const {
    palette,
    info: { name, status: paletteStatus },
  } = usePaletteState();

  const [focus, setFocus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { input, reset, update } = useInput<string>('name', {
    initialValue: name,
  });

  const mutation = api.palette.save.useMutation({
    onSuccess(data) {
      setIsSubmitting(false);
      setFocus(false);
      update(data?.name!);
      isClient && localStorage.setItem('palette-name', data?.name!);
      toast({
        title: 'Palette name updated',
        description: `Palette ${data?.serial} name updated to ${data?.name}`,
        status: 'success',
      });
    },
    onError(error) {
      setIsSubmitting(false);
      setFocus(false);
      update(name!);
      toast({
        title: 'Error updating palette name',
        description: error.message,
        status: 'error',
      });
    },
  });

  const handleFocusClick = () => {
    setFocus(true);
  };

  const handleBlur = (e: React.FocusEvent | KeyboardEvent) => {
    e.preventDefault();
    setFocus(false);
    reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input?.value) return;
    if (input?.value?.toLowerCase() === name) {
      reset();
      toast({
        title: 'No changes detected',
        description: `Palette name is already ${input?.value}`,
        status: 'info',
      });
      return;
    }
    setIsSubmitting(true);
    mutation.mutate({
      palette,
      data: { name: slugify(input?.value) },
    });
  };

  const handleUpdateStatus = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    if (status !== 'authenticated') {
      toast({
        title: 'Unauthorized',
        description: 'Log in to perform this action',
        status: 'info',
        isClosable: true,
      });
    }

    const _status = paletteStatus === 'public' ? 'private' : 'public';

    if (paletteStatus === 'public') {
      mutation.mutate({
        palette,
        data: { status: _status, name: slugify(input?.value) },
      });
    } else {
      mutation.mutate({
        palette,
        data: { status: _status, name: slugify(input?.value) },
      });
    }
  };

  useKeyPress({ keys: ['Escape'], callback: handleBlur });

  return (
    <HStack
      as={'form'}
      position="absolute"
      top={28}
      right={6}
      p={2}
      maxW={56}
      color={text}
      zIndex={1}
      onSubmit={handleSubmit}
    >
      {!focus ? (
        <Tooltip label="Click to Edit" size="xs" placement="top">
          <chakra.p
            p={2}
            role="button"
            cursor="text"
            onClick={handleFocusClick}
            fontSize="sm"
          >
            {input.value}
          </chakra.p>
        </Tooltip>
      ) : (
        <InputGroup>
          <FormControl id="name" key="name">
            <VisuallyHidden>
              <chakra.label htmlFor="name">Palette Name</chakra.label>
            </VisuallyHidden>
            <Input
              size="sm"
              pr={2}
              color={text}
              textAlign="right"
              rounded="md"
              tabIndex={0}
              _placeholder={{ color: text }}
              _focusVisible={{ outline: 'green' }}
              _selection={{ color: 'white', bg: 'green.500' }}
              {...input}
              type="text"
              placeholder={name}
              isDisabled={status !== 'authenticated' || isSubmitting}
              pattern={'^[a-zA-Zs-]+$'}
              autoComplete="off"
              onBlur={handleBlur}
            />
            <InputLeftElement>
              {isSubmitting ? (
                <Spinner size="xs" color="green" opacity={0.7} />
              ) : null}
            </InputLeftElement>
          </FormControl>
        </InputGroup>
      )}
      <Tooltip label="Public Only" size="xs" placement="top">
        <IconButton
          aria-label="Palette Privacy Status"
          icon={
            paletteStatus === 'public' ? (
              <UnlockedIcon boxSize="1.15rem" fill={text} />
            ) : (
              <LockedIcon boxSize="1.15rem" fill={text} />
            )
          }
          size="sm"
          variant="unstyled"
          colorScheme="green"
          isDisabled={true || status !== 'authenticated'}
          onClick={handleUpdateStatus}
        />
      </Tooltip>
    </HStack>
  );
}
