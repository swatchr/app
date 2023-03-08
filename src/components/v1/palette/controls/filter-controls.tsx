import {
  Box,
  Center,
  HStack,
  Icon,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import tinycolor from 'tinycolor2';

import type { ColorDispatchValue } from '@/contexts';

import { useDebounce } from '@/hooks';
import Color from 'lib/color';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { BrightnessIcon, HueIcon, SaturationIcon } from '../../icons';
import { ControlWrapper } from './control-wrapper';
import { SimpleSlider } from './simple-slider';

export function FilterControls({
  color,
  instance,
  updateColor,
  setDefaultView,
}: {
  color: string;
  index: number;
  instance: Color;
  updateColor: ColorDispatchValue['history']['handleChange'];
  setDefaultView: () => void;
}) {
  const fillColor = instance.getContrastColors()[1];

  const [hsl, setHsl] = useState(instance.toHsl(color));

  const hex = useMemo(() => tinycolor(hsl).toHexString(), [hsl]);

  useEffect(() => {
    if (hex !== color) {
      updateColor(hex);
    }
  }, [hex, color]);

  const handleColorChange = useCallback(
    (prop: keyof typeof hsl) =>
      useDebounce((val: number) => {
        setHsl((prevState) => ({ ...prevState, [prop]: Number(val) }));
      }, 300),
    []
  );

  return (
    <>
      <HStack
        w="full"
        py={1}
        gridArea="stack1"
        gridColumn="span 3"
        justify="space-between"
        tabIndex={-1}
      >
        <ControlWrapper label="Close Filters (⌘ + F)" action={setDefaultView}>
          <Box boxSize="1.35rem" tabIndex={-1}>
            <Icon
              as={SmallCloseIcon}
              aria-label="Close Filters"
              fill={'red'}
              stroke={fillColor}
            />
          </Box>
        </ControlWrapper>
      </HStack>
      <VStack
        gridArea="stack2"
        py={1}
        mb={14}
        color={instance.getContrastColors()[1]}
        justifyContent="flex-end"
        tabIndex={-1}
        my="auto"
      >
        <ControlWrapper noMotion>
          <VStack
            bg="whiteAlpha.400"
            p={1}
            rounded="md"
            tabIndex={-1}
            justifyContent="center"
          >
            <Icon aria-label="Brightness" as={BrightnessIcon} />
            <SimpleSlider
              min={0}
              max={1}
              step={0.01}
              start={hsl.l}
              currentColor={hsl}
              orientation="vertical"
              minH={36}
              track={{
                config: { key: 'lightness', value: hsl.l },
              }}
              tabIndex={0}
              onChange={handleColorChange('l')}
            />
          </VStack>
        </ControlWrapper>
      </VStack>
      <VisuallyHidden>
        <Center gridArea="stack3" py={1} />
      </VisuallyHidden>
      <VStack
        py={1}
        mb={14}
        color={instance.getContrastColors()}
        justifyContent="flex-end"
        gridArea="stack4"
        tabIndex={-1}
        my="auto"
      >
        <ControlWrapper noMotion>
          <VStack
            bg="whiteAlpha.400"
            p={1}
            rounded="md"
            tabIndex={-1}
            justifyContent="center"
          >
            <Icon aria-label="Saturation" as={SaturationIcon} />
            <SimpleSlider
              min={0}
              max={1}
              step={0.01}
              start={hsl.s}
              currentColor={hsl}
              orientation="vertical"
              minH={36}
              track={{
                config: { key: 'saturation', value: hsl.s },
              }}
              tabIndex={1}
              onChange={handleColorChange('s')}
            />
          </VStack>
        </ControlWrapper>
      </VStack>
      <HStack gridArea="stack5" py={1} justifyContent="center" tabIndex={-1}>
        <ControlWrapper noMotion>
          <HStack
            bg="whiteAlpha.400"
            px={1}
            rounded="md"
            h={8}
            mt={2}
            tabIndex={-1}
            alignItems="center"
          >
            {/* <Icon aria-label="Hue" as={HueIcon} /> */}
            <SimpleSlider
              min={0}
              max={360}
              start={hsl.h}
              orientation="horizontal"
              currentColor={hsl}
              minW={44}
              track={{
                config: { key: 'hue', value: hsl.h },
              }}
              tabIndex={2}
              onChange={handleColorChange('h')}
            />
          </HStack>
        </ControlWrapper>
      </HStack>
    </>
  );
}
