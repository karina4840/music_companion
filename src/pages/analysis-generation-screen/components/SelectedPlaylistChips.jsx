import React from "react";
import Icon from "../../../components/AppIcon";

const SelectedPlaylistChips = ({ playlists, onRemove }) => {
  if (!playlists || playlists.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Selected Playlists
      </h3>
      <div className="flex flex-wrap gap-3">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3 group hover:border-primary transition-colors duration-200"
          >
            {/* Playlist Image */}
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
              {playlist.image ? (
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/assets/images/no_image.png";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Icon name="Music" size={24} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Playlist Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-text-primary font-medium truncate">
                {playlist.name}
              </h4>
              <p className="text-text-secondary text-sm truncate">
                by {playlist.owner || "Unknown"}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(playlist.id)}
              className="text-text-secondary hover:text-error transition-colors duration-200 flex-shrink-0"
              aria-label={`Remove ${playlist.name}`}
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedPlaylistChips;
