// src/pages/generated-playlist-screen/components/TrackList.jsx
import React, { useState } from "react";
import TrackItem from "./TrackItem";
import Icon from "../../../components/AppIcon";

const TrackList = ({
  tracks,
  isLoading,
  showRecommendationReasons = false,
}) => {
  const [showReasons, setShowReasons] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4 bg-surface bg-opacity-30 rounded-lg">
              <div className="w-12 h-12 bg-border bg-opacity-30 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-border bg-opacity-30 rounded w-3/4"></div>
                <div className="h-3 bg-border bg-opacity-20 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-border bg-opacity-20 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
          <Icon name="Music" size={32} className="text-text-disabled" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">
          No tracks found
        </h3>
        <p className="text-text-secondary">
          There was an issue loading the tracks for this playlist.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface bg-opacity-70 backdrop-blur-md border border-border border-opacity-20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border border-opacity-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-text-primary">
              Tracks ({tracks.length})
            </h2>
            {showRecommendationReasons && (
              <button
                onClick={() => setShowReasons(!showReasons)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  showReasons
                    ? "bg-primary text-white"
                    : "bg-surface border border-border hover:bg-surface-hover text-text-secondary"
                }`}
              >
                <Icon name="Brain" size={14} />
                AI Insights
              </button>
            )}
          </div>
          <div className="text-sm text-text-secondary">
            Duration: {calculateTotalDuration(tracks)}
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="divide-y divide-border divide-opacity-20">
        {tracks.map((track, index) => (
          <TrackItem
            key={track.id || index}
            track={track}
            index={index + 1}
            showReason={showRecommendationReasons && showReasons}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to calculate total duration
const calculateTotalDuration = (tracks) => {
  if (!tracks || tracks.length === 0) return "0:00";

  const totalMs = tracks.reduce((sum, track) => {
    return sum + (track.duration || 0);
  }, 0);

  const totalMinutes = Math.floor(totalMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default TrackList;
