import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // TODO: send to logging backend like Sentry
    console.error('Uncaught error:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-xl border border-border bg-surface text-text">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-text-muted mb-4">An unexpected error occurred. You can try reloading the app or contact support.</p>
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()}>Reload</Button>
            <Button variant="secondary" onClick={this.reset}>Dismiss</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;