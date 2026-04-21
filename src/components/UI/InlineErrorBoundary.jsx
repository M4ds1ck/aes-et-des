/*
 * AUDIT LOG - InlineErrorBoundary.jsx
 * [BUG] Step-specific rendering errors crashed the whole app -> FIXED (localized error boundary).
 */
import React from 'react';

export default class InlineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="panel rounded-3xl p-5 text-sm text-white/65">
          This step failed to render. Try another step or refresh the page.
          <div className="mt-2 text-xs text-white/40">{this.state.error?.message || 'Unknown error'}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
