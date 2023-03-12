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

export const TermsAndConditions = () => {
  return (
    <Container mt={24} maxW="container.lg">
      <Heading as="h1" size="lg" mb={4}>
        Terms and Conditions
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
        Welcome to Swatchr! By using our web app, you agree to these Terms and
        Conditions, which govern your use of our app. Please read them carefully
        before using our app.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>Using our app</strong>
      </chakra.p>
      <chakra.p>
        You must be at least 18 years old to use any premium portion of our app.
        By using our app, you agree to use it only for lawful purposes and in a
        way that does not infringe on anyone else&apos;s rights or restrict or
        inhibit anyone else&apos;s use and enjoyment of our app.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>Intellectual property</strong>
      </chakra.p>
      <chakra.p>
        The content and design of our app are protected by copyright, trademark,
        and other intellectual property laws. You may not copy, reproduce,
        distribute, modify, or create derivative works of any part of our app
        without our prior written consent.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>Limitation of liability</strong>
      </chakra.p>
      <chakra.p>
        We are not liable for any direct, indirect, incidental, special, or
        consequential damages arising out of or in connection with your use of
        our app, including but not limited to any errors or omissions in any
        content or information, or any loss or damage of any kind incurred as a
        result of the use of any content or information posted, transmitted, or
        otherwise made available via our app.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>Changes to these Terms and Conditions</strong>
      </chakra.p>
      <chakra.p>
        We may update these Terms and Conditions from time to time, but
        we&apos;ll always let our members and subscribers know when we do. We
        encourage you to check back regularly to stay up-to-date on any changes.
      </chakra.p>
      <chakra.p mt={4}>
        <strong>Your acceptance of these terms</strong>
      </chakra.p>
      <chakra.p>
        By using our app, you agree to the terms of these Terms and Conditions.
        If you don&apos;t agree with any part of these terms, please don&apos;t
        use our app. If you have any questions about these terms or anything
        else related to Swatchr, please don&apos;t hesitate to{' '}
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
