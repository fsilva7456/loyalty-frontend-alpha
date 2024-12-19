import React from 'react';

export default function ErrorDisplay({ error, onRetry, onDismiss }) {
  if (!error) return null;

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">!</div>
        <div className="error-message">{error}</div>
      </div>
      <div className="error-actions">
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="secondary-button"
          >
            Dismiss
          </button>
        )}
        {onRetry && (
          <button 
            onClick={onRetry}
            className="primary-button"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}