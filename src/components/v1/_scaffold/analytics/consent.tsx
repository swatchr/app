// @NOTE: see the usage of @use-cookie-consent-react for insight
// @link: https://github.com/use-cookie-consent/use-cookie-consent

import { chakra } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { isBrowser } from '@/utils';
import { analytics, getConsent } from 'lib/analytics';
import { Banner } from './banner';

const ChNextLink = chakra(Link);

export const CookieConsent = () => {
  const [consent, setConsent] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const localConsent = getConsent();
    if (localConsent) document.body.style.overflow = 'visible';
    setConsent(localConsent);
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!consent) return;
    localStorage.setItem('app-consent', 'true');
  }, [consent]);

  const handleConsent = () => {
    if (isBrowser) document.body.style.overflow = 'visible';
    setConsent(true);
    analytics.track('consent', {
      category: 'consent-approval',
      label: 'consent',
      value: 1,
    });
  };

  return mounted && !consent ? (
    <Banner
      btnLabel="I Understand"
      handleConsent={handleConsent}
      consent={consent}
    >
      <chakra.p fontSize="sm" fontWeight="medium" lineHeight={1.4}>
        We use cookies to personalize content and provide you with a better
        browsing experience.
      </chakra.p>
      <chakra.p
        fontSize="xs"
        fontStyle="italic"
        color="gray.500"
        lineHeight={1.4}
        mt={1}
      >
        For more info visit out our
        <ChNextLink href="/policies/privacy" px={1} fontStyle="normal">
          Privacy Policy
        </ChNextLink>
        and
        <ChNextLink href="/policies/terms" px={1} fontStyle="normal">
          Terms and Conditions
        </ChNextLink>
      </chakra.p>
    </Banner>
  ) : null;
};
