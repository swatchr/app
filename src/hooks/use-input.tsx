import {
  chakra,
  Input,
  InputGroup,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import type { InputProps } from '@chakra-ui/react';

function useInput(
  inputName: string,
  options?: {
    initialValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
) {
  const [value, setValue] = useState(options?.initialValue || '');

  // @FIXME: ADDING DEBOUNCE makes the logic break
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    options?.onChange ? options.onChange(event) : setValue(event.target.value);
  };

  return {
    id: inputName,
    name: inputName,
    value,
    onChange: options?.onChange ?? handleChange,
  };
}

export function InputUser({
  name,
  config = {},
  showLabel = false,
}: {
  name: string;
  // disallow onChange to manage state internally
  config: Partial<InputProps>;
  showLabel?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const inputProps = useInput(
    name,
    config?.onChange
      ? { initialValue: config.value as string, onChange: config?.onChange }
      : {}
  );

  return (
    <VStack
      as={config?.onSubmit ? 'form' : InputGroup}
      onSubmit={config?.onSubmit}
    >
      {showLabel ? (
        <chakra.label htmlFor={inputProps.id}>{name}</chakra.label>
      ) : (
        <VisuallyHidden>
          <chakra.label htmlFor={inputProps.id}>{name}</chakra.label>
        </VisuallyHidden>
      )}
      <Input
        _placeholder={{ color: focused ? 'gray.700' : 'gray.300' }}
        _selection={{ bg: 'green.600', color: 'gray.300' }}
        _focus={{ outline: 'none', color: 'gray.700' }}
        _active={{ color: 'gray.700' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...inputProps}
        {...config}
      />
    </VStack>
  );
}
