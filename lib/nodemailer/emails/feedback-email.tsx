import { Box, Button, Heading, Link, Text } from '@chakra-ui/react';

import { partialMaskEmail } from '@/utils';
import { EmailWrapper } from './email-wrapper';

export function feedbackEmail({
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
          Hey!👋 Thanks for providing your feedback
        </Heading>
        <Text mb={4}>
          We&aposll keep you updated on this issue. You&aposll receive updates
          at {partialMaskEmail(email)}
        </Text>
      </Box>
    </EmailWrapper>
  );
}

export function adminFeedbackEmail({
  subject,
  email,
}: {
  subject: string;
  email?: string;
}) {
  return (
    <EmailWrapper subject={subject}>
      <Box p={4} borderWidth={1} borderRadius={4} bg="#000">
        <Heading as="h1" size="xl" mb={4}>
          New Feedback Submitted
        </Heading>
        {email ? <Text mb={4}>from: {partialMaskEmail(email)}</Text> : null}
        {subject}
      </Box>
    </EmailWrapper>
  );
}
