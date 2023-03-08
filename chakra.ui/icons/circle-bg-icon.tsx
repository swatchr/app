import { Box } from '@chakra-ui/react';
import { CustomIcon } from './custom-icon';

export const CircleBgIcon: React.FC<{ icon: string; bg: string }> = ({
  icon,
  bg,
}) => {
  return (
    <Box
      w="36"
      _before={{
        content: '""',
        w: '32',
        h: '32',
        bg,
        position: 'absolute',
        zIndex: -1,
        borderRadius: 'full',
      }}
    >
      <CustomIcon icon={icon} size={24} m={4} fill="gray.600" p={2} />
    </Box>
  );
};
