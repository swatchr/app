import { Flex, Heading, HStack, Link, Text } from '@chakra-ui/react';

export type DocLink = {
  documentation?: string;
  t3docs?: string;
  git?: string;
  studio?: string;
  tutorial?: string;
  templates?: string;
  chocui?: string;
  spotify?: string;
  discord?: string;
  other?: string;
};

type DocCardProps = {
  name: string;
  description: string;
  links?: DocLink[];
};

export const DocCard: React.FC<DocCardProps> = ({
  name,
  description,
  links,
}) => {
  return (
    <Flex
      as={Link}
      w="full"
      flexDirection="column"
      justifyContent="center"
      p="1.5rem"
      transitionDuration="500ms"
      border="2px solid"
      borderColor="gray.500"
      borderRadius="0.25rem"
      boxShadow="var(--tw-shadow)"
      href={links?.length && (links[0]?.documentation || links[0]?.git)}
      isExternal
    >
      <Heading
        as="h2"
        m={0}
        fontSize="1.125 rem"
        lineHeight="1.75rem"
        fontWeight={400}
      >
        {name}
      </Heading>
      <Text as="p" m={0} fontSize="0.875rem" lineHeight="1.25rem">
        {description}
      </Text>

      <HStack mt="0.75rem" gap={2} align="center">
        {links?.map(mapDocLinks)}
      </HStack>
    </Flex>
  );
};

export function mapDocs(entry: DocCardProps) {
  return (
    <DocCard
      key={entry?.name}
      name={entry?.name}
      description={entry?.description}
      links={entry?.links}
    />
  );
}

export function mapDocLinks(link: DocLink) {
  const [objArr] = Object.entries(link);
  if (!objArr?.length) return;
  return (
    <Link
      key={objArr[0]}
      isExternal
      fontSize="0.875rem"
      lineHeight="1.25rem"
      textDecorationLine="underline"
      textDecorationStyle="dotted"
      textUnderlineOffset="2px"
      color="link"
      href={objArr[1]}
    >
      {objArr[0]}
    </Link>
  );
}
