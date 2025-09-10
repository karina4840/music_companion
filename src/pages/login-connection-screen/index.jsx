import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import AuthButton from './components/AuthButton';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Icon from '../../components/AppIcon';
import { redirectToSpotifyAuth } from 'services/auth';

const LoginConnectionScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSpotifyConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Begin redirect to Spotify OAuth
      redirectToSpotifyAuth();
    } catch (err) {
      setError('Failed to connect to Spotify. Please try again.');
      setIsLoading(false); // If redirect fails
    }
  };

  const handleRetry = () => {
    setError(null);
    handleSpotifyConnect();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header variant="default" />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* App Logo and Branding */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center shadow-lg">
                <Icon name="Music" size={32} color="white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome to MoodTunes
            </h1>
            <p className="text-text-secondary text-lg">
              Your AI-powered music companion
            </p>
          </div>

          {/* Value Proposition */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Discover Music That Matches Your Mood
            </h2>
            <div className="space-y-3 text-text-secondary">
              {[
                { icon: "Brain", text: "AI analyzes your listening habits" },
                { icon: "Sparkles", text: "Creates personalized playlists" },
                { icon: "Heart", text: "Learns from your preferences" },
              ].map(({ icon, text }) => (
                <div key={icon} className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                    <Icon name={icon} size={16} color="var(--color-primary)" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Section */}
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center bg-surface bg-opacity-70 backdrop-blur-md border border-border border-opacity-20 rounded-xl p-6">
              <h3 className="text-lg font-medium text-text-primary mb-3">
                Connect Your Spotify Account
              </h3>
              <p className="text-text-secondary text-sm mb-6">
                We'll analyze your playlists and listening history to create personalized recommendations just for you.
              </p>

              {/* Loading State */}
              {isLoading && (
                <div className="mb-6">
                  <LoadingSpinner />
                  <p className="text-text-secondary text-sm mt-3">
                    Connecting to Spotify...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="mb-6">
                  <ErrorMessage message={error} onRetry={handleRetry} />
                </div>
              )}

              {/* Auth Button */}
              {!isLoading && (
                <AuthButton onClick={handleSpotifyConnect} disabled={isLoading} />
              )}
            </div>

            {/* Privacy Notice */}
            <div className="text-xs text-text-disabled">
              <p>
                By connecting your Spotify account, you agree to our{' '}
                <button className="text-primary hover:text-primary-hover underline">
                  Privacy Policy
                </button>{' '}
                and{' '}
                <button className="text-primary hover:text-primary-hover underline">
                  Terms of Service
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginConnectionScreen;
