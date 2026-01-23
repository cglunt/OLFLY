import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen w-full bg-[#0c0c1d] flex items-center justify-center text-white">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Something went wrong.</p>
            <p className="text-white/70 text-sm">Refresh the page or try again shortly.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
