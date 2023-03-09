// import { authEventChannel } from '@/utils/event-bus';
import { onPromise } from '@/utils/fns';
import {
  Avatar,
  Box,
  Button,
  chakra,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const defaultLinks = [{ label: 'home', href: '/' }];
const protectedRoutes = [{ label: 'admin', href: '/admin' }];

const ChNextLink = chakra(Link);

function routeLink(link: { label: string; href: string }) {
  return (
    <MenuItem key={link.href} w="full" fontSize="sm">
      <ChNextLink w="full" href={link.href} color="gray.200">
        {link.label}
      </ChNextLink>
    </MenuItem>
  );
}

function MenuItemButton({
  label,
  onClick,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <MenuItem
      as={Button}
      variant="unstyled"
      size="sm"
      onClick={onClick}
      justifyContent="flex-start"
      rounded="none"
      my={1}
    >
      {label}
    </MenuItem>
  );
}

export const AvatarMenu: React.FC = () => {
  const { data: session, status } = useSession();
  const isUser = status !== 'loading' && !!session?.user;
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
          {defaultLinks?.length ? defaultLinks?.map(routeLink) : null}
          {isUser ? protectedRoutes?.map(routeLink) : null}
          {isUser ? (
            <MenuItemButton
              label="sign out"
              onClick={onPromise(() => signOut())}
            />
          ) : (
            <MenuItemButton
              label="sign in"
              onClick={onPromise(() => signIn('google'))}
            />
          )}
        </MenuList>
      </Menu>
    </Box>
  );
};
