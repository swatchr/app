import {
  Button,
  chakra,
  Checkbox,
  FormControl,
  HStack,
  IconButton,
  Input,
  Textarea,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useReducer } from 'react';

import type { ButtonProps } from '@chakra-ui/react';

import { EMAIL_REGEX } from '@/utils';
import { api } from '@/utils/api';
import { Popover } from 'chakra.ui';
import { FeedbackIcon } from '../icons';

type FeedbackState = {
  feedback: string | undefined;
  email: string | undefined;
  updates: 1 | 0;
};
function CustomFeedbackTrigger({ ...props }: ButtonProps) {
  return (
    <Tooltip label="Feedback">
      <IconButton
        aria-label="Feedback"
        icon={<FeedbackIcon boxSize={'1.2rem'} fill="currentColor" />}
        size="md"
        {...props}
      />
    </Tooltip>
  );
}
function WidgetStatesWrapper({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      justifyContent="center"
      alignItems="center"
      w="full"
      px={2}
      py={6}
      borderRadius="md"
      border="1px solid"
      borderColor="gray.500"
      rounded="md"
      boxShadow="md"
    >
      {children}
    </VStack>
  );
}

export function FeedbackWidget({
  fill,
  isDisabled,
}: {
  fill: string;
  isDisabled: boolean;
}) {
  const initialState: FeedbackState = {
    feedback: undefined,
    email: undefined,
    updates: 0,
  };

  const [state, setState] = useReducer(
    (prev: FeedbackState, next: Partial<FeedbackState>) => {
      if (next?.email?.length) {
        next.updates = 1;
      }
      if (prev.updates === 1) {
        if (!next.email?.length) {
          next.updates = 0;
        }
      }

      return { ...prev, ...next };
    },
    initialState
  );

  const { isOpen, onClose } = useDisclosure();
  const mutation = api.email.feedback.useMutation();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (state.updates && state.feedback) {
      mutation.mutate({ subject: state.feedback, email: state.email });
      onClose();
      setState(initialState);
      return;
    } else if (state.feedback) {
      mutation.mutate({ subject: state.feedback, email: undefined });
      onClose();
      setState(initialState);
      return;
    }
  };

  return (
    <Popover
      open={isOpen}
      popoverProps={{}}
      customButton={{
        Component: CustomFeedbackTrigger,
        props: { fill, color: 'inherit', isDisabled },
      }}
      content={{
        header: (
          <HStack>
            <chakra.h4 fontWeight="normal">Leave some feedback</chakra.h4>
          </HStack>
        ),
        footer: (
          <chakra.p
            fontSize="xs"
            textAlign="center"
            borderTop="1px"
            borderColor="gray.600"
            py={2}
          >
            We appreciate your support 💚
          </chakra.p>
        ),
      }}
      mt={12}
      ml={-24}
    >
      {mutation.status === 'error' ? (
        <WidgetStatesWrapper>
          <chakra.p fontSize="xs">
            {/* eslint-disable-next-line react/no-unescaped-entities ------ */}
            ❌ We're sorry, there was an error, try again.
          </chakra.p>
        </WidgetStatesWrapper>
      ) : mutation.status === 'success' ? (
        <WidgetStatesWrapper>
          <chakra.p fontSize="xs">✅ Thank you for your feedback!</chakra.p>
        </WidgetStatesWrapper>
      ) : (
        <FeedbackForm
          handleSubmit={handleSubmit}
          state={state}
          setState={setState}
          mutation={mutation}
        />
      )}
    </Popover>
  );
}

export function FeedbackForm({
  handleSubmit,
  state,
  setState,
  mutation,
}: {
  handleSubmit: (e: React.SyntheticEvent) => void;
  state: FeedbackState;
  setState: (next: Partial<FeedbackState>) => void;
  mutation: any;
}) {
  return (
    <VStack as="form" mb={1} onSubmit={handleSubmit}>
      <FormControl as={HStack}>
        <Textarea
          name="feedback"
          placeholder="How can we improve your Swatchr experience? Tell us about it..."
          value={state.feedback}
          onChange={(e) => setState({ feedback: e.target.value })}
          isRequired={true}
          _placeholder={{
            color: 'gray.400',
          }}
          fontSize="xs"
          border="1px"
          borderColor="gray.600"
        />
      </FormControl>
      <FormControl as={HStack}>
        <Input
          name="email"
          type="email"
          placeholder={`Email ${state.updates ? '(required)' : '(optional)'}`}
          isRequired={!!state.updates ? true : false}
          value={state.email}
          onChange={(e) => setState({ email: e.target.value.trim() })}
          _placeholder={{
            color: 'gray.400',
          }}
          fontSize="xs"
          border="1px"
          borderColor="gray.600"
        />
      </FormControl>
      <HStack pt={3} justifyContent="space-between" w="full">
        <Checkbox
          name="updates"
          aria-label="Subscribe to updates"
          value={state.updates}
          onChange={(e) => setState({ updates: e.target.checked ? 1 : 0 })}
          borderColor="gray.600"
          colorScheme="green"
          isChecked={
            EMAIL_REGEX.test(state.email ?? '')
              ? true
              : false || state.updates === 1
              ? true
              : false
          }
        >
          <chakra.p fontSize="2xs" color="gray.500">
            Receive updates on this issue?
          </chakra.p>
        </Checkbox>
        <Button
          type="submit"
          size="xs"
          alignSelf="flex-end"
          colorScheme="green"
          disabled={
            mutation.isLoading ||
            mutation.isSuccess ||
            mutation.isError ||
            !state.feedback ||
            (!!state.updates && !state.email)
          }
          isLoading={mutation.isLoading}
        >
          Submit
        </Button>
      </HStack>
    </VStack>
  );
}
