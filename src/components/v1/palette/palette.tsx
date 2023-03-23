import {
  chakra,
  Circle,
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
import { useCallback, useEffect, useReducer, useState } from 'react';

import { LockedIcon, Swatch, UnlockedIcon } from '@/components';
import {
  ColorProvider,
  ContentProvider,
  usePaletteDispatch,
  usePaletteState,
} from '@/contexts';
import { useKeyPress } from '@/hooks';
import { useInput } from '@/hooks/use-input';
import { isDev, publish, slugify } from '@/utils';
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

type FormStatus = {
  isSubmitting: boolean;
  hasSubmitted: boolean;
  isPending: boolean;
  focus: boolean;
};

function EditableInput({ text }: { text: string }) {
  const toast = useToast();
  const { status } = useSession();

  const {
    // palette,
    info: { name, status: paletteStatus },
  } = usePaletteState();

  const { updatePaletteName, updatePaletteStatus } = usePaletteDispatch();

  const { input, reset } = useInput<string>('name', {
    initialValue: name,
  });

  const [{ isSubmitting, hasSubmitted, isPending, focus }, setState] =
    useReducer(
      (prev: FormStatus, next: Partial<FormStatus>) => {
        next.isPending = !!(input.value !== name && !next.hasSubmitted);
        return { ...prev, ...next };
      },
      {
        isSubmitting: false,
        hasSubmitted: false,
        isPending: false,
        focus: false,
      }
    );

  useEffect(() => {
    if (input.value === name) return;
    setState({ isPending: true });
  }, [input.value, name]);

  useEffect(() => {
    if (!hasSubmitted) return;
    setTimeout(() => {
      setState({ hasSubmitted: false });
      reset();
    }, 2000);
  }, [hasSubmitted, reset]);

  const resetInputState = () =>
    setState({
      focus: false,
      isSubmitting: false,
      hasSubmitted: true,
      isPending: false,
    });

  const setSubmitting = () =>
    setState({
      isSubmitting: true,
      isPending: false,
    });

  const handleFocusClick = () => {
    setState({ focus: true });
  };

  const handleBlur = (e: React.FocusEvent | KeyboardEvent) => {
    e.preventDefault();
    resetInputState();
    reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting();
    if (!input?.value) return;
    if (input?.value?.toLowerCase() === name) {
      reset();
      resetInputState();
      toast({
        id: 'no-changes',
        title: 'No changes detected',
        description: `Palette name is already ${input?.value}`,
        status: 'info',
      });
      return;
    }
    updatePaletteName(slugify(input?.value!));
    resetInputState();
    // reset();
  };

  const handleUpdateStatus = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      toast({
        id: 'unauthorized-user',
        title: 'Unauthorized',
        description: 'Log in to perform this action',
        status: 'info',
        isClosable: true,
      });
      return;
    }
    updatePaletteStatus();
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
      alignItems="center"
      tabIndex={0}
    >
      {isSubmitting ? <Spinner size="xs" color="green" opacity={0.7} /> : null}
      <Circle
        size={2}
        bg={
          isPending
            ? 'orange'
            : isSubmitting
            ? 'orange'
            : hasSubmitted
            ? 'green'
            : 'gray'
        }
      />
      {!focus ? (
        <Tooltip label="Click to Edit" size="xs" placement="top">
          <chakra.p
            p={2}
            role="button"
            cursor="text"
            onClick={handleFocusClick}
            fontSize="sm"
            isTruncated={true}
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
              _placeholder={{ color: text }}
              _focusVisible={{ outline: 'green' }}
              _selection={{ color: 'white', bg: 'green.500' }}
              {...input}
              type="text"
              placeholder={name}
              isDisabled={status !== 'authenticated' || isSubmitting}
              pattern={'^[a-zA-Zs-]+$'} // alpha, dashes, spaces
              autoComplete="off"
              onBlur={handleBlur}
            />
          </FormControl>
        </InputGroup>
      )}
      <Tooltip label="Public Beta Only" size="xs" placement="top">
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
          isDisabled={status !== 'authenticated'}
          onClick={handleUpdateStatus}
        />
      </Tooltip>
    </HStack>
  );
}
