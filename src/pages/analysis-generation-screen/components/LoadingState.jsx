import React from "react";
import Header from "components/ui/Header";

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">
            Analyzing your playlists and generating a personalized mix...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
