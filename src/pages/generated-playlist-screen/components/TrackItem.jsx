import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import AppImage from "../../../components/AppImage";

const TrackItem = ({ track, index, showReason = false }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(null);

  
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return "0:00";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoaded(true);
  };

  const artistString = Array.isArray(track.artists)
    ? track.artists.join(", ")
    : track.artists || "Unknown Artist";

  return (
    <div className="group">
      <div className="flex items-center gap-4 p-4 hover:bg-surface hover:bg-opacity-50 transition-colors duration-200">
        {/* Track Number */}
        <div className="w-6 text-center">
          <span className="text-sm text-text-disabled group-hover:hidden">
            {index}
          </span>
        </div>

        {/* Album Art */}
        <div className="relative w-12 h-12 flex-shrink-0">
          {!imageError ? (
            <AppImage
              src={track.albumArt}
              alt={`${track.album} cover`}
              className={`w-full h-full object-cover rounded-lg transition-opacity duration-200 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-surface rounded-lg flex items-center justify-center">
              <Icon name="Music" size={20} className="text-text-disabled" />
            </div>
          )}

          {!isImageLoaded && !imageError && (
            <div className="absolute inset-0 bg-surface rounded-lg animate-pulse" />
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-text-primary truncate">
                {track.name}
              </h3>
              <p className="text-sm text-text-secondary truncate">
                {artistString}
              </p>
              {track.album && (
                <p className="text-xs text-text-disabled truncate mt-1">
                  {track.album}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="text-sm text-text-disabled ml-4 flex-shrink-0">
              {formatDuration(track.duration)}
            </div>
          </div>

          {/* AI Recommendation Reason */}
          {showReason && track.why_recommended && (
            <div className="mt-3 pt-3 border-t border-border border-opacity-20">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-primary bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Brain" size={12} className="text-primary" />
                </div>
                <div className="text-xs text-text-secondary leading-relaxed">
                  <p>
                    <span className="font-medium text-primary">AI Pick:</span>{" "}
                    {track.why_recommended}
                  </p>
                
                  {track.originalRecommendation && 
                   (track.originalRecommendation.name !== track.name || 
                    track.originalRecommendation.artist !== artistString) && (
                    <p className="mt-1 text-text-disabled">
                      <span className="font-medium">Originally suggested:</span>{" "}
                      {track.originalRecommendation.name} by {track.originalRecommendation.artist}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="text-error text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default TrackItem;
