import { getValidAccessToken, isAuthenticated } from "./auth";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

async function spotifyFetch(endpoint, options = {}) {
  try {
    if (!isAuthenticated()) {
      throw new Error("Please connect your Spotify account to continue");
    }

    const accessToken = await getValidAccessToken();

    if (!accessToken) {
      throw new Error("Your Spotify session has expired. Please log in again.");
    }

    const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Spotify API error response:", error);
      throw new Error(
        error.error?.message || "Failed to communicate with Spotify"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Spotify API error:", error);
    throw error;
  }
}

export async function getUserPlaylists() {
  try {
    if (!isAuthenticated()) {
      return [];
    }
    const data = await spotifyFetch("/me/playlists?limit=50");
    return data.items || [];
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    throw new Error(
      error.message || "Failed to fetch your playlists. Please try again."
    );
  }
}

export async function getUserProfile() {
  try {
    if (!isAuthenticated()) {
      return null;
    }
    return await spotifyFetch("/me");
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(
      error.message || "Failed to fetch your profile. Please try again."
    );
  }
}

export async function createPlaylist(name, description = "") {
  try {
    if (!isAuthenticated()) {
      throw new Error(
        "Please connect your Spotify account to create playlists"
      );
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error(
        "Could not get your Spotify user ID. Please try logging in again."
      );
    }

    const playlist = await spotifyFetch(`/users/${userId}/playlists`, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        public: false,
      }),
    });

    return playlist;
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw new Error(
      error.message || "Failed to create playlist. Please try again."
    );
  }
}

export async function addTracksToPlaylist(playlistId, trackUris) {
  try {
    if (!isAuthenticated()) {
      throw new Error("Please connect your Spotify account to add tracks");
    }

    if (!trackUris || !Array.isArray(trackUris) || trackUris.length === 0) {
      throw new Error("No valid track URIs provided");
    }

    // Validate track URIs
    const validTrackUris = trackUris.filter(
      (uri) =>
        uri && typeof uri === "string" && uri.startsWith("spotify:track:")
    );

    if (validTrackUris.length === 0) {
      throw new Error("No valid track URIs provided");
    }

    const response = await spotifyFetch(`/playlists/${playlistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({
        uris: validTrackUris,
      }),
    });

    return response;
  } catch (error) {
    console.error("Error adding tracks to playlist:", error);
    throw new Error(
      error.message || "Failed to add tracks to playlist. Please try again."
    );
  }
}

const getCurrentUserId = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error("Not authenticated with Spotify");
    }

    const response = await spotifyFetch("/me");
    return response.id;
  } catch (error) {
    console.error("Error getting user ID:", error);
    throw error;
  }
};
