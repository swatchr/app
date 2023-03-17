import {
  Box,
  Center,
  chakra,
  Container,
  Heading,
  HStack,
  Icon,
  Link,
} from '@chakra-ui/react';

import { LogoIconNew } from '../../icons/swatchr/logo-icon-new';

export const PrivacyPolicy = () => {
  return (
    <Container mt={24} maxW="container.lg">
      <Heading as="h1" size="lg" mb={4}>
        Privacy Policy
      </Heading>
      <HStack w="full" justifyContent="flex-end" pr={9} pb={3}>
        <chakra.small
          textStyle="stat"
          textAlign="right"
          as={Link}
          href="/"
          textDecor="underline"
        >
          &gt; Back Home
        </chakra.small>
      </HStack>
      <chakra.p>
        At Swatchr, we&apos;re committed to protecting your privacy and ensuring
        that you feel comfortable using our app. In this Privacy Policy, we
        explain how we collect, use, and protect your personal information.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>What information do we collect?</strong>
      </chakra.p>
      <chakra.p>
        When you use our app, we collect some basic information about you, like
        your name, email address, and IP address. We use this information to
        provide you with a personalized experience and to improve our app. We
        also use cookies and storage items to keep track of your preferences and
        usage patterns.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>How do we use your information?</strong>
      </chakra.p>
      <chakra.p>
        We use your personal information to provide you with the best possible
        experience when using our app. This includes things like customizing
        your color palette preferences, improving our app based on your
        feedback, and understanding how our app is being used so we can make it
        even better.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>Data security</strong>
      </chakra.p>
      <chakra.p>
        We take the security of your personal information very seriously. We use
        industry-standard security measures to protect your information from
        unauthorized access, disclosure, modification, or destruction. While we
        can&apos;t guarantee that your information will always be 100% secure,
        we do our best to make sure that it is.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>Retention of data</strong>
      </chakra.p>
      <chakra.p>
        We will only retain your personal information for as long as necessary
        to fulfill the purposes for which it was collected, or as required by
        law. We will securely delete your personal information when it is no
        longer needed.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>Changes to this Privacy Policy</strong>
      </chakra.p>
      <chakra.p>
        We may update this Privacy Policy from time to time, but we&apos;ll
        always let you know when we do. We encourage you to check back regularly
        to stay up-to-date on any changes.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>Your acceptance of these terms</strong>
      </chakra.p>
      <chakra.p>
        By using our app, you agree to the terms of this Privacy Policy. If you
        don&apos;t agree with any part of this policy, please don&apos;t use our
        app. If you have any questions about this policy or anything else
        related to Swatchr, please don&apos;t hesitate to{' '}
        <Link href="mailto:support@swatchr.app" textDecor="underline">
          get in touch with us
        </Link>
        .
      </chakra.p>
      <Center mt={12}>
        <Icon as={LogoIconNew} boxSize="2rem" />
      </Center>
    </Container>
  );
};
