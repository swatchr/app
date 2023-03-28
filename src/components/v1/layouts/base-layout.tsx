import { onIdle } from '@analytics/activity-utils';
import {
  Box,
  Button,
  chakra,
  Flex,
  Link,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { SkipNavContent } from '@chakra-ui/skip-nav';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useCallback, useEffect, useReducer, useState } from 'react';

import type { OGImage } from '@/utils/seo';

import { ALPHA_FEEDBACK_KEY, isClient, ONE_SECOND_MS } from '@/utils';
import { SEOConfig } from '@/utils/seo';
import {
  CHModal,
  InputWrapper,
  MotionBox,
  MultiStepWizard,
  transitionDown as variants,
} from 'chakra.ui';
import { analytics } from 'lib/analytics';
import Image from 'next/image';
import { MadeFooter } from './made-footer';
import { PreviewDisclaimer } from './preview-disclaimer';

export type BaseLayoutProps = {
  title: string;
  description?: string;
  image?: OGImage;
  children: React.ReactNode;
};

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  title = 'Site Title',
  description = '',
  image,
  children,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  useEffect(() => {
    if (!isClient) return;

    const opts = {
      // timeout: ONE_MIN_MS,
      timeout: 45 * ONE_SECOND_MS,
    };

    onIdle((activeTime: any) => {
      const storageItem = localStorage.getItem(ALPHA_FEEDBACK_KEY) ?? '0';
      const hasBeenShown = JSON.parse(storageItem);
      analytics.track('alpha-feedback-request:check', {
        ...session,
        hasBeenShown: hasBeenShown,
      });
      if (hasBeenShown || isOpen) return;
      onOpen();
      analytics.track('alpha-feedback-request:show', {
        ...session,
        shown: new Date().getTime(),
      });
    }, opts);
  }, [onOpen, session, isOpen]);

  return (
    <>
      <NextSeo {...SEOConfig(title, description, image)} />
      <chakra.main bg="bg">
        <CHModal
          title="Alpha Preview User Feedback"
          isOpen={isOpen}
          onClose={onClose}
          hasSubmit
          allowClose
        >
          <AlphaFeedbackForm onClose={onClose} />
        </CHModal>
        <PreviewDisclaimer />
        <SkipNavContent />
        <Box
          position="relative"
          w="full"
          color="text"
          height="$100vh" // chakra box height trick:
          // @SEE: https://twitter.com/pagebakers/status/1638973614296031232/photo/1
          overflow="hidden"
        >
          {children}
          <MadeFooter />
        </Box>
      </chakra.main>
    </>
  );
};

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

export function AlphaFeedbackForm({ onClose }: { onClose: () => void }) {
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
              <chakra.p textAlign="left" w="full" color="gray.400">
                How would you rank your overall experience with Swatchr?
              </chakra.p>
              <RatingsWidget updateRating={setRating} position={1} />
            </VStack>
            <VStack my={6}>
              <chakra.p textAlign="left" w="full" color="gray.400">
                How would you rank Swatchr&apos;s ease of use?
              </chakra.p>
              <RatingsWidget updateRating={setRating} position={2} />
            </VStack>
            <VStack my={6}>
              <chakra.p textAlign="left" w="full" color="gray.400">
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

  const handleStarClick = (index: number) => {
    setRating(index + 1);
    updateRating(position, index + 1);
  };

  return (
    <Flex
      w="full"
      justify="center"
      gap={[6, null, 12]}
      bg={'whiteAlpha.100'}
      rounded="md"
    >
      {[...Array(5)].map((_, index) => (
        <chakra.div
          key={index}
          onClick={() => handleStarClick(index)}
          cursor="pointer"
          color={index < rating ? '#ffc107' : 'whiteAlpha.300'}
          fontSize={42}
        >
          &#9733;
        </chakra.div>
      ))}
    </Flex>
  );
};

type MainProps = {
  children: React.ReactNode;
};

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <chakra.main bg="bg">
      <SkipNavContent />
      <MotionBox
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        position="relative"
        w="full"
        pt={0}
        mt={0}
        pb={0}
      >
        {/* <Box
          position="relative"
          w="full"
          color={'text'}
          minHeight="100vh"
          overflowX="hidden"
        > */}
        {children}
        {/* </Box> */}
      </MotionBox>
    </chakra.main>
  );
};
