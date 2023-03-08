import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
  Center,
  chakra,
  Tooltip,
  VStack,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';

function ShortCuts({ label, keys }: { label: string; keys: string[] }) {
  return (
    <VStack>
      <chakra.p fontSize="xs">{label}</chakra.p>
      {keys?.length ? (
        <ButtonGroup
          size="xs"
          variant="outline"
          p={1}
          fontSize="xs"
          isDisabled={true}
        >
          {keys.map((key) => (
            <Button key={key} border="1px solid" color="inherit">
              {key}
            </Button>
          ))}
        </ButtonGroup>
      ) : null}
    </VStack>
  );
}

type ControlWrapperProps = {
  label?: string | undefined;
  shortcuts?: string[] | undefined;
  disabled?: boolean | undefined;
  noMotion?: boolean | undefined;
  action?: (...args: any[]) => void;
  children: React.ReactNode;
} & BoxProps;

export function ControlWrapper({
  label,
  shortcuts,
  action,
  disabled,
  noMotion,
  children,
}: ControlWrapperProps) {
  const handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    action && action();
  };

  if (label) {
    return (
      <Tooltip
        label={
          shortcuts?.length ? (
            <ShortCuts label={label} keys={shortcuts} />
          ) : (
            label
          )
        }
        placement="top"
        aria-label={label}
        rounded="md"
        openDelay={500}
        tabIndex={-1}
      >
        {noMotion ? (
          <Box tabIndex={-1}>
            {action ? (
              <Center
                role="button"
                tabIndex={-1}
                as={Button}
                aria-label={label}
                boxSize="1.25rem"
                variant="unstyled"
                onClick={handleClick}
                disabled={disabled}
              >
                {children}
              </Center>
            ) : (
              <Center
                role="button"
                tabIndex={-1}
                aria-label={label}
                boxSize="1.25rem"
                minW={10}
              >
                {children}
              </Center>
            )}
          </Box>
        ) : (
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.3, y: 0 }}
            whileHover={{ opacity: 1 }}
            whileTap={{ opacity: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition="0.35 easeIn 0.6"
            tabIndex={-1}
          >
            {action ? (
              <Center
                role="button"
                tabIndex={-1}
                as={Button}
                aria-label={label}
                boxSize="1.25rem"
                variant="unstyled"
                onClick={handleClick}
                disabled={disabled}
              >
                {children}
              </Center>
            ) : (
              <Center
                role="button"
                tabIndex={-1}
                aria-label={label}
                boxSize="1.25rem"
                minW={10}
              >
                {children}
              </Center>
            )}
          </Box>
        )}
      </Tooltip>
    );
  }

  return noMotion ? (
    <Box tabIndex={-1}>
      {action ? (
        <Center
          tabIndex={-1}
          as={Button}
          aria-label={label}
          boxSize="1.25rem"
          variant="unstyled"
          onClick={handleClick}
          disabled={disabled}
        >
          {children}
        </Center>
      ) : (
        <Center tabIndex={-1} aria-label={label} boxSize="1.25rem" minW={10}>
          {children}
        </Center>
      )}
    </Box>
  ) : (
    <Box
      as={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.3, y: 0 }}
      whileHover={{ opacity: 1 }}
      whileTap={{ opacity: 1 }}
      exit={{ opacity: 0, y: 10 }}
      transition="0.35 easeIn 0.6"
      tabIndex={-1}
    >
      {action ? (
        <Center
          tabIndex={-1}
          as={Button}
          aria-label={label}
          boxSize="1.25rem"
          variant="unstyled"
          onClick={handleClick}
          disabled={disabled}
        >
          {children}
        </Center>
      ) : (
        <Center tabIndex={-1} aria-label={label} boxSize="1.25rem" minW={10}>
          {children}
        </Center>
      )}
    </Box>
  );
}
