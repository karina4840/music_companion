import React from "react";

const PlaylistCoverGrid = ({ tracks }) => {
  // Get up to 4 tracks with valid images
  const validTracks = tracks
    .filter((track) => track.albumArt || track.image)
    .slice(0, 4);

  // If no valid tracks, return a placeholder
  if (validTracks.length === 0) {
    return (
      <div className="w-full h-full bg-surface flex items-center justify-center">
        <span className="text-text-secondary">No Image</span>
      </div>
    );
  }

  // Determine grid layout based on number of tracks
  const getGridClasses = () => {
    switch (validTracks.length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2";
      case 4:
        return "grid-cols-2";
      default:
        return "grid-cols-2";
    }
  };

  return (
    <div className={`grid ${getGridClasses()} gap-0.5 w-full h-full`}>
      {validTracks.map((track, index) => {
        // For 3 tracks, make the first one span 2 columns
        const isFirstTrack = index === 0;
        const isThreeTracks = validTracks.length === 3;

        return (
          <div
            key={track.id}
            className={`relative overflow-hidden ${
              isFirstTrack && isThreeTracks ? "col-span-2" : ""
            }`}
          >
            <img
              src={track.albumArt || track.image}
              alt={`${track.name} album art`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/assets/images/no_image.png";
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistCoverGrid;
