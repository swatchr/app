import {
  Box,
  Center,
  chakra,
  Container,
  Heading,
  HStack,
  Icon,
  Link as ChLink,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { LogoIcon } from '../../icons';

export function Disclaimer() {
  return (
    <Container mt={24} maxW="container.lg">
      <Heading as="h1" size="lg" mb={4}>
        Alpha Usage Disclaimer
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
        👋 We&apos;re thrilled to have you try out our app! We wanted to let you
        know that it&apos;s currently in the alpha stage and open for limited
        public preview. This means that while we&apos;ve been hard at work the
        app&apos;s not quite finished yet and may still have some rough edges.
      </chakra.p>
      <chakra.p mt={4}>
        As you try out the app, we invite you to share your thoughts, feedback,
        and ideas with us. Your input will help us shape the final version of
        the app and make it even better! Expect a public roadmap to be released
        shortly.
      </chakra.p>
      <chakra.p mt={4}>
        During this preview period, no user data will be saved, so anything you
        enter into the app won&apos;t be stored permanently. Don&apos;t worry,
        though – you can still play around with all the features and get a sense
        of what the app can do.
      </chakra.p>
      <chakra.p mt={4}>
        We want to be transparent with you about this app&apos;s state, so
        please keep in mind that it&apos;s provided &quot;AS IS&quot; without
        any warranty of any kind, express or implied. In no event shall the
        developers or contributors be liable for any direct, indirect,
        incidental, special, exemplary, or consequential damages arising out of
        the use or inability to use this app.
      </chakra.p>
      <chakra.p mt={4}>
        By using this app, you agree to these terms and those outlined in our{' '}
        <chakra.span as={Link} href="/policies/terms">
          terms and conditions
        </chakra.span>
        . We hope you enjoy trying out the app and look forward to hearing your
        thoughts!
      </chakra.p>
      <Center mt={12}>
        <Box boxSize={16}>
          <Icon as={LogoIcon} />
        </Box>
      </Center>
    </Container>
  );
}
