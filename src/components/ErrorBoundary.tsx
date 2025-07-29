"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center text-red-700">
            <h2 className="text-xl font-bold mb-2">⚠️ Something went wrong</h2>
            <p className="mb-4">
              Don&apos;t worry, you can still vote for other contestants!
            </p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
