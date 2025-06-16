import React from "react";
import Icon from "../../../components/AppIcon";

const ErrorMessage = ({
  type = "general",
  message,
  onRetry,
  onGoBack,
  showRetry = true,
  showGoBack = true,
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case "playback":
        return {
          icon: "PlayCircle",
          title: "Playback Error",
          defaultMessage:
            "Unable to play this track. This might be due to regional restrictions or the track being unavailable.",
          color: "warning",
        };
      case "save":
        return {
          icon: "AlertTriangle",
          title: "Save Failed",
          defaultMessage:
            "Failed to save playlist to Spotify. Please check your connection and try again.",
          color: "error",
        };
      case "network":
        return {
          icon: "Wifi",
          title: "Connection Error",
          defaultMessage:
            "Unable to connect to Spotify. Please check your internet connection.",
          color: "error",
        };
      case "generation":
        return {
          icon: "Zap",
          title: "Generation Failed",
          defaultMessage:
            "Failed to generate playlist. Our AI encountered an issue while analyzing your music preferences.",
          color: "error",
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Something went wrong",
          defaultMessage: "An unexpected error occurred. Please try again.",
          color: "error",
        };
    }
  };

  const config = getErrorConfig();
  const displayMessage = message || config.defaultMessage;

  const getColorClasses = () => {
    switch (config.color) {
      case "warning":
        return "bg-warning bg-opacity-10 border-warning text-warning";
      case "error":
      default:
        return "bg-error bg-opacity-10 border-error text-error";
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6">
      <div className="text-center max-w-md mx-auto">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center border ${getColorClasses()}`}
          >
            <Icon name={config.icon} size={32} />
          </div>
        </div>

        {/* Error Title */}
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {config.title}
        </h3>

        {/* Error Message */}
        <p className="text-text-secondary mb-6 leading-relaxed">
          {displayMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary flex items-center gap-2"
            >
              <Icon name="RefreshCw" size={16} />
              Try Again
            </button>
          )}

          {showGoBack && onGoBack && (
            <button
              onClick={onGoBack}
              className="btn-secondary flex items-center gap-2"
            >
              <Icon name="ArrowLeft" size={16} />
              Go Back
            </button>
          )}
        </div>

        {/* Additional Help */}
        {type === "playback" && (
          <div className="mt-6 p-4 bg-surface-alt rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={16} className="text-info mt-1" />
              <div className="text-left">
                <p className="text-text-secondary text-sm">
                  <span className="font-medium text-text-primary">Tip:</span>{" "}
                  Some tracks may not be available for preview due to licensing
                  restrictions. You can still save the playlist to Spotify to
                  listen to the full tracks.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === "save" && (
          <div className="mt-6 p-4 bg-surface-alt rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={16} className="text-info mt-1" />
              <div className="text-left">
                <p className="text-text-secondary text-sm">
                  <span className="font-medium text-text-primary">
                    Troubleshooting:
                  </span>{" "}
                  Make sure you're connected to Spotify and have granted the
                  necessary permissions to create playlists.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
