import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const PlaylistMetadata = ({ playlist }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="bg-surface rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Playlist Cover */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 rounded-xl overflow-hidden bg-surface-alt">
            <Image
              src={playlist.coverImage}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Playlist Info */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-text-secondary text-sm font-medium uppercase tracking-wide">
              AI Generated Playlist
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
            {playlist.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-4">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              <span className="text-sm">
                Created {formatDate(playlist.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Music" size={16} />
              <span className="text-sm">{playlist.trackCount} tracks</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              <span className="text-sm">{playlist.duration}</span>
            </div>
          </div>

          {playlist.description && (
            <p className="text-text-secondary text-base leading-relaxed mb-4">
              {playlist.description}
            </p>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" size={16} className="text-primary" />
              <span className="text-sm text-text-secondary">
                Generated based on your listening habits
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistMetadata;
