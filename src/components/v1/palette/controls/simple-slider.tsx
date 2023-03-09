import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';

import type { SliderMarkProps, SliderProps } from '@chakra-ui/react';
import type { HslColor } from 'react-colorful';

type SliderMarkVal = {
  label?: string;
  config: SliderMarkProps & { key: string };
};

const gradient = {
  hue: 'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))',
};

const gradients = {
  lightness: (hsl: HslColor) => {
    const { h, s, l } = hsl;
    return `linear-gradient(to top, hsl(${h}, ${s * 100}%, 0%), hsl(${h}, ${
      s * 100
    }%, ${l * 100}%))`;
  },
  saturation: (hsl: HslColor) => {
    const { h, s, l } = hsl;
    return `linear-gradient(to top, hsl(${h}, 0%, ${l * 100}%), hsl(${h}, ${
      s * 100
    }%, ${l * 100}%))`;
  },
};

export const SimpleSlider = ({
  start = 0,
  min = 0,
  max = 100,
  track = { label: '', config: { value: 0, key: '' } },
  currentColor,
  onChange = console.log,
  ...props
}: {
  currentColor: HslColor;
  start?: number;
  min?: number;
  max?: number;
  track?: SliderMarkVal;
  onChange?: (val: number) => void;
} & SliderProps) => {
  const defaultTrackMark: Partial<SliderMarkProps> = {
    w: 6,
    bg: 'blackAlpha.500',
    color: 'white',
    fontSize: 'xs',
    fontWeight: 'normal',
    textAlign: 'center',
    zIndex: 3,
    rounded: 'md',
  };

  const key = track.config.key;

  return (
    <Slider
      aria-label={`${track.config.key}-slider`}
      orientation="horizontal"
      defaultValue={start}
      min={min}
      max={max}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      my={2}
      {...props}
    >
      {track.label ? (
        <SliderMark {...defaultTrackMark} {...track.config}>
          {track?.label}
        </SliderMark>
      ) : null}
      {key === 'hue' ? (
        <SliderTrack
          bgImage={gradient[key as keyof typeof gradient]}
          minW={props?.orientation === 'horizontal' ? 'auto' : 4}
          minH={props?.orientation === 'vertical' ? 'auto' : 4}
        >
          <SliderFilledTrack bg="transparent" />
        </SliderTrack>
      ) : (
        <SliderTrack
          bgImage={gradients[key as keyof typeof gradients](currentColor)}
          minW={props?.orientation === 'horizontal' ? 'auto' : 5}
          minH={props?.orientation === 'vertical' ? 'auto' : 5}
        >
          <SliderFilledTrack bg="transparent" />
        </SliderTrack>
      )}
      <SliderThumb />
    </Slider>
  );
};
