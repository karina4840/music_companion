import React from "react";
import Icon from "../../../components/AppIcon";

const ActionFooter = ({ selectedCount, onAnalyze }) => {
  const isDisabled = selectedCount === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Selection Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={16} className="text-primary" />
              </div>
              <span className="text-text-primary font-medium">
                {selectedCount} playlist{selectedCount !== 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>

            {selectedCount > 0 && (
              <div className="hidden sm:block text-sm text-text-secondary">
                Ready for AI analysis
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={onAnalyze}
            disabled={isDisabled}
            className={`flex items-center gap-2 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface ${
              isDisabled
                ? "bg-surface-alt text-text-disabled cursor-not-allowed"
                : "bg-primary hover:bg-primary-hover text-white focus:ring-primary hover:scale-105 active:scale-95"
            }`}
          >
            <Icon
              name="Zap"
              size={20}
              className={isDisabled ? "text-text-disabled" : "text-white"}
            />
            <span>Analyze Selected</span>
            {!isDisabled && (
              <Icon name="ArrowRight" size={16} className="text-white" />
            )}
          </button>
        </div>

        {/* Minimum Selection Notice */}
        {selectedCount === 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Info" size={14} />
            <span>Select at least one playlist to continue</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionFooter;
