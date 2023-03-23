import { useToast } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

import type { StringObj } from '@/types';
import type { ToastProps } from '@chakra-ui/react';
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
  children: JSX.Element;
}> = (props) => {
  const toast = useToast();

  // falsy values get stringified so we have to check for an actual message
  const falsyStrings = ['null', 'false', 'undefined', ''];
  const hasMessage = falsyStrings.every((str) => str !== props.message);
  const toastIdRef = useRef<string | null>(null);

  useEffect(() => {
    subscribe('show-toast', ({ detail }: any) => {
      if (toastIdRef.current === detail?.id) {
        toast.close(toastIdRef.current!);
        return (toastIdRef.current = null);
      }

      const toastConfig: ToastProps = {
        status: detail?.status || 'info',
        title: detail?.title || 'Notification',
        description: detail?.description || '',
        duration: 6000,
        isClosable: true,
        position: 'top-right',
      };

      if (!toastIdRef.current) {
        toastIdRef.current = detail?.id;
        toast(toastConfig);
      } else {
        if (toastIdRef.current === detail?.id) return;
        toast.close(toastIdRef.current);
        toast(toastConfig);
      }
      return () => {
        toast.closeAll();
        toastIdRef.current = null;
      };
    });

    return () => {
      unsubscribe('show-toast', () => null);
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

  return props.children;
};
