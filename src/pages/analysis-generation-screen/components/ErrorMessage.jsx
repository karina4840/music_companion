import React from "react";
import Icon from "../../../components/AppIcon";

const ErrorMessage = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  const getErrorIcon = () => {
    switch (error.type) {
      case "spotify":
        return "Wifi";
      case "analysis":
        return "AlertTriangle";
      default:
        return "AlertCircle";
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case "spotify":
        return "Spotify Connection Error";
      case "analysis":
        return "Analysis Failed";
      default:
        return "Something Went Wrong";
    }
  };

  return (
    <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Icon name={getErrorIcon()} size={20} className="text-error" />
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-error mb-1">{getErrorTitle()}</h4>
          <p className="text-sm text-text-secondary mb-3">{error.message}</p>

          <div className="flex items-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm font-medium text-error hover:text-error underline focus:outline-none"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm font-medium text-text-secondary hover:text-text-primary focus:outline-none"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors duration-200"
            aria-label="Dismiss error"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
