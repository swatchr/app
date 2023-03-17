import { useKeyboardShortcut } from '@/hooks';
import {
  Box,
  Button,
  Center,
  chakra,
  Code,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  useDisclosure,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react';
import { useReducer, useState } from 'react';

import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { Search2Icon } from '@chakra-ui/icons';
import { CHModal } from 'chakra.ui';
import { roots, useCommands } from './cmd';

export function CommandPalette() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useKeyboardShortcut(
    ['Meta', 'k'],
    () => {
      if (isOpen) return onClose();
      onOpen();
    },
    {
      overrideSystem: true,
    }
  );

  return (
    <CHModal
      id="search-box-modal"
      isOpen={isOpen}
      onClose={onClose}
      autoFocus={true}
      allowClose={false}
      hasSubmit={false}
      isCentered={false}
    >
      <SearchBox />
    </CHModal>
  );
}

type SearchBoxState = {
  searchTerm: string;
  searchResults: string[];
};

export function SearchBox() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState<Boolean>(false);
  const [focusIndex, setFocusIndex] = useState(0);

  const { options, category, updateCategory } = useCommands();

  const [state, setState] = useReducer(
    (prev: SearchBoxState, next: Partial<SearchBoxState>) => {
      setIsLoading(true);
      if (!next?.searchTerm?.length) {
        // clear search results
        next.searchResults = [];
      } else {
        // update searchResults
        next.searchResults = options?.filter((item) =>
          item.includes(next?.searchTerm!)
        );
      }
      setIsLoading(false);
      return { ...prev, ...next };
    },
    {
      searchTerm: '',
      searchResults: options!,
    }
  );

  const { currentFocusIndex, handleKeyDown } = useKeyboardNavigation({
    focusIndex,
    itemsCount: state.searchResults.length,
    onKeyDown: (e: React.KeyboardEvent) => {
      console.log('keydown');
      console.log(e.currentTarget.textContent);
      updateCategory(e.currentTarget.textContent!);
    },
  });
  return (
    <VStack mt={2}>
      <InputGroup color={inputFocused ? 'gray.600' : 'green'}>
        <VisuallyHidden>
          <FormLabel htmlFor="search">Search</FormLabel>
        </VisuallyHidden>
        <InputLeftElement pointerEvents="none">
          <Search2Icon />
        </InputLeftElement>
        <Input
          w="full"
          name="search"
          type="search"
          placeholder={inputFocused ? 'What would you like to do?' : 'Search'}
          _placeholder={{ color: inputFocused ? 'gray.700' : 'gray.300' }}
          _selection={{ bg: 'green.600', color: 'gray.300' }}
          _focus={{ outline: 'none', color: 'gray.700' }}
          value={state.searchTerm}
          autoComplete="off"
          onChange={(e) => setState({ searchTerm: e.target.value })}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
      </InputGroup>
      <List w="full" p={0} m={0} spacing={0}>
        {state?.searchResults?.length
          ? state?.searchResults?.map((item, index) => {
              return (
                <ListItem
                  key={item}
                  tabIndex={currentFocusIndex === index ? 0 : -1}
                  onFocus={() => setFocusIndex(index)}
                  bg={currentFocusIndex === index ? 'gray.600' : 'initial'}
                  outline="none"
                  // outline={currentFocusIndex === index ? '2px solid' : 'none'}
                  // outlineColor={currentFocusIndex === index ? '#68D39173' : ''} // green.300
                  transition="outline 0.1s, bg: 0.2s"
                  rounded="md"
                  px={2}
                  cursor="pointer"
                  onClick={() => updateCategory(item)}
                  _focus={{ outline: 'none', bg: 'gray.800' }}
                  onKeyDown={handleKeyDown}
                  _hover={{ outline: 'none', bg: 'gray.700' }}
                  // onMouseEnter={() => setInputFocused(true)}
                  // onMouseLeave={() => setInputFocused(false)}
                >
                  {item}
                </ListItem>
              );
            })
          : null}
      </List>
      {/* <Box as="pre">
        <Code>{JSON.stringify(state, null, 2)}</Code>
      </Box> */}
    </VStack>
  );
}
