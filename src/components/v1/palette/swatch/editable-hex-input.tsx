import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  InputGroup,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import type { ColorDispatchValue, ColorStateValue } from '@/contexts';

import { useDebounce } from '@/hooks/use-debounce';
import {
  HEX_COLOR_WITHOUT_HASH_REGEX,
  HEX_COLOR_WITHOUT_HASH_REGEX_STRING,
} from '@/utils';
import { useThemeColors } from 'chakra.ui';

export function EditableHexInput({
  colorState,
  handleChange,
}: {
  colorState: ColorStateValue;
  handleChange: ColorDispatchValue['history']['handleChange'];
}) {
  const [value, setValue] = useState(colorState.color?.replace('#', ''));
  const { text } = useThemeColors();

  useEffect(
    () => setValue(colorState.color?.replace('#', '')),
    [colorState.color]
  );

  const handleSubmit = (value: string) => {
    if (HEX_COLOR_WITHOUT_HASH_REGEX.test(value)) {
      handleChange('#' + value.toUpperCase());
    }
  };

  return (
    <Center
      className="hex-input"
      position="absolute"
      fontFamily="heading"
      fontSize="3xl"
      color={colorState.instance.getBestContrastColor(text)}
      onClick={(e) => e.stopPropagation()}
      zIndex={2} // must appear above color picker
      maxW="80%"
    >
      <Editable
        value={value?.replace('#', '')}
        placeholder={value?.replace('#', '')}
        textAlign="center"
        onChange={useDebounce((value) => setValue(value), 100)}
        onSubmit={handleSubmit}
        maxW="80%"
      >
        <InputGroup>
          <EditablePreview
            _before={{
              // render the placeholder hash
              content: '"#"',
              color: 'inherit',
              position: 'absolute',
              fontWeight: 600,
              left: -3.5,
              top: 1,
            }}
          />
          <FormControl>
            <EditableInput
              pattern={HEX_COLOR_WITHOUT_HASH_REGEX_STRING}
              textTransform="uppercase"
              title="Provide a valid hex value"
              color={'black'}
            />
          </FormControl>
        </InputGroup>
      </Editable>
    </Center>
  );
}
