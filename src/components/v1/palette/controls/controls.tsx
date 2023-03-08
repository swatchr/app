import {
  Box,
  Center,
  chakra,
  HStack,
  Icon,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react';

import {
  useColorDispatch,
  useColorState,
  useContentDispatch,
  useDisclosureDispatch,
} from '@/contexts';
import { useCallback } from 'react';
import {
  AAAIcon,
  DiceIcon,
  FiltersIcon,
  InfoIcon,
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
  const fillColor = colorState.instance.getContrastColors()[1];

  const { openAndUpdate } = useContentDispatch(); // used to toggle scales / combos panel

  const { toggleActive } = useDisclosureDispatch(); // used to toggle info panel
  const toggleInfoActive = useCallback(() => toggleActive('info'), []);

  return (
    <>
      <HStack
        w="full"
        py={2}
        px={1}
        gridArea="stack1"
        gridColumn="span 3"
        justify="space-between"
        color={colorState.instance.getContrastColors()[1]}
      >
        <ControlWrapper
          label="HSL Filters"
          shortcuts={['⌘', 'F']}
          action={setFilterView}
        >
          <Icon
            as={FiltersIcon}
            aria-label="HSL Filters"
            fill={fillColor}
            stroke={fillColor}
            color={fillColor}
            tabIndex={0}
            boxSize="5"
          />
        </ControlWrapper>
        <ControlWrapper
          label="Random Color"
          shortcuts={['SPACE']}
          action={colorHandlers.tinycolor.generateRandomColor}
        >
          <Box boxSize="1.5rem">
            <Icon
              as={DiceIcon}
              aria-label="Random Color"
              fill={fillColor}
              stroke={fillColor}
              color={fillColor}
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
        <ControlWrapper label="Color Info" action={toggleInfoActive}>
          <Box boxSize="1.5rem">
            <Icon
              as={InfoIcon}
              aria-label="Show Info"
              fill={fillColor}
              stroke={fillColor}
              color={fillColor}
              tabIndex={1}
            />
          </Box>
        </ControlWrapper>
        <ControlWrapper
          label="Color Combinations"
          action={() => openAndUpdate('combos')}
        >
          <Icon
            as={AAAIcon}
            aria-label="Show Color Scale Button"
            fill={fillColor}
            stroke={fillColor}
            color={fillColor}
            tabIndex={0}
            boxSize="5"
          />
        </ControlWrapper>
        <ControlWrapper
          label="Color Scale"
          action={() => openAndUpdate('scales')}
        >
          <Icon
            as={ScalesIcon}
            aria-label="Show Color Scale Button"
            fill={fillColor}
            stroke={fillColor}
            color={fillColor}
            tabIndex={0}
            boxSize={5}
          />
        </ControlWrapper>
        <ControlWrapper
          label="Color Match"
          action={() => openAndUpdate('match')}
        >
          <Icon
            as={PaletteIcon}
            aria-label="Show Color Scale Button"
            fill={fillColor}
            stroke={fillColor}
            color={fillColor}
            tabIndex={0}
            boxSize="5"
          />
        </ControlWrapper>
      </HStack>
    </>
  );
}
