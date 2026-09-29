import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ASPIRE ErrorBoundary] Captured error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--canvas, #f8fafc)',
          color: 'var(--brand-900, #0f172a)',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'var(--surface, #ffffff)',
            borderRadius: '20px',
            padding: '28px 24px',
            maxWidth: '380px',
            width: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            border: '1px solid var(--border, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertCircle size={30} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--brand-900, #0f172a)' }}>
              Something Went Wrong
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #64748b)', margin: 0, lineHeight: 1.5 }}>
              The screen encountered an unexpected state. Tap reload to refresh the dashboard smoothly.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--brand-900, #1e3a8a)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)',
                marginTop: '8px'
              }}
            >
              <RefreshCw size={16} />
              <span>Reload Screen</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
