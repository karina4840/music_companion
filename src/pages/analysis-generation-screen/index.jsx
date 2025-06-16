import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import SelectedPlaylistChips from "./components/SelectedPlaylistChips";
import ProgressIndicator from "./components/ProgressIndicator";
import InputField from "./components/InputField";
import ActionButton from "./components/ActionButton";
import ErrorMessage from "./components/ErrorMessage";
import SuccessState from "./components/SuccessState";
import {
  analyzePlaylistPreferences,
  generatePersonalizedPlaylist,
} from "../../services/playlistAnalysisService";

const AnalysisGenerationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedPlaylists, setSelectedPlaylists] = useState(
    location.state?.selectedPlaylists || []
  );
  const [playlistName, setPlaylistName] = useState("");
  const [playlistNameError, setPlaylistNameError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState("analyzing");
  const [percentage, setPercentage] = useState(0);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  useEffect(() => {
    if (!selectedPlaylists?.length) {
      navigate("/playlist-selection-screen");
    }
  }, [selectedPlaylists, navigate]);

  const handleRemovePlaylist = (playlistId) => {
    setSelectedPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  };

  const handlePlaylistNameChange = (e) => {
    const value = e.target.value;
    setPlaylistName(value);

    if (playlistNameError) {
      setPlaylistNameError("");
    }
  };

  const validatePlaylistName = () => {
    if (playlistName.trim().length === 0) {
      setPlaylistNameError("Playlist name is required");
      return false;
    }
    if (playlistName.trim().length < 3) {
      setPlaylistNameError("Playlist name must be at least 3 characters");
      return false;
    }
    return true;
  };

  const updateProgress = (newPercentage, stage) => {
    setPercentage(newPercentage);
    setCurrentStage(stage);
  };

  const performAIAnalysisAndGeneration = async () => {
    try {
      // Stage 1: Analyzing playlists (0-30%)
      updateProgress(5, "analyzing");
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateProgress(15, "analyzing");
      const analysis = await analyzePlaylistPreferences(selectedPlaylists);
      setAnalysisResults(analysis);

      updateProgress(30, "analyzing");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Stage 2: Identifying patterns (30-70%)
      updateProgress(35, "patterns");
      await new Promise((resolve) => setTimeout(resolve, 800));

      updateProgress(50, "patterns");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateProgress(70, "patterns");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Stage 3: Creating playlist (70-100%)
      updateProgress(75, "creating");
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateProgress(85, "creating");
      const playlist = await generatePersonalizedPlaylist(
        analysis,
        playlistName || "AI Generated Mix",
        selectedPlaylists
      );

      updateProgress(95, "creating");
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateProgress(100, "creating");
      setGeneratedPlaylist(playlist);
      setIsComplete(true);
    } catch (error) {
      console.error("AI Analysis Error:", error);

      let errorType = "analysis";
      let errorMessage =
        "Failed to analyze your playlists. Our AI service may be temporarily unavailable.";

      if (
        error.message.includes("API key") ||
        error.message.includes("authentication")
      ) {
        errorType = "api_key";
        errorMessage =
          "OpenAI API configuration error. Please check your API key.";
      } else if (
        error.message.includes("rate limit") ||
        error.message.includes("quota")
      ) {
        errorType = "rate_limit";
        errorMessage =
          "API rate limit exceeded. Please try again in a few minutes.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorType = "network";
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      setError({
        type: errorType,
        message: errorMessage,
      });

      setIsProcessing(false);
      setPercentage(0);
    }
  };

  const handleGeneratePlaylist = async () => {
    if (!validatePlaylistName()) {
      return;
    }

    if (selectedPlaylists.length === 0) {
      setError({
        type: "validation",
        message: "Please select at least one playlist to analyze.",
      });
      return;
    }

    if (
      !import.meta.env.VITE_OPENAI_API_KEY ||
      import.meta.env.VITE_OPENAI_API_KEY === "your_vite_openai_api_key"
    ) {
      setError({
        type: "api_key",
        message:
          "OpenAI API key is not configured. Please add your API key to the .env file.",
      });
      return;
    }

    setError(null);
    setIsProcessing(true);
    setPercentage(0);
    setCurrentStage("analyzing");

    await performAIAnalysisAndGeneration();
  };

  const handleRetry = () => {
    setError(null);
    setIsProcessing(false);
    setPercentage(0);
    setCurrentStage("analyzing");
    setIsComplete(false);
    setAnalysisResults(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleViewPlaylist = () => {
    navigate("/generated-playlist-screen", {
      state: {
        playlist: generatedPlaylist,
        analysisResults: analysisResults,
      },
    });
  };

  const handleBackToSelection = () => {
    navigate("/playlist-selection-screen");
  };

  useEffect(() => {
    return () => {
      setIsProcessing(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header variant="compact" />
      {isComplete && generatedPlaylist && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SuccessState
            playlist={generatedPlaylist}
            onViewPlaylist={handleViewPlaylist}
          />
        </div>
      )}
      {!isComplete && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <ActionButton
              onClick={handleBackToSelection}
              variant="ghost"
              icon="ArrowLeft"
              className="mb-4"
            >
              Back to Selection
            </ActionButton>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Generate Your AI Playlist
            </h1>
            <p className="text-text-secondary">
              Our AI will analyze your selected playlists using OpenAI to create
              a personalized mix just for you.
            </p>
          </div>

          {/* Selected Playlists */}
          <SelectedPlaylistChips
            playlists={selectedPlaylists}
            onRemove={handleRemovePlaylist}
          />

          {/* Error Message */}
          <ErrorMessage
            error={error}
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />

          {/* Progress Indicator */}
          {isProcessing && (
            <ProgressIndicator
              currentStage={currentStage}
              percentage={percentage}
              isProcessing={isProcessing}
            />
          )}

          {/* Playlist Name Input */}
          {!isProcessing && (
            <div className="mb-8">
              <InputField
                value={playlistName}
                onChange={handlePlaylistNameChange}
                placeholder="Enter a name for your new playlist"
                maxLength={100}
                label="Playlist Name"
                error={playlistNameError}
                required={true}
              />
            </div>
          )}

          {/* Generate Button */}
          {!isProcessing && (
            <div className="flex justify-center">
              <ActionButton
                onClick={handleGeneratePlaylist}
                disabled={selectedPlaylists.length === 0}
                icon="Sparkles"
                className="text-lg px-8 py-4"
              >
                Generate AI Playlist
              </ActionButton>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center mt-8">
              <p className="text-text-secondary">
                Please wait while our AI analyzes your music preferences and
                creates your personalized playlist...
              </p>
              {analysisResults && (
                <div className="mt-4 p-4 bg-surface bg-opacity-50 rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong>Found patterns:</strong>{" "}
                    {analysisResults.dominant_genres?.slice(0, 3).join(", ")} •{" "}
                    {analysisResults.energy_level} energy
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisGenerationScreen;
