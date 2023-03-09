import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

import type { StringObj } from '@/types';
import type { FC, ReactNode } from 'react';

import { getParams, subscribe, unsubscribe } from '@/utils';

export type ToastStatusOptions =
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'loading'
  | undefined;

const messageMap: StringObj = {
  CredentialsSignin: {
    message: 'Please sign up or provide valid credentials',
  },
};

export function getToastStatus(asPath: string) {
  const { success, error } = getParams(['error', 'success'], asPath);
  console.log('🚀 | file: auto-toast.tsx:25 | status:', success ?? error);
  const status: ToastStatusOptions = success
    ? 'success'
    : error
    ? 'error'
    : undefined;

  return { status, success, error };
}

export const AutoToast: FC<{
  status: ToastStatusOptions;
  message: string;
  icon?: ReactNode;
}> = (props): null => {
  const toast = useToast();

  // falsy values get stringified so we have to check for an actual message
  const falsyStrings = ['null', 'false', 'undefined', ''];
  const hasMessage = falsyStrings.every((str) => str !== props.message);

  useEffect(() => {
    subscribe('show-toast', ({ detail }: any) => {
      toast({
        status: detail?.status,
        title: detail?.title || '',
        description: detail?.description || '',
        duration: 6000,
        isClosable: true,
        position: 'top-right',
      });
    });

    return () => {
      unsubscribe('show-toast', () => {});
    };
  }, [toast]);

  useEffect(() => {
    if (!hasMessage) return;
    toast({
      status: props.status,
      title: props.status,
      description: String(messageMap[props.message]?.message ?? props.message),
      duration: 6000,
      isClosable: true,
      position: 'top-right',
    });
    () => null;
  }, [hasMessage, props.message, props.status, toast]);

  return null;
};
