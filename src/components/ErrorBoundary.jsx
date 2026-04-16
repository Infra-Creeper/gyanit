import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[gyan.it] Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <div className={styles.icon}>⚠️</div>
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred. Please refresh the page.</p>
          <button className={styles.btn} onClick={() => window.location.reload()}>
            Refresh Page
          </button>
          {import.meta.env.DEV && (
            <pre className={styles.debug}>{this.state.error?.toString()}</pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
