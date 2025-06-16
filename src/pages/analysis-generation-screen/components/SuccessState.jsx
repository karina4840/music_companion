import React from "react";
import Button from "components/ui/Button";

const SuccessState = ({ playlist, onViewPlaylist }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Your Playlist is Ready!
          </h1>
          <p className="text-muted mb-6">
            We've analyzed your music preferences and created a personalized
            playlist just for you.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="primary" onClick={onViewPlaylist}>
              View Playlist
            </Button>
          </div>
        </div>

        <div className="bg-surface-alt rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{playlist.name}</h2>
          <p className="text-muted mb-4">{playlist.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface rounded-lg p-4">
              <p className="text-sm text-muted">Tracks</p>
              <p className="text-lg font-semibold">{playlist.tracks.length}</p>
            </div>
            <div className="bg-surface rounded-lg p-4">
              <p className="text-sm text-muted">Duration</p>
              <p className="text-lg font-semibold">{playlist.duration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessState;
