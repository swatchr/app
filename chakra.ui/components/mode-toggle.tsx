import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode } from '@chakra-ui/react';

export const ModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      size="lg"
      position="fixed"
      top={40}
      right="4"
      onClick={toggleColorMode}
      aria-label="toggle dark mode"
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      zIndex="docked"
    />
  );
};
