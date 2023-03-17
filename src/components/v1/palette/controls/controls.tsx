import {
  Box,
  Center,
  HStack,
  Icon,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react';

import type { useColorDispatch, useColorState } from '@/contexts';

import { useContentDispatch } from '@/contexts';
import {
  AAAIcon,
  DiceIcon,
  FiltersIcon,
  PaletteIcon,
  ScalesIcon,
} from '../../icons';
import { ControlWrapper } from './control-wrapper';
import { PaletteControls } from './palette-controls';

export function Controls({
  colorState,
  colorHandlers,
  setFilterView,
}: {
  colorState: ReturnType<typeof useColorState>;
  colorHandlers: ReturnType<typeof useColorDispatch>;
  setFilterView: () => void;
}) {
  const { openAndUpdate } = useContentDispatch(); // used to toggle scales / combos panel

  return (
    <>
      <HStack
        w="full"
        py={2}
        px={1}
        gridArea="stack1"
        gridColumn="span 3"
        justify="space-between"
      >
        <ControlWrapper
          label="HSL Filters"
          shortcuts={['⌘', 'F']}
          action={setFilterView}
        >
          <Icon
            as={FiltersIcon}
            aria-label="HSL Filters"
            fill={'currentColor'}
            stroke={'currentColor'}
            color={'currentColor'}
            tabIndex={0}
            boxSize="5"
          />
        </ControlWrapper>
        <ControlWrapper
          label="Randomize"
          shortcuts={['SPACE']}
          action={colorHandlers.tinycolor.generateRandomColor}
        >
          <Box boxSize="1.5rem">
            <Icon
              as={DiceIcon}
              aria-label="Random Color"
              fill={'currentColor'}
              stroke={'currentColor'}
              color={'currentColor'}
              tabIndex={1}
            />
          </Box>
        </ControlWrapper>
      </HStack>
      <VisuallyHidden>
        <VStack
          gridArea="stack2"
          justifyContent="flex-end"
          py={1}
          mb={14}
          gap={3}
        >
          <PaletteControls index={colorState.index} modifier="decrement" />
        </VStack>
      </VisuallyHidden>
      <VisuallyHidden display="none">
        <Center gridArea="stack3" py={1}>
          This section appears behind the middle of the actual swatch and is
          always hidden
        </Center>
      </VisuallyHidden>
      <VStack
        gridArea="stack4"
        justifyContent="flex-end"
        py={1}
        mb={14}
        gap={3}
      >
        <PaletteControls index={colorState.index} modifier="increment" />
      </VStack>
      <HStack gridArea="stack5" py={2} px={1} justifyContent="space-between">
        <ControlWrapper
          label="Combinations"
          action={() => openAndUpdate('combos')}
        >
          <Icon
            as={AAAIcon}
            aria-label="Show Color Scale Button"
            fill={'currentcolor'}
            stroke={'currentcolor'}
            color={'currentcolor'}
            tabIndex={0}
            boxSize="5"
          />
        </ControlWrapper>
        <ControlWrapper label="Scale" action={() => openAndUpdate('scales')}>
          <Icon
            as={ScalesIcon}
            aria-label="Show Color Scale Button"
            fill={'currentColor'}
            stroke={'currentColor'}
            color={'currentColor'}
            tabIndex={0}
            boxSize={5}
          />
        </ControlWrapper>
        <ControlWrapper label="Match" action={() => openAndUpdate('match')}>
          <Icon
            as={PaletteIcon}
            aria-label="Show Color Scale Button"
            fill={'currentColor'}
            stroke={'currentColor'}
            color={'currentColor'}
            tabIndex={0}
            boxSize="5"
          />
        </ControlWrapper>
      </HStack>
    </>
  );
}
