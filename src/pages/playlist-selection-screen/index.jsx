import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import SearchFilter from "./components/SearchFilter";
import PlaylistGrid from "./components/PlaylistGrid";
import ActionFooter from "./components/ActionFooter";
import LoadingState from "./components/LoadingState";
import Icon from "../../components/AppIcon";
import { getUserPlaylists, getUserProfile } from "services/spotify";
import { isAuthenticated, redirectToSpotifyAuth } from "services/auth";

const PlaylistSelectionScreen = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated()) {
        setPlaylists([]);
        setFilteredPlaylists([]);
        setUserProfile(null);
        return;
      }

      const playlistsData = await getUserPlaylists();
      const userData = await getUserProfile();
      const mappedPlaylists = playlistsData.map((pl) => ({
        id: pl.id,
        name: pl.name,
        description: pl.description || "",
        image: pl.images && pl.images.length > 0 ? pl.images[0].url : "",
        trackCount: pl.tracks.total,
        isPublic: pl.public,
        owner: pl.owner.display_name || "Unknown",
      }));

      setPlaylists(mappedPlaylists);
      setFilteredPlaylists(mappedPlaylists);
      setUserProfile(userData);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(
        err.message || "Failed to load data from Spotify. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPlaylists(playlists);
      return;
    }

    const searchTerms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0);

    const filtered = playlists.filter((playlist) => {
      const name = playlist.name.toLowerCase();
      const description = (playlist.description || "").toLowerCase();
      const owner = (playlist.owner || "").toLowerCase();

      // Check if all search terms are found in any of the fields
      return searchTerms.every(
        (term) =>
          name.includes(term) ||
          description.includes(term) ||
          owner.includes(term)
      );
    });

    setFilteredPlaylists(filtered);
  };

  const handleSelectAll = () => {
    if (selectedPlaylists.length === filteredPlaylists.length) {
      setSelectedPlaylists([]);
    } else {
      setSelectedPlaylists(filteredPlaylists);
    }
  };

  const handlePlaylistSelect = (playlist) => {
    if (!playlist || !playlist.id) {
      console.error('Invalid playlist object:', playlist);
      return;
    }

    setSelectedPlaylists((prev) => {
      const isSelected = prev.some((p) => p.id === playlist.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== playlist.id);
      } else {
        // Get the complete playlist data from the playlists array
        const fullPlaylist = playlists.find(p => p.id === playlist.id);
        if (!fullPlaylist) {
          console.error('Could not find full playlist data for:', playlist.id);
          return prev;
        }
        return [...prev, fullPlaylist];
      }
    });
  };

  const handleAnalyze = () => {
    if (selectedPlaylists.length === 0) {
      setError("Please select at least one playlist to continue.");
      return;
    }
    navigate("/analysis-generation-screen", {
      state: { selectedPlaylists },
    });
  };

  const handleSpotifyConnect = () => {
    redirectToSpotifyAuth();
  };

  const handleRetry = () => {
    fetchUserData();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header variant="default" />

      {!isAuthenticated() ? (
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            {/* App Logo and Branding */}
            <div className="mb-8 text-center">
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
              <h2 className="text-xl font-semibold text-text-primary mb-4 text-center">
                Discover Music That Matches Your Mood
              </h2>
              <div className="space-y-3 text-text-secondary">
                <div className="flex items-center space-x-3   justify-center">
                  <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                    <Icon name="Brain" size={16} color="var(--color-primary)" />
                  </div>
                  <span>AI analyzes your listening habits</span>
                </div>
                <div className="flex items-center space-x-3 justify-center">
                  <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                    <Icon
                      name="Sparkles"
                      size={16}
                      color="var(--color-primary)"
                    />
                  </div>
                  <span>Creates personalized playlists</span>
                </div>
                <div className="flex items-center space-x-3 justify-center">
                  <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                    <Icon name="Heart" size={16} color="var(--color-primary)" />
                  </div>
                  <span>Learns from your preferences</span>
                </div>
              </div>
            </div>

            {/* Connection Section */}
            <div className="space-y-6">
              <div className="bg-surface bg-opacity-70 backdrop-blur-md border border-border border-opacity-20 rounded-xl p-6">
                <h3 className="text-lg text-center font-medium text-text-primary mb-3">
                  Connect Your Spotify Account
                </h3>
                <p className="text-text-secondary text-center text-sm mb-6">
                  We'll analyze your playlists and listening history to create
                  personalized recommendations just for you.
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error rounded-lg">
                    <p className="text-error">{error}</p>
                    <button
                      onClick={handleRetry}
                      className="mt-2 text-sm text-error hover:text-error-hover underline"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                <button
                  onClick={handleSpotifyConnect}
                  className="w-full bg-spotify hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Icon name="Spotify" size={24} />
                  <span>Connect with Spotify</span>
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="text-xs text-text-disabled text-center">
                <p>
                  By connecting your Spotify account, you agree to our{" "}
                  <button className="text-primary hover:text-primary-hover underline">
                    Privacy Policy
                  </button>{" "}
                  and{" "}
                  <button className="text-primary hover:text-primary-hover underline">
                    Terms of Service
                  </button>
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Select Your Playlists
              </h1>
              <p className="text-text-secondary">
                Choose the playlists you want to analyze for personalized
                recommendations.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error rounded-lg">
                <p className="text-error">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 text-sm text-error hover:text-error-hover underline"
                >
                  Try Again
                </button>
              </div>
            )}

            <div className="mb-6">
              <SearchFilter
                onSearch={handleSearch}
                totalPlaylists={filteredPlaylists.length}
                selectedCount={selectedPlaylists.length}
                onSelectAll={handleSelectAll}
              />
            </div>

            <PlaylistGrid
              playlists={filteredPlaylists}
              selectedPlaylists={selectedPlaylists}
              onPlaylistSelect={handlePlaylistSelect}
            />

            <ActionFooter
              selectedCount={selectedPlaylists.length}
              onAnalyze={handleAnalyze}
            />
          </div>
        </main>
      )}
    </div>
  );
};

export default PlaylistSelectionScreen;
