"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-headline-sm text-on-surface mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-on-surface-variant/60 mb-6">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false })}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try again
              </Button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
