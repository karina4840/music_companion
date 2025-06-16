import React from "react";
import Icon from "../../../components/AppIcon";

const LoadingState = ({ message = "Generating your playlist..." }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated Music Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center">
              <div className="animate-pulse">
                <Icon name="Music" size={48} className="text-primary" />
              </div>
            </div>

            {/* Animated Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary border-opacity-20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-primary border-opacity-40 animate-ping animation-delay-200"></div>
          </div>
        </div>

        {/* Loading Message */}
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          {message}
        </h2>

        <p className="text-text-secondary mb-8">
          Our AI is analyzing your music preferences and creating the perfect
          playlist for you.
        </p>

        {/* Progress Indicators */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin">
              <Icon name="Loader2" size={20} className="text-primary" />
            </div>
            <span className="text-text-secondary text-sm">
              Processing your music taste...
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-surface-alt rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary-hover h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 p-4 bg-surface rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" size={16} className="text-warning mt-1" />
            <div className="text-left">
              <p className="text-text-secondary text-sm">
                <span className="font-medium text-text-primary">
                  Did you know?
                </span>{" "}
                Our AI analyzes over 50 musical features including tempo,
                energy, and mood to create your perfect playlist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
