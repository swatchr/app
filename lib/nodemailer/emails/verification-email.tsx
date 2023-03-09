import { Box, Button, Heading, Link, Text } from '@chakra-ui/react';

import { partialMaskEmail } from '@/utils';
import { EmailWrapper } from './email-wrapper';

export function verificationEmail({
  subject,
  email,
}: {
  subject: string;
  email: string;
}) {
  return (
    <EmailWrapper subject={subject}>
      <Box p={4} borderWidth={1} borderRadius={4} bg="#000">
        <Heading as="h1" size="xl" mb={4}>
          Hey!👋 Thanks for joining the Swatchr Beta!
        </Heading>
        <Heading as="h2" size="lg" mb={4}>
          Let&aposs get you started.
        </Heading>
        <Text mb={4}>
          An account is pending for the following email:{' '}
          {partialMaskEmail(email)}
        </Text>
        <Heading as="h2" size="md" mb={4}>
          Verify Your Email
        </Heading>
        <Text mb={4}>
          Please click the button below to verify your email address.
        </Text>
        <Link
          as={Button}
          colorScheme="blue"
          variant="outline"
          size="lg"
          href="https://swatchr.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Verify Email
        </Link>
      </Box>
    </EmailWrapper>
  );
}
