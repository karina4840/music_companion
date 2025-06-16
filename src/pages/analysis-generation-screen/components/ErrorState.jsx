import React from "react";
import Header from "components/ui/Header";
import Button from "components/ui/Button";

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-red-500 bg-opacity-10 text-red-500 p-4 rounded-lg mb-4">
            <p className="font-medium">{error}</p>
          </div>
          <Button variant="primary" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
