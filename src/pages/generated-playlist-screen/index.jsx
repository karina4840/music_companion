import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/ui/Header";
import PlaylistMetadata from "./components/PlaylistMetadata";
import TrackList from "./components/TrackList";
import ActionButtons from "./components/ActionButtons";
import LoadingState from "./components/LoadingState";
import ErrorMessage from "./components/ErrorMessage";
import { generateMusicInsights } from "../../services/playlistAnalysisService";
import { createPlaylist, addTracksToPlaylist } from "../../services/spotify";

const GeneratedPlaylistScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [insights, setInsights] = useState(null);
  const [shareStatus, setShareStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback mock playlist data for when state is not available
  const fallbackPlaylist = {
    id: "ai-playlist-fallback",
    name: "Your AI Generated Mix",
    description: `A personalized playlist created using advanced AI analysis of your music preferences. This mix combines your favorite genres and moods into a cohesive listening experience.`,
    coverImage: "",
    createdAt: new Date().toISOString(),
    trackCount: 15,
    duration: "1h 8m",
    tracks: [
      {
        id: "track-001",
        name: "Midnight City",
        artists: ["M83"],
        album: "Hurry Up, We're Dreaming",
        duration: 244000,
        albumArt:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&crop=center",
        why_recommended:
          "Matches your preference for atmospheric electronic music with emotional depth",
      },
      {
        id: "track-002",
        name: "Breathe Me",
        artists: ["Sia"],
        album: "Colour the Small One",
        duration: 268000,
        albumArt: "",
        why_recommended:
          "Selected for its introspective lyrics and ambient production style",
      },
      {
        id: "track-003",
        name: "Holocene",
        artists: ["Bon Iver"],
        album: "Bon Iver, Bon Iver",
        duration: 337000,
        albumArt:
          "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop&crop=center",
        why_recommended:
          "Complements your taste for indie folk with ethereal vocal arrangements",
      },
      {
        id: "track-004",
        name: "Teardrop",
        artists: ["Massive Attack"],
        album: "Mezzanine",
        duration: 329000,
        albumArt:
          "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop&crop=center",
        why_recommended:
          "Chosen for its trip-hop elements that align with your chill vibes preference",
      },
      {
        id: "track-005",
        name: "Intro",
        artists: ["The xx"],
        album: "xx",
        duration: 133000,
        albumArt:
          "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop&crop=center",
        why_recommended:
          "Perfect minimalist indie that matches your sophisticated taste",
      },
    ],
  };

  useEffect(() => {
    const loadPlaylistData = async () => {
      try {
        if (!location.state?.fromHistory) {
          setIsLoading(true);
        }
        setError(null);

        // Get playlist data from navigation state or use fallback
        const playlistData = location.state?.playlist;
        const analysisData = location.state?.analysisResults;

        // Only simulate loading delay for new playlists
        if (!location.state?.fromHistory) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }

        if (playlistData) {
          setPlaylist(playlistData);

          // Save to history if it's a new playlist
          if (!location.state?.regenerate && !location.state?.fromHistory) {
            const history = JSON.parse(
              localStorage.getItem("savedPlaylists") || "[]"
            );
            const newPlaylist = {
              ...playlistData,
              id: `playlist-${Date.now()}`, // Generate unique ID
              generatedAt: new Date().toISOString(),
              imageUrl: playlistData.coverImage || "",
              tracks: playlistData.tracks.map((track) => ({
                ...track,
                albumArt: track.albumArt || "",
              })),
            };

            // Add to beginning of history
            history.unshift(newPlaylist);
            localStorage.setItem("savedPlaylists", JSON.stringify(history));
          }
        }

        // Generate insights if we have analysis results
        if (
          analysisData &&
          import.meta.env.VITE_OPENAI_API_KEY &&
          import.meta.env.VITE_OPENAI_API_KEY !== "your_vite_openai_api_key"
        ) {
          try {
            const generatedInsights = await generateMusicInsights(analysisData);
            setInsights(generatedInsights);
          } catch (insightError) {
            console.warn("Failed to generate insights:", insightError);
            // Continue without insights
          }
        }
      } catch (err) {
        console.error("Error loading playlist:", err);
        setError({
          type: "generation",
          message: "Failed to load your generated playlist. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylistData();
  }, [location.state]);

  const handleSavePlaylist = async (playlistData) => {
    try {
      setIsLoading(true);

      console.log(
        "Original playlist data:",
        JSON.stringify(playlistData, null, 2)
      );
      console.log("Tracks data:", JSON.stringify(playlistData.tracks, null, 2));

      // Create new playlist in Spotify
      const newPlaylist = await createPlaylist(
        playlistData.name,
        playlistData.description || "Generated by AI Playlist Creator"
      );

      // Get valid track URIs
      const trackUris = playlistData.tracks
        .map((track) => {
          console.log("Processing track:", JSON.stringify(track, null, 2));

          // If track has a URI, use it
          if (track.uri && track.uri.startsWith("spotify:track:")) {
            console.log("Using existing URI:", track.uri);
            return track.uri;
          }

          console.log("No valid URI found for track:", track.name);
          return null;
        })
        .filter((uri) => uri); // Remove any null/undefined values

      console.log("Final track URIs:", trackUris);

      if (trackUris.length === 0) {
        throw new Error(
          "No valid Spotify tracks found to add to playlist. Please try regenerating the playlist."
        );
      }

      // Add tracks to the playlist
      await addTracksToPlaylist(newPlaylist.id, trackUris);

      setShareStatus({
        type: "success",
        message: `Playlist saved to your Spotify account! ${trackUris.length} of ${playlistData.tracks.length} tracks were added.`,
      });

      // Save to history
      const history = JSON.parse(
        localStorage.getItem("playlistHistory") || "[]"
      );
      const newHistory = [
        {
          ...playlistData,
          spotifyId: newPlaylist.id,
          createdAt: new Date().toISOString(),
          savedToSpotify: true,
          tracksAdded: trackUris.length,
          totalTracks: playlistData.tracks.length,
        },
        ...history,
      ];
      localStorage.setItem("playlistHistory", JSON.stringify(newHistory));

      return {
        success: true,
        message: `Playlist saved to your Spotify account! ${trackUris.length} of ${playlistData.tracks.length} tracks were added.`,
        playlistUrl: newPlaylist.external_urls.spotify,
      };
    } catch (error) {
      console.error("Save playlist error:", error);
      setShareStatus({
        type: "error",
        message:
          error.message ||
          "Failed to save playlist to Spotify. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackShare = async (url, text) => {
    try {
      if ("clipboard" in navigator && window.isSecureContext) {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareStatus({
          type: "success",
          message: "Playlist details copied to clipboard!",
        });
      } else {
        // Even more basic fallback - create a text area and select
        const textArea = document.createElement("textarea");
        textArea.value = `${text}\n${url}`;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand("copy");
          setShareStatus({
            type: "success",
            message: "Playlist details copied to clipboard!",
          });
        } catch (err) {
          setShareStatus({
            type: "error",
            message: "Unable to share playlist. Please copy the URL manually.",
          });
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error("Fallback share failed:", error);
      setShareStatus({
        type: "error",
        message: "Unable to share playlist. Please copy the URL manually.",
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);

    // Retry loading with fallback data
    setTimeout(() => {
      setPlaylist(fallbackPlaylist);
      setIsLoading(false);
    }, 1000);
  };

  const handleGoBack = () => {
    navigate("/analysis-generation-screen");
  };

  const handleCreateAnother = () => {
    navigate("/playlist-selection-screen");
  };

  if (isLoading) {
    return <LoadingState message="Finalizing your AI-generated playlist..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header variant="compact" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage
            type={error.type}
            message={error.message}
            onRetry={handleRetry}
            onGoBack={handleGoBack}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header variant="compact" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Generation
            </button>
          </div>

          {/* Share Status Message */}
          {shareStatus && (
            <div
              className={`p-4 rounded-lg border ${
                shareStatus.type === "success"
                  ? "bg-green-500 bg-opacity-10 border-green-500 border-opacity-20 text-green-500"
                  : shareStatus.type === "error"
                  ? "bg-red-500 bg-opacity-10 border-red-500 border-opacity-20 text-red-500"
                  : "bg-blue-500 bg-opacity-10 border-blue-500 border-opacity-20 text-blue-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    shareStatus.type === "success"
                      ? "bg-green-500 bg-opacity-20"
                      : shareStatus.type === "error"
                      ? "bg-red-500 bg-opacity-20"
                      : "bg-blue-500 bg-opacity-20"
                  }`}
                >
                  {shareStatus.type === "success" && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {shareStatus.type === "error" && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  {shareStatus.type === "info" && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <p className="font-medium">{shareStatus.message}</p>
              </div>
            </div>
          )}

          {/* AI Insights */}
          {insights && (
            <div className="bg-surface bg-opacity-70 backdrop-blur-md border border-border border-opacity-20 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Your Music Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {insights.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs">🎵</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary text-sm">
                        {insight.title}
                      </h4>
                      <p className="text-text-secondary text-xs mt-1">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-text-secondary text-sm italic">
                {insights.overall_summary}
              </p>
            </div>
          )}

          {/* Playlist Metadata */}
          <PlaylistMetadata playlist={playlist} />

          {/* Action Buttons */}
          <ActionButtons
            playlist={playlist}
            onSave={handleSavePlaylist}
            onCreateAnother={handleCreateAnother}
          />

          {/* Track List with AI Recommendations */}
          <TrackList
            tracks={playlist.tracks}
            isLoading={false}
            showRecommendationReasons={true}
          />
        </div>
      </main>
    </div>
  );
};

export default GeneratedPlaylistScreen;
