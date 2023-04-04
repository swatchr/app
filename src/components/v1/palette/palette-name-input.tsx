import {
  chakra,
  Circle,
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Spinner,
  Tooltip,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useReducer } from 'react';

import { usePaletteDispatch, usePaletteState } from '@/contexts';
import { useKeyPress } from '@/hooks';
import { publish, slugify } from '@/utils';
import { useInput } from 'chakra.ui/hooks/use-input';

export type FormStatus = {
  isSubmitting: boolean;
  hasSubmitted: boolean;
  isPending: boolean;
  focus: boolean;
};
export function PaletteNameInput({ text }: { text: string }) {
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
    setState({
      isPending: true,
    });
  }, [input.value, name]);
  useEffect(() => {
    if (!hasSubmitted) return;
    setTimeout(() => {
      setState({
        hasSubmitted: false,
      });
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
    setState({
      focus: true,
    });
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
      publish('show-toast', {
        id: 'no-changes',
        title: 'No changes detected',
        description: `Palette name is already ${input?.value}`,
        status: 'info',
      });
      return;
    }

    updatePaletteName(slugify(input?.value!));
    resetInputState(); // reset();
  };

  useKeyPress({
    keys: ['Escape'],
    callback: handleBlur,
  });
  return (
    <HStack
      as={'form'}
      p={2}
      color={text}
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
        <Tooltip label="Click to Edit" size="xs" placement="bottom">
          <chakra.p
            p={2}
            role="button"
            cursor="text"
            onClick={handleFocusClick}
            isTruncated={true}
          >
            {input.value}
          </chakra.p>
        </Tooltip>
      ) : (
        <InputGroup>
          <FormControl id="name" key="name">
            <VisuallyHidden>
              <chakra.label
                htmlFor="name"
                visibility={focus ? 'initial' : 'hidden'}
                fontSize="sm"
                color={text}
              >
                palette name:
              </chakra.label>
            </VisuallyHidden>

            <Input
              size="md"
              color={text}
              rounded="md"
              _placeholder={{
                color: 'placeholder',
              }}
              _focusVisible={{
                outline: 'green',
              }}
              _selection={{
                color: 'white',
                bg: 'green.500',
              }}
              _focus={{
                text: 'inverse',
              }}
              _active={{
                text: 'inverse',
              }}
              {...input}
              type="text"
              placeholder={name}
              // isDisabled={status !== 'authenticated' || isSubmitting}
              pattern={'^[a-zA-Zs-]+$'} // alpha, dashes, spaces
              autoComplete="off"
              onBlur={handleBlur}
              variant="filled"
            />
          </FormControl>
        </InputGroup>
      )}
    </HStack>
  );
}
