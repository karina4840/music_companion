import React from "react";
import Icon from "../../../components/AppIcon";

const ProgressIndicator = ({ currentStage, percentage, isProcessing }) => {
  const stages = [
    { id: "analyzing", label: "Analyzing", icon: "Search" },
    { id: "patterns", label: "Identifying Patterns", icon: "Brain" },
    { id: "creating", label: "Creating Playlist", icon: "Music" },
  ];

  const getStageStatus = (stageId) => {
    const currentIndex = stages.findIndex((stage) => stage.id === currentStage);
    const stageIndex = stages.findIndex((stage) => stage.id === stageId);

    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          AI Analysis Progress
        </h3>
        <span className="text-primary font-semibold">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-alt rounded-full h-2 mb-6">
        <div
          className="bg-gradient-to-r from-primary to-primary-hover h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const isActive = status === "active";
          const isCompleted = status === "completed";

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                isActive
                  ? "bg-primary-light bg-opacity-10 border-primary"
                  : isCompleted
                  ? "bg-success bg-opacity-10 border-success"
                  : "bg-surface border-border"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white"
                    : isCompleted
                    ? "bg-success text-white"
                    : "bg-surface-alt text-text-secondary"
                }`}
              >
                {isCompleted ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <Icon
                    name={stage.icon}
                    size={20}
                    className={isActive && isProcessing ? "animate-pulse" : ""}
                  />
                )}
              </div>

              <div className="flex-1">
                <h4
                  className={`font-medium ${
                    isActive || isCompleted
                      ? "text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {stage.label}
                </h4>
                {isActive && (
                  <p className="text-sm text-text-secondary mt-1">
                    Processing your music preferences...
                  </p>
                )}
                {isCompleted && (
                  <p className="text-sm text-success mt-1">
                    Completed successfully
                  </p>
                )}
              </div>

              {isActive && isProcessing && (
                <div className="w-5 h-5">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
