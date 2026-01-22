"use client";

import { Button } from "@/components/ui/button";

const LEVELS = {
  dialog: {
    container: "py-8 text-center",
    title: "Details Unavailable",
    message: "An error occurred. Try closing and reopening this dialog.",
  },
  component: {
    container: "p-4 rounded-md bg-destructive/10 text-destructive",
    title: "Something went wrong",
    message: "Please try again or refresh the page.",
  },
  page: {
    container: "flex min-h-screen items-center justify-center p-4",
    title: "Something went wrong",
    message: "We apologize for the inconvenience. Please try refreshing.",
  },
} as const;

type ErrorLevel = keyof typeof LEVELS;

export interface FallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

interface ErrorFallbackProps extends FallbackProps {
  level?: ErrorLevel;
  onClose?: () => void;
  className?: string;
}

export function ErrorFallback({
  level = "component",
  error,
  resetErrorBoundary,
  onClose,
  className = "",
}: ErrorFallbackProps) {
  const config = LEVELS[level];

  const handleAction = () => {
    if (level === "page") {
      window.location.reload();
    } else if (resetErrorBoundary) {
      resetErrorBoundary();
    } else if (onClose) {
      onClose();
    }
  };

  const hasAction = level === "page" || resetErrorBoundary || onClose;
  const buttonText = level === "page" ? "Refresh Page" : level === "dialog" ? "Close" : "Retry";
  const buttonVariant = level === "dialog" ? "outline" : "default";

  return (
    <div className={`${config.container} ${className}`}>
      <div className={level === "page" ? "text-center" : ""}>
        <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{config.message}</p>
        {process.env.NODE_ENV === "development" && error && (
          <pre className="text-xs text-left bg-muted p-2 rounded mb-4 overflow-auto max-h-32">
            {error.message}
          </pre>
        )}
        {hasAction && (
          <Button onClick={handleAction} variant={buttonVariant}>
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
