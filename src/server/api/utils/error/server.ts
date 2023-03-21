import { PrismaClientKnownRequestError } from '@prisma/client/runtime/data-proxy';
import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { ZodError } from 'zod';

import type { DefaultErrorShape } from '@trpc/server';

export const formatTRPCError = (error: TRPCError, shape: DefaultErrorShape) => {
  return {
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
          ? error.cause.flatten()
          : null,
    },
  };
};

export const handleServerError = (
  e: Error | any,
  code: TRPCError['code'],
  msg?: string
) => {
  const defaultMsg = 'An unexpected error occurred, please try again later.';
  console.error(defaultMsg, e);
  throw new TRPCError({
    code: code ?? 'INTERNAL_SERVER_ERROR',
    message: msg || e?.message || defaultMsg,
    cause: e,
  });
};

export function trpcPrismaErrorHandler1(error: any) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2001') {
      throw new trpc.TRPCError({
        code: 'NOT_FOUND',
        message: '🗄 Could not find record.',
      });
    }
    if (error.code === 'P2002') {
      throw new trpc.TRPCError({
        code: 'CONFLICT',
        message: '🗄 Record Already Exists.',
      });
    }
    if (error.code === 'P2015') {
      throw new trpc.TRPCError({
        code: 'NOT_FOUND',
        message: '🗄 Related Record NOT FOUND.',
      });
    }
    if (error.code === 'P2024') {
      throw new trpc.TRPCError({
        code: 'TIMEOUT',
        message: '🗄 Operation timed out.',
      });
    }
    if (error.code === 'P2025') {
      throw new trpc.TRPCError({
        code: 'NOT_FOUND',
        message: '🗄 Record NOT FOUND.',
      });
    }
    throw new trpc.TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: '🗄 Something went wrong',
    });
  }
  console.error('NOT TRPC ERROR', error);
}

type ErrorMessage = {
  code:
    | 'CONFLICT'
    | 'INTERNAL_SERVER_ERROR'
    | 'PARSE_ERROR'
    | 'BAD_REQUEST'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'METHOD_NOT_SUPPORTED'
    | 'TIMEOUT'
    | 'PRECONDITION_FAILED'
    | 'PAYLOAD_TOO_LARGE'
    | 'TOO_MANY_REQUESTS'
    | 'CLIENT_CLOSED_REQUEST';
  message: string;
};

export const ERROR_MESSAGES: Record<string, ErrorMessage> = {
  P2001: {
    code: 'NOT_FOUND',
    message: '🗄 Record NOT_FOUND.',
  },
  P2002: {
    code: 'CONFLICT',
    message: '🗄 Record Already Exists.',
  },
  P2025: {
    code: 'CONFLICT',
    message: '🗄 Record NOT FOUND.',
  },
  default: {
    code: 'INTERNAL_SERVER_ERROR',
    message: '🗄 Something went wrong',
  },
};

export function trpcPrismaErrorHandler(error: any) {
  if (error instanceof PrismaClientKnownRequestError) {
    const errorMessage = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.default;
    throw new trpc.TRPCError(errorMessage!);
  }
  console.error('NOT PRISMA ERROR', error);
}
