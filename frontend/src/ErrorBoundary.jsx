import React from 'react';
import { STRINGS } from './constants';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark text-white p-4">
          <div className="bg-brand-surface p-8 rounded-2xl shadow-2xl border border-red-800 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">{STRINGS.OOPS}</h1>
            <p className="text-gray-300 mb-6">{error?.message || "An unexpected error occurred."}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-brand-accent text-brand-dark rounded-xl font-bold hover:bg-emerald-400 transition-colors"
            >
              {STRINGS.TRY_AGAIN}
            </button>
          </div>
        </div>
      );
    }
    return children;
  }
}

export default ErrorBoundary;
