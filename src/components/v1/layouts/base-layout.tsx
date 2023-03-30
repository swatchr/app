import { onIdle } from '@analytics/activity-utils';
import { chakra, useDisclosure, VStack } from '@chakra-ui/react';
import { SkipNavContent } from '@chakra-ui/skip-nav';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { useEffect } from 'react';

import type { OGImage } from '@/utils/seo';

import { ALPHA_FEEDBACK_KEY, isClient, ONE_SECOND_MS } from '@/utils';
import { SEOConfig } from '@/utils/seo';
import { CHModal } from 'chakra.ui';
import { analytics } from 'lib/analytics';
import { AlphaFeedbackForm } from '../cta';
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
    // used to trigger feedback form
    if (!isClient) return;

    const opts = {
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
      <CHModal
        title="Alpha Preview User Feedback"
        isOpen={isOpen}
        onClose={onClose}
        hasSubmit
        allowClose
      >
        <AlphaFeedbackForm {...{ isOpen, onOpen, onClose }} />
      </CHModal>
      <PreviewDisclaimer />
      <VStack position="relative">
        <chakra.main flex={1} bg="bg" w="full" overflow="hidden">
          <SkipNavContent />
          {children}
        </chakra.main>
        <MadeFooter />
      </VStack>
    </>
  );
};
