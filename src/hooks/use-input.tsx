import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useState } from 'react';

import type { InputProps } from '@chakra-ui/react';

function useInput(inputName: string) {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return {
    id: inputName,
    name: inputName,
    value,
    onChange: handleChange,
  };
}

export function InputUser({
  name,
  config,
  showLabel = false,
}: {
  name: string;
  config: Partial<InputProps>;
  showLabel?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const inputProps = useInput(name);

  return (
    <InputGroup
      as={config?.onSubmit ? 'form' : InputGroup}
      onSubmit={config?.onSubmit}
    >
      {showLabel ? (
        <FormLabel htmlFor={inputProps.id}>{name}</FormLabel>
      ) : (
        <VisuallyHidden>
          <FormLabel htmlFor={inputProps.id}>{name}</FormLabel>
        </VisuallyHidden>
      )}
      <Input
        _placeholder={{ color: focused ? 'gray.700' : 'gray.300' }}
        _selection={{ bg: 'green.600', color: 'gray.300' }}
        _focus={{ outline: 'none', color: 'gray.700' }}
        _active={{
          color: 'gray.700',
        }}
        {...inputProps}
        {...config}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </InputGroup>
  );
}
