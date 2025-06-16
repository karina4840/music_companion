import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-surface-alt rounded-full"></div>
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
