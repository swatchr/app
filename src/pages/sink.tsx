import { AddIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  chakra,
  Checkbox,
  CloseButton,
  Container,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  PinInput,
  PinInputField,
  Radio,
  RadioGroup,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Square,
  Switch,
  Textarea,
  theme,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import type { NextPageWithAuth } from '@/types';
import type { ButtonProps } from '@chakra-ui/react';

import { MinimalLayout } from '@/components';
import { capitalize, PARENS_REGEX } from '@/utils';
import { colors } from 'chakra.ui/theme/foundations/colors';
import { tokens } from 'chakra.ui/theme/foundations/tokens';
import { fonts } from 'chakra.ui/theme/typography/fonts';
import ColorLab from 'lib/color';

const Sink: NextPageWithAuth = () => {
  const [view, setView] = useState<string>('typography');
  return (
    <MinimalLayout title="test">
      <Container
        w="full"
        mx="auto"
        maxW={['container.sm', 'container.md', 'container.lg', 'container.xl']}
        py={3}
      >
        <chakra.h1>Kitchen Sink</chakra.h1>
        <HStack>
          {['typography', 'colors', 'buttons', 'inputs'].map((_v) => (
            <Button key={_v} onClick={() => setView(_v)}>
              {_v}
            </Button>
          ))}
        </HStack>
        {view === 'typography' && <TypographView />}
        {view === 'colors' && <ColorView />}
        {view === 'buttons' && <ButtonView />}
        {view === 'inputs' && <InputView />}
      </Container>
    </MinimalLayout>
  );
};

export default Sink;

Sink.auth = false;

export function InputView() {
  return (
    <Box my={4}>
      <chakra.h2>Inputs</chakra.h2>
      <VStack w="sm" gap={4}>
        <Input placeholder="placeholder" />
        <Input placeholder="placeholder" isDisabled={true} />
        <Editable defaultValue="Editable">
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Textarea />
        <FormControl>
          <FormLabel htmlFor="select">Select</FormLabel>
          <Select placeholder="Select option" id="select" aria-label="select">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </FormControl>
        <NumberInput w="full">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <HStack>
          <PinInput>
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
        <HStack spacing={5}>
          <Checkbox isDisabled>Checkbox</Checkbox>
          <Checkbox isDisabled defaultChecked>
            Checkbox
          </Checkbox>
        </HStack>
        <RadioGroup
          onChange={console.log}
          value={''}
          defaultValue={'1'}
          name="radio-types"
        >
          <HStack>
            {theme.components.Radio.sizes &&
              Object.keys(
                theme.components.Radio.sizes as Record<string, any>
              ) &&
              Object.keys(
                theme.components.Radio.sizes as Record<string, any>
              )?.map((size) => {
                return (
                  <Radio key={size} value={size} size={size}>
                    {size}
                  </Radio>
                );
              })}
            <Radio value="1" isDisabled>
              disabled
            </Radio>
            <Radio value="1" isInvalid>
              invalid
            </Radio>
          </HStack>
        </RadioGroup>
        {/* eslint-disable-next-line jsx-a11y/aria-proptypes */}
        <RangeSlider aria-label={['min', 'max']} defaultValue={[10, 30]}>
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>

        <Slider aria-label="slider-ex-1" defaultValue={30}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <HStack w="md" alignItems="center">
          {theme.components.Switch.sizes &&
            Object.keys(theme.components.Switch.sizes as Record<string, any>)
              .length &&
            Object.keys(
              theme.components.Switch.sizes as Record<string, any>
            )?.map((size) => (
              <FormControl key={size}>
                <FormLabel htmlFor="show">
                  <Switch id="show" size={size} />
                </FormLabel>
              </FormControl>
            ))}
        </HStack>
        <HStack w="md" alignItems="center">
          {theme.components.Switch.variants &&
            Object.keys(theme.components.Switch.variants as Record<string, any>)
              .length &&
            Object.keys(
              theme.components.Switch.variants as Record<string, any>
            )?.map((variant) => (
              <FormControl key={variant}>
                <FormLabel htmlFor="show">
                  <Switch id="show" size={variant} />
                </FormLabel>
              </FormControl>
            ))}
        </HStack>
      </VStack>
    </Box>
  );
}

export function ButtonView() {
  const sizes =
    theme.components.Button.sizes &&
    Object.keys(
      theme.components.Button.sizes as Record<string, ButtonProps['size']>
    ).length &&
    Object.keys(
      theme.components.Button.sizes as Record<string, ButtonProps['size']>
    );
  const variants =
    theme.components.Button.variants &&
    Object.keys(theme.components.Button.variants as Record<string, unknown>)
      .length &&
    Object.keys(theme.components.Button.variants as Record<string, unknown>);
  return (
    <Box my={12}>
      <chakra.h2>Buttons</chakra.h2>
      <Divider />
      <chakra.h3 mt={6}>Sizes</chakra.h3>
      <ButtonGroup>
        {sizes &&
          Object.keys(sizes)?.map((size) => (
            <Box key={size} mt={6}>
              <Button
                size={
                  sizes[size as keyof typeof sizes] as keyof ButtonProps['size']
                }
              >
                {sizes[size as keyof typeof sizes] as string}
              </Button>
            </Box>
          ))}
      </ButtonGroup>
      <chakra.h3 mt={6}>Variants</chakra.h3>
      <ButtonGroup>
        {variants &&
          Object.keys(variants)?.map((variant) => (
            <Box key={variant} mt={6}>
              <Button
                variant={
                  variants[
                    variant as keyof typeof variants
                  ] as keyof ButtonProps['variant']
                }
              >
                {variants[variant as keyof typeof variants] as string}
              </Button>
            </Box>
          ))}
      </ButtonGroup>
      <Box>
        <chakra.h3 mt={6}>With Icons</chakra.h3>
        <HStack spacing={4} mt={6}>
          <Button
            leftIcon={<ArrowBackIcon />}
            colorScheme="pink"
            variant="solid"
          >
            Settings
          </Button>
          <Button
            rightIcon={<ArrowForwardIcon />}
            colorScheme="blue"
            variant="outline"
          >
            Call us
          </Button>
          <Button isLoading colorScheme="teal" variant="solid">
            Email
          </Button>
          <Button
            isLoading
            loadingText="Submitting"
            colorScheme="teal"
            variant="outline"
          >
            Submit
          </Button>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button>Save</Button>
            <IconButton aria-label="Add to friends" icon={<AddIcon />} />
          </ButtonGroup>
          <CloseButton />
        </HStack>
      </Box>
    </Box>
  );
}

export function TypographView() {
  return (
    <>
      {Object.keys(fonts).map((font) => {
        const fontName = (fonts[font] as string).split(',')[0];
        return (
          <Box key={font} fontFamily={font} mt={6}>
            <Divider />
            <chakra.h2 color="gray" float="right">
              {capitalize(font)}
            </chakra.h2>
            <chakra.h1 fontFamily={font}>
              This is a heading 1 of the &apos;{fontName}&apos; family
            </chakra.h1>
            <chakra.h2 fontFamily={font}>
              This is a heading 2 of the &apos;{fontName}&apos; family
            </chakra.h2>
            <chakra.h3 fontFamily={font}>
              This is a heading 3 of the &apos;{fontName}&apos; family
            </chakra.h3>
            <chakra.h4 fontFamily={font}>
              This is a heading 4 of the &apos;{fontName}&apos; family
            </chakra.h4>
            <chakra.h5 fontFamily={font}>
              This is a heading 5 of the &apos;{fontName}&apos; family
            </chakra.h5>
            <chakra.p fontFamily={font}>This is a paragraph</chakra.p>
          </Box>
        );
      })}
    </>
  );
}

export function ColorSwatch({
  category,
  color,
}: {
  category: string;
  color: string;
}) {
  const COLOR = new ColorLab(color);
  return (
    <Center flexDirection="column">
      <Center
        border="1px red"
        pb={6}
        rounded="md"
        flexDir="column"
        justifyContent="center"
      >
        <Square
          size={20}
          bg={color}
          shadow="md"
          rounded="md"
          border="1px solid gray"
          color={COLOR.getContrastColors()[1]}
        />
        <chakra.p textStyle="tiny" fontWeight="bold" wordBreak="break-word">
          {color.toLowerCase().includes('rgb')
            ? color.replace(/rgba/g, '').replace(PARENS_REGEX, '').split(',')[3]
            : color.toUpperCase()}
        </chakra.p>
        <chakra.p textStyle="tiny">{category ? category : '?'}</chakra.p>
      </Center>
    </Center>
  );
}

export function ColorObjectMapper({
  key,
  colors,
}: {
  key: string;
  colors: Record<string, string>;
}) {
  return (
    <HStack flexWrap="wrap" gap={2}>
      {colors &&
        Object.keys(colors).map((_v) => {
          return (
            <ColorSwatch
              key={`${key}-${_v}`}
              category={_v}
              color={colors[_v]!}
            />
          );
        })}
    </HStack>
  );
}

export function ColorView() {
  return (
    <>
      {colors &&
        Object.keys(colors).map((_c) => {
          return (
            <Box key={_c} mt={6}>
              <Divider />
              <chakra.h2>{_c}</chakra.h2>
              <ColorObjectMapper
                key={_c}
                colors={colors[_c] as Record<string, string>}
              />
            </Box>
          );
        })}
      <Box>
        <Divider />
        <chakra.h2>Tokens</chakra.h2>
        <HStack flexWrap="wrap" gap={4} my={4}>
          {tokens.colors &&
            Object.keys(tokens.colors).map((_c) => {
              return (
                <>
                  <Box
                    key={_c}
                    px={2}
                    border="1px"
                    borderColor="gray.700"
                    rounded="md"
                    shadow="md"
                  >
                    <chakra.h2>{_c}</chakra.h2>
                    <ColorObjectMapper
                      key={_c}
                      colors={
                        tokens.colors[
                          _c as keyof typeof tokens.colors
                        ] as Record<string, string>
                      }
                    />
                  </Box>
                </>
              );
            })}
        </HStack>
      </Box>
      <HStack flexWrap="wrap" my={4}>
        {theme.colors &&
          Object.keys(theme.colors).map((_c) => {
            if (
              typeof theme.colors[_c as keyof typeof theme.colors] === 'string'
            ) {
              const bg = theme.colors[_c as keyof typeof theme.colors];
              return (
                <ColorSwatch key={`${_c}`} category={_c} color={bg as string} />
              );
            }

            if (
              typeof theme.colors[_c as keyof typeof theme.colors] === 'object'
            ) {
              return (
                <Box key={_c} mt={6}>
                  <Divider />
                  <chakra.h2>{_c}</chakra.h2>
                  <ColorObjectMapper
                    key={_c}
                    colors={
                      theme.colors[_c as keyof typeof theme.colors] as Record<
                        string,
                        string
                      >
                    }
                  />
                </Box>
              );
            }
          })}
      </HStack>
    </>
  );
}
