// import { authEventChannel } from '@/utils/event-bus';
import { onPromise } from '@/utils/fns';
import {
  Avatar,
  Box,
  chakra,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
// import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

import type { FC } from 'react';

const defaultLinks = [{ label: 'home', href: '/' }];

const ChNextLink = chakra(Link);

type AvatarMenuProps = {
  user?: {
    email?: string;
    image?: string;
  };
};

export const AvatarMenu: React.FC<AvatarMenuProps> = ({ user }) => {
  return (
    <Box pos="fixed" top={6} right={6} zIndex="dropdown">
      <Menu placement="bottom-end" boundary="scrollParent" closeOnSelect>
        {status !== 'loading' ? (
          <MenuButton
            as={Avatar}
            name={String(user?.email ?? '')}
            src={user?.image ?? ''}
            _hover={{ cursor: 'pointer', border: 'lg' }}
            loading="lazy"
            outline="2px solid"
            outlineColor="brand.400"
          />
        ) : (
          <Spinner />
        )}
        <MenuList border="lg">
          <hr />
          <>
            {defaultLinks?.length
              ? defaultLinks?.map((link) => (
                  <MenuItem key={link.href}>
                    <ChNextLink href={link.href}>{link.label}</ChNextLink>
                  </MenuItem>
                ))
              : null}
          </>
        </MenuList>
      </Menu>
    </Box>
  );
};
