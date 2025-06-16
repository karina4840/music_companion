import React from "react";
import Icon from "../../../components/AppIcon";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-error bg-opacity-20 rounded-full flex items-center justify-center">
          <Icon name="AlertCircle" size={16} color="var(--color-error)" />
        </div>
        <div>
          <h4 className="text-error font-medium text-sm">Connection Failed</h4>
          <p className="text-error text-opacity-80 text-xs">{message}</p>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="w-full bg-error bg-opacity-20 hover:bg-opacity-30 text-error font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-surface"
      >
        <Icon name="RotateCcw" size={16} color="var(--color-error)" />
        <span>Try Again</span>
      </button>
    </div>
  );
};

export default ErrorMessage;
