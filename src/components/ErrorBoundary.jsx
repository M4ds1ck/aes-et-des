/*
 * AUDIT LOG — ErrorBoundary.jsx
 * [BUG] Console error logging violated clean console requirement -> FIXED (removed).
 */
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-3xl border border-cyber-red/40 bg-cyber-red/10 p-6 text-sm leading-7 text-cyber-red">
            <div className="mb-3 font-display text-xl uppercase tracking-[0.18em] text-white">Runtime Error</div>
            <div>The interface crashed instead of rendering. Reload the page once.</div>
            <div className="mt-2 break-words text-white/80">{this.state.error?.message || 'Unknown error'}</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
