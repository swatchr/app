import { PrismaClientKnownRequestError } from '@prisma/client/runtime/data-proxy';
import * as trpc from '@trpc/server';

export function trpcPrismaErrorHandler1(error: any) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new trpc.TRPCError({
        code: 'CONFLICT',
        message: '🗄 Record Already Exists.',
      });
    }
    if (error.code === 'P2025') {
      throw new trpc.TRPCError({
        code: 'CONFLICT',
        message: '🗄 Record NOT FOUND.',
      });
    }
    throw new trpc.TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: '🗄 Something went wrong',
    });
  }
  console.error('test', error);
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

const ERROR_MESSAGES: Record<string, ErrorMessage> = {
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
  console.error('test', error);
}
