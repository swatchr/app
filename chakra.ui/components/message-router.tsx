import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { isClient, ONE_SECOND_MS } from '@/utils';

type MessageRouterProps = {
  asPath: string;
};

type PrismaCustomError = {
  code: string;
  message: string;
  path: string[];
};

export const MessageRouter: React.FC<MessageRouterProps> = ({ asPath }) => {
  const router = useRouter();
  const [error, setError] = useState<string | boolean | undefined>(false);
  const [success, setSuccess] = useState<string | boolean | undefined>(false);
  const toast = useToast();

  useEffect(() => {
    if (isClient) {
      const isError: boolean = asPath.includes('?error=');
      const isSecondaryError: boolean = asPath.includes('&error=');
      const isSuccess: boolean = asPath.includes('?success=');
      if (isError) {
        const [basepath, message] = asPath.split('?error=');
        console.error('file: message-router.tsx | line 29 | message', message);
        let isJson = false;
        try {
          isJson = !!JSON.parse(message || '');
          if (isJson && Array.isArray(JSON.parse(message || ''))) {
            // NOTE: errors from prisma may be an array when multiple errors are triggered.

            if (message) {
              const parsedMsg = JSON.parse(message) as PrismaCustomError[];
              setError(parsedMsg[0]?.message);
            }
          }
        } catch (error) {
          isJson = false;
        }

        if (!isJson && typeof message === 'string') {
          setError(String(message));
        }
        void router.replace(basepath || '/');
      } else if (isSecondaryError) {
        const [basepath, message] = asPath.split('&error=');
        if (typeof message === 'string') {
          // if (message === 'CredentialsSignin') {
          //   setError('Please register first.');
          // } else {
          //   setError(String(message));
          // }
          setError(String(message));
        }
        void router.replace(basepath || '/');
      } else if (isSuccess) {
        const [basepath, message] = asPath.split('?success=');
        setSuccess(String(message));
        void router.replace(basepath || '/');
      }
    }
  }, [asPath, router]);

  useEffect(() => {
    if (!error && !success) return;

    toast({
      title: error ? 'Error' : 'Success',
      description: error ? error : success,
      status: error ? 'error' : 'success',
      duration: 9 * ONE_SECOND_MS,
      position: 'top-right',
      isClosable: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, success]);

  return null;
};
