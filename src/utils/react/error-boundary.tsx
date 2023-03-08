import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { debug as globalDebug, dev } from '@/utils';

const debug: boolean = globalDebug || true;
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    dev.error('Uncaught error:', { error, errorInfo }, debug);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error (boundary)</h1>;
    }

    return this.props.children;
  }
}
