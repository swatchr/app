import {
  Button,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

type ContextMenuOptions = {
  label: string;
  onClick: () => void;
}[];

export function ContextMenu({
  items,
  // isMultiDimensional = false,
  groups,
  children,
}: {
  items: ContextMenuOptions | ContextMenuOptions[];
  // isMultiDimensional?: boolean,
  groups?: string[]; // only required for multidimensional arrays
  children: React.ReactNode;
}) {
  const isMultiDimensional = Array.isArray(items[0]);
  return (
    <Menu
      size={'sm'}
      placement="top-end"
      closeOnSelect
      closeOnBlur
      isLazy
      matchWidth
    >
      <MenuButton as={Button} variant="unstyled" minW={0} >
        {children}
      </MenuButton>
      <MenuList zIndex={100}>
        {isMultiDimensional
          ? items.map((item, index) => (
              <MenuGroup title={groups![index]} key={index}>
                {(item as ContextMenuOptions).map((subItem, subIndex) => (
                  <MenuItem
                    key={subIndex}
                    onClick={subItem.onClick}
                    fontSize="xs"
                  >
                    {subItem.label}
                  </MenuItem>
                ))}
              </MenuGroup>
            ))
          : (items as ContextMenuOptions).map((subItem, subIndex) => (
              <MenuItem key={subIndex} onClick={subItem.onClick}>
                {subItem.label}
              </MenuItem>
            ))}
      </MenuList>
    </Menu>
  );
}
