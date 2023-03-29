import {
  Box,
  Button,
  chakra,
  Flex,
  Link,
  Textarea,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useReducer, useState } from 'react';

import { ALPHA_FEEDBACK_KEY } from '@/utils';
import { InputWrapper, MultiStepWizard } from 'chakra.ui';
import Image from 'next/image';

type AlphaFeedbackFormState = {
  rating1: number;
  rating2: number;
  rating3: number;
  body: string;
};

const initialFormState: AlphaFeedbackFormState = {
  rating1: 0,
  rating2: 0,
  rating3: 0,
  body: '',
};

export function AlphaFeedbackForm({
  onClose,
  onOpen,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useReducer(
    (prev: AlphaFeedbackFormState, next: Partial<AlphaFeedbackFormState>) => ({
      ...prev,
      ...next,
    }),
    initialFormState
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    localStorage.setItem(ALPHA_FEEDBACK_KEY, JSON.stringify(1));
    console.log('formData', formData);
    setFormData({});
    setStatus('submitted');
  };

  const setRating = useCallback((position: number, rating: number) => {
    setFormData({ [`rating${position}`]: rating });
  }, []);

  return (
    <Box as="form" w="full" mb={6} onSubmit={handleSubmit}>
      {status.toLowerCase() === 'submitted' ? (
        <VStack w="full" align="center">
          <chakra.h3 fontFamily="body">Thank you for trying Swatchr.</chakra.h3>
          <Image
            src="/hands-heart.png"
            width="200"
            height="131"
            alt="chubby heart hands"
          />
          <chakra.p pb={4}>We appreciate your time and insight.</chakra.p>
          <Button onClick={onClose}>Close</Button>
          <chakra.p fontSize="sm" pt={6} color="gray">
            Follow{' '}
            <chakra.span
              as={Link}
              color="blue.300"
              href="https://www.twitter.com/@SwatchrApp"
              isExternal
            >
              Swatchr on twitter
            </chakra.span>
            to keep up with the latest!
          </chakra.p>
        </VStack>
      ) : (
        <>
          <MultiStepWizard onSubmit={handleSubmit}>
            <VStack my={6}>
              <chakra.p textAlign="left" w="full">
                How would you rank your overall experience with Swatchr?
              </chakra.p>
              <RatingsWidget updateRating={setRating} position={1} />
            </VStack>
            <VStack my={6}>
              <chakra.p textAlign="left" w="full">
                How would you rank Swatchr&apos;s ease of use?
              </chakra.p>
              <RatingsWidget updateRating={setRating} position={2} />
            </VStack>
            <VStack my={6}>
              <chakra.p textAlign="left" w="full">
                How likely are you to use Swatchr again?
              </chakra.p>
              <RatingsWidget updateRating={setRating} position={3} />
            </VStack>
            <InputWrapper
              id="body"
              label="How can we improve Swatchr to better fit your workflow? Tell us about it..."
            >
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ body: e.target.value })}
                variant="filled"
              />
            </InputWrapper>
          </MultiStepWizard>
        </>
      )}
    </Box>
  );
}

const RatingsWidget = ({
  position,
  updateRating,
}: {
  position: number;
  updateRating: (position: number, index: number) => void;
}) => {
  const [rating, setRating] = useState(0);
  const starColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
  const ratingsBG = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  const handleStarClick = (index: number) => {
    setRating(index + 1);
    updateRating(position, index + 1);
  };

  return (
    <Flex
      w="full"
      justify="center"
      gap={[6, null, 12]}
      bg={ratingsBG}
      rounded="md"
    >
      {[...Array(5)].map((_, index) => (
        <chakra.div
          key={index}
          onClick={() => handleStarClick(index)}
          cursor="pointer"
          color={index < rating ? '#ffc107' : starColor}
          fontSize={42}
        >
          &#9733;
        </chakra.div>
      ))}
    </Flex>
  );
};
