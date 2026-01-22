"use client";

import React from "react";
import { logger } from "@/lib/utils/core/logger";
import { ErrorFallback, type FallbackProps } from "./ErrorFallback";

type FallbackRender = (props: FallbackProps) => React.ReactNode;

interface Props {
  children: React.ReactNode;
  /** Static fallback UI */
  fallback?: React.ReactNode;
  /** Render function that receives error and reset function */
  fallbackRender?: FallbackRender;
  /** Component-level styling: dialog, component, or page */
  level?: "dialog" | "component" | "page";
  /** Called when error is caught - use for error reporting */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Called when error boundary resets */
  onReset?: () => void;
  /** When these values change, error boundary resets automatically */
  resetKeys?: unknown[];
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("ErrorBoundary caught:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys } = this.props;
    if (!this.state.hasError || !resetKeys) return;

    const prevResetKeys = prevProps.resetKeys ?? [];
    const hasChanged = resetKeys.some((key, i) => key !== prevResetKeys[i]);

    if (hasChanged) {
      this.reset();
    }
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, fallbackRender, level = "component" } = this.props;

    if (hasError) {
      const fallbackProps: FallbackProps = {
        error: error ?? undefined,
        resetErrorBoundary: this.reset,
      };

      if (fallbackRender) {
        return fallbackRender(fallbackProps);
      }

      if (fallback !== undefined) {
        return fallback;
      }

      return <ErrorFallback level={level} {...fallbackProps} />;
    }

    return children;
  }
}
