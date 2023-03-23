import { SimpleGrid } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import type { useColorDispatch, useColorState } from '@/contexts';

import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';
import { publish } from '@/utils';
import { Controls, FilterControls } from '../controls';

export type SwatchMenuAreas = Record<
  string,
  {
    label: string;
    icon?: string;
    IconComponent?: React.ReactNode | null | undefined;
    onClick?: null | undefined | ((args?: any) => void);
    fill?: string;
    stroke?: string;
  }
>;

export type SwatchControlView = 'default' | 'filter';
export const SwatchMenu: React.FC<{
  colorState: ReturnType<typeof useColorState>;
  colorHandlers: ReturnType<typeof useColorDispatch>;
  reset: boolean;
}> = ({ colorState, colorHandlers, reset }) => {
  const [view, setView] = useState<'default' | 'filter'>(() => 'default');

  const toggleVIew = useCallback(() => {
    setView((prev) => (prev === 'default' ? 'filter' : 'default'));
  }, [setView]);

  const filterView = useCallback(() => {
    setView('filter');
  }, []);

  const defaultView = useCallback(() => {
    setView('default');
  }, []);

  useEffect(() => {
    if (!reset) return;
    setView('default');
  }, [reset]);

  useEffect(() => {
    if (view === 'filter') {
      publish('show-toast', {
        title: 'HSL Filters Active',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [view]);

  // @NOTE: this overrides the default browser find shortcut
  useKeyboardShortcut(['Meta', 'f'], toggleVIew, {
    ignoreInputFields: true,
    overrideSystem: true,
  });

  return (
    <AnimatePresence>
      <SimpleGrid
        className="swatch-menu"
        position="absolute"
        inset={0}
        zIndex={0}
        fontSize="xs"
        bg="blackAlpha.50"
        // @TODO: convert to motion component
        willChange="background-color"
        transition="background-color 0.45s ease-in-out 2s"
        rounded="xl"
        boxShadow="sm"
        gridTemplateColumns="1fr 6fr 1fr"
        gridTemplateRows="1fr 7fr 1fr"
        gridTemplateAreas={
          ' "stack1 stack1 stack1" "stack2 stack3 stack4" "stack5 stack5 stack5" '
        }
      >
        {view === 'default' ? (
          <Controls
            colorState={colorState}
            colorHandlers={colorHandlers}
            setFilterView={filterView}
          />
        ) : null}
        {view === 'filter' ? (
          <FilterControls
            {...colorState}
            updateColor={colorHandlers.history.handleChange}
            setDefaultView={defaultView}
          />
        ) : null}
      </SimpleGrid>
    </AnimatePresence>
  );
};
