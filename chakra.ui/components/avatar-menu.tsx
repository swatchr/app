// import { authEventChannel } from '@/utils/event-bus';
import { onPromise } from '@/utils/fns';
import {
  Avatar,
  Box,
  chakra,
  Link as ChLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
// import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import type { FC } from 'react';

const defaultLinks = [
  { label: 'home', href: '/' },
  { label: 'admin', href: '/admin' },
];

const ChNextLink = chakra(Link);

type AvatarMenuProps = {
  user?: {
    email?: string;
    image?: string;
  };
};

export const AvatarMenu: React.FC<AvatarMenuProps> = ({ user }) => {
  const { data: session, status } = useSession();

  return (
    <Box pos="fixed" top={9} right={6} zIndex="dropdown">
      <Menu
        placement="bottom-end"
        boundary="scrollParent"
        size="xs"
        closeOnSelect
      >
        {status !== 'loading' ? (
          <MenuButton
            as={Avatar}
            name={String(session?.user?.email ?? '')}
            src={session?.user?.image ?? ''}
            _hover={{ cursor: 'pointer', border: 'lg' }}
            loading="lazy"
            shadow="md"
          />
        ) : (
          <Spinner />
        )}
        <MenuList border="lg">
          <hr />
          <>
            {defaultLinks?.length
              ? defaultLinks?.map((link) => (
                  <MenuItem key={link.href} w="full" fontSize="sm">
                    <ChNextLink w="full" href={link.href} color="gray.200">
                      {link.label}
                    </ChNextLink>
                  </MenuItem>
                ))
              : null}
          </>
          <hr />
          <MenuItem
            as={Button}
            variant="unstyled"
            size="sm"
            onClick={onPromise(() => signIn('google'))}
            justifyContent="flex-start"
            rounded="none"
            my={1}
          >
            sign in
          </MenuItem>
          <MenuItem
            as={Button}
            variant="unstyled"
            size="sm"
            onClick={onPromise(() => signOut())}
            justifyContent="flex-start"
            _focusVisible={{ outline: 'none' }}
            _focus={{ outline: 'none' }}
            rounded="none"
            my={1}
          >
            sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};
