import { Box, Button, ButtonGroup, Flex, HStack } from '@chakra-ui/react';
import React, { useReducer } from 'react';

type MultiStepWizardState = {
  step: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export function MultiStepWizard({
  onSubmit,
  children,
}: {
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  const childrenCount = React.Children.count(children);

  const [{ step, hasPrev, hasNext }, setState] = useReducer(
    (prev: MultiStepWizardState, next: Partial<MultiStepWizardState>) => {
      if (next?.step && next.step + 1 > childrenCount) {
        next.step = prev.step;
        next.hasNext = false;
      }
      if (next?.step && next.step <= 0) {
        next.step = prev.step;
        next.hasPrev = false;
      }
      if (next?.step && next.step + 1 > 1) next.hasPrev = true;
      if (next?.step && next.step + 1 < childrenCount) {
        next.hasNext = true;
      }
      if (next?.step && next.step + 1 === childrenCount) {
        next.hasNext = false;
      }

      return {
        ...prev,
        ...next,
      };
    },
    {
      step: 0,
      hasPrev: false,
      hasNext: true,
    }
  );

  const nextStep = () => hasNext && setState({ step: step + 1 });
  const prevStep = () => hasPrev && setState({ step: step - 1 });
  // const resetStep = () => setState({ step: 0 });

  const handleStepSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLDivElement>
  ) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <Flex direction="column" justify="center" align="center">
      <Box w="full">
        <Box as="form" onSubmit={handleStepSubmit}>
          {React.Children.toArray(children)[step]}
        </Box>
        <HStack justify="space-between" mt={6}>
          <StepTimeline currentStep={step + 1} totalSteps={childrenCount} />
          <ButtonGroup>
            {hasPrev && (
              <Button type="button" onClick={prevStep} isDisabled={!hasPrev}>
                Prev
              </Button>
            )}
            {hasNext && (
              <Button type="button" onClick={nextStep} isDisabled={!hasNext}>
                Next
              </Button>
            )}
            {hasPrev && !hasNext && (
              <Button type="submit" onClick={onSubmit} colorScheme="green">
                Submit
              </Button>
            )}
          </ButtonGroup>
        </HStack>
      </Box>
    </Flex>
  );
}

const StepTimeline = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <Flex
      px={4}
      py={4}
      bg="whiteAlpha.100"
      align="center"
      gap={12}
      rounded="md"
    >
      {[...Array(totalSteps)].map((_, index) => (
        <Flex key={index} direction="column" alignItems="center">
          <Flex
            boxSize={8}
            borderRadius="full"
            backgroundColor={index + 1 <= currentStep ? '#BADA55' : 'gray'}
            opacity={index + 1 === currentStep ? 1 : 0.25}
            color="gray.600"
            justify="center"
            alignItems="center"
            fontWeight="bold"
            fontFamily="heading"
          >
            {index + 1}
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
