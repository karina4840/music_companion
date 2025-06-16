import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center">
            <Icon name="Music" size={48} className="text-primary" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h2>
        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={handleGoHome}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <Icon name="Home" size={20} />
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;