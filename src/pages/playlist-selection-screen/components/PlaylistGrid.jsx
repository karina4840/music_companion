import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PlaylistCard = ({ playlist, isSelected, onSelect }) => {
  return (
    <div 
      className={`bg-surface rounded-lg border transition-all duration-200 cursor-pointer group hover:scale-105 ${
        isSelected 
          ? 'border-primary ring-2 ring-primary ring-opacity-20' :'border-border hover:border-text-tertiary'
      }`}
      onClick={() => onSelect(playlist)}
    >
      {/* Playlist Cover */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={playlist.image}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Selection Checkbox */}
        <div className="absolute top-3 right-3">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected 
              ? 'bg-primary border-primary' :'bg-surface bg-opacity-80 border-border backdrop-blur-sm'
          }`}>
            {isSelected && (
              <Icon name="Check" size={14} color="white" />
            )}
          </div>
        </div>
      
      </div>

      {/* Playlist Info */}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {playlist.name}
        </h3>
        <p className="text-sm text-text-secondary mb-2 line-clamp-2">
          {playlist.description}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-text-disabled">
          <span className="flex items-center gap-1">
            <Icon name="Music" size={12} />
            {playlist.trackCount} tracks
          </span>
          <span className="flex items-center gap-1">
            <Icon name="User" size={12} />
            {playlist.owner}
          </span>
        </div>
      </div>
    </div>
  );
};

const PlaylistGrid = ({ playlists, selectedPlaylists, onPlaylistSelect }) => {
  if (playlists.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
          <Icon name="Music" size={32} className="text-text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No playlists found
        </h3>
        <p className="text-text-secondary">
          Try adjusting your search or check your Spotify connection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-40 ">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          isSelected={selectedPlaylists.some(p => p.id === playlist.id)}
          onSelect={onPlaylistSelect}
        />
      ))}
    </div>
  );
};

export default PlaylistGrid;