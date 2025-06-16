import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const codeVerifier = localStorage.getItem("code_verifier");

        if (!code || !codeVerifier) {
          throw new Error("Missing code or code verifier");
        }

        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: import.meta.env.VITE_REDIRECT_URI,
          client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          code_verifier: codeVerifier,
        });

        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });

        if (!response.ok) {
          throw new Error("Failed to get access token");
        }

        const data = await response.json();

        // Store both tokens
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        // Clear the code verifier as it's no longer needed
        localStorage.removeItem("code_verifier");

        navigate("/playlist-selection-screen");
      } catch (error) {
        console.error("Authentication error:", error);
        // Redirect to login on error
        navigate("/");
      }
    };

    fetchAccessToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-primary">Connecting to Spotify...</p>
      </div>
    </div>
  );
};

export default Callback;
