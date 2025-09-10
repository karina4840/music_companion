import { getValidAccessToken } from "./auth";
import openai from "./openaiClient";

export async function analyzePlaylistPreferences(selectedPlaylists) {
  try {
    const playlistDescriptions = selectedPlaylists
      .map(
        (playlist) =>
          `${playlist.name}: ${playlist.description} (${playlist.trackCount} tracks)`
      )
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a music analysis expert. Analyze user's playlist preferences and identify musical patterns, moods, genres, and listening habits. Provide insights that can be used to create personalized music recommendations.`,
        },
        {
          role: "user",
          content: `Analyze these playlists and identify the user's musical preferences:\n\n${playlistDescriptions}\n\nPlease provide a comprehensive analysis of their music taste, including preferred genres, moods, energy levels, and any patterns you can identify.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "playlist_analysis_response",
          schema: {
            type: "object",
            properties: {
              dominant_genres: {
                type: "array",
                items: { type: "string" },
              },
              mood_preferences: {
                type: "array",
                items: { type: "string" },
              },
              energy_level: {
                type: "string",
                enum: ["low", "medium", "high", "varied"],
              },
              listening_patterns: {
                type: "array",
                items: { type: "string" },
              },
              user_persona: {
                type: "string",
              },
              recommended_artists: {
                type: "array",
                items: { type: "string" },
              },
              playlist_themes: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "dominant_genres",
              "mood_preferences",
              "energy_level",
              "user_persona",
            ],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.7,
      max_tokens: 800,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing playlist preferences:", error);
    throw new Error(
      "Failed to analyze your music preferences. Please try again."
    );
  }
}

export async function generatePersonalizedPlaylist(
  analysisResults,
  playlistName
) {
  try {
    console.log("Starting playlist generation with analysis:", analysisResults);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert music curator specializing in underground and alternative music. Based on the user's musical analysis, create a detailed playlist with specific track recommendations that match their preferences. Focus on lesser-known artists, indie releases, and underground tracks that align with their taste profile. Avoid mainstream pop and commercial hits.`,
        },
        {
          role: "user",
          content: `Based on this musical analysis: ${JSON.stringify(
            analysisResults
          )}\n\nCreate a playlist called "${playlistName}" with 15-20 underground/alternative track recommendations. Include specific song titles, artists, and brief explanations of why each track fits the user's taste. Prioritize indie, underground, and lesser-known artists that match their musical preferences.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "generated_playlist_response",
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              mood: { type: "string" },
              energy_level: { type: "string" },
              total_tracks: { type: "number" },
              estimated_duration: { type: "string" },
              tracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    artist: { type: "string" },
                    album: { type: "string" },
                    why_recommended: { type: "string" },
                    estimated_duration: { type: "string" },
                  },
                  required: ["name", "artist", "why_recommended"],
                  additionalProperties: false,
                },
              },
              curator_notes: { type: "string" },
            },
            required: ["name", "description", "tracks", "total_tracks"],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.8,
      max_tokens: 1500,
    });

    console.log("OpenAI Response:", response);
    const generatedPlaylist = JSON.parse(response.choices[0].message.content);
    console.log("Parsed Generated Playlist:", generatedPlaylist);
    
    // checking if AI changed the playlist name
    if (generatedPlaylist.name !== playlistName) {
      console.warn(`AI changed playlist name from "${playlistName}" to "${generatedPlaylist.name}"`);
    }

    // Search for tracks on Spotify and get their URIs
    const enhancedTracks = await Promise.all(
      generatedPlaylist.tracks.map(async (track, index) => {
        try {
          // Search for the track on Spotify
          const searchQuery = `${track.name} ${track.artist}`;
          console.log("Searching for track:", searchQuery);

          const token = await getValidAccessToken();
          const searchResponse = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
              searchQuery
            )}&type=track&limit=1`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!searchResponse.ok) {
            console.warn(`Failed to search for track: ${searchQuery}`);
            throw new Error(`Failed to search for track: ${searchQuery}`);
          }

          const searchData = await searchResponse.json();
          const spotifyTrack = searchData.tracks.items[0];

          if (!spotifyTrack) {
            console.warn(`No Spotify track found for: ${searchQuery}`);
            throw new Error(`No Spotify track found for: ${searchQuery}`);
          }

          console.log(
            "Found Spotify track:",
            spotifyTrack.name,
            spotifyTrack.uri
          );

          return {
            id: spotifyTrack.id,
            name: spotifyTrack.name, 
            artists: spotifyTrack.artists.map(artist => artist.name), 
            album: spotifyTrack.album.name,
            duration: spotifyTrack.duration_ms,
            why_recommended: track.why_recommended, // OpenAI's reasoning
            uri: spotifyTrack.uri,
            albumArt: spotifyTrack.album.images[0]?.url,
            // storing original OpenAI recommendation for reference
            originalRecommendation: {
              name: track.name,
              artist: track.artist,
              album: track.album
            }
          };
        } catch (error) {
          console.error(`Error searching for track: ${track.name}`, error);
          // trying alternative search with just the track name
          try {
            const token = await getValidAccessToken();
            const searchResponse = await fetch(
              `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                track.name
              )}&type=track&limit=1`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!searchResponse.ok) {
              throw new Error(`Failed to search for track: ${track.name}`);
            }

            const searchData = await searchResponse.json();
            const spotifyTrack = searchData.tracks.items[0];

            if (!spotifyTrack) {
              throw new Error(`No Spotify track found for: ${track.name}`);
            }

            console.log(
              "Found Spotify track (alternative search):",
              spotifyTrack.name,
              spotifyTrack.uri
            );

            return {
              id: spotifyTrack.id,
              name: spotifyTrack.name, 
              artists: spotifyTrack.artists.map(artist => artist.name), 
              album: spotifyTrack.album.name,
              duration: spotifyTrack.duration_ms,
              why_recommended: track.why_recommended, 
              uri: spotifyTrack.uri,
              albumArt: spotifyTrack.album.images[0]?.url,
              originalRecommendation: {
                name: track.name,
                artist: track.artist,
                album: track.album
              }
            };
          } catch (retryError) {
            console.error(
              `Failed to find track after retry: ${track.name}`,
              retryError
            );
            throw new Error(
              `Could not find a valid Spotify track for: ${track.name}`
            );
          }
        }
      })
    );

    // Filter out any tracks that don't have URIs
    const validTracks = enhancedTracks.filter((track) => track.uri);

    if (validTracks.length === 0) {
      throw new Error(
        "No valid Spotify tracks found for the playlist. Please try again."
      );
    }

    console.log("Enhanced Tracks:", validTracks);

    const finalPlaylist = {
      ...generatedPlaylist,
      name: playlistName, 
      id: `ai-playlist-${Date.now()}`,
      tracks: validTracks,
      coverImage: "",
      createdAt: new Date().toISOString(),
      trackCount: validTracks.length,
      duration: generatedPlaylist.estimated_duration || "1h 15m",
    };

    console.log("Final Playlist:", finalPlaylist);
    return finalPlaylist;
  } catch (error) {
    console.error("Error generating personalized playlist:", error);
    throw new Error(
      "Failed to generate your personalized playlist. Please try again."
    );
  }
}

export async function generateMusicInsights(analysisResults) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a friendly music expert. Create engaging, personalized insights about the user's music taste that they would find interesting and accurate.",
        },
        {
          role: "user",
          content: `Based on this analysis: ${JSON.stringify(
            analysisResults
          )}\n\nCreate 3-4 friendly, engaging insights about this person's music taste that they would find interesting and relatable.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "music_insights_response",
          schema: {
            type: "object",
            properties: {
              insights: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    icon: { type: "string" },
                  },
                  required: ["title", "description"],
                  additionalProperties: false,
                },
              },
              overall_summary: { type: "string" },
            },
            required: ["insights", "overall_summary"],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.8,
      max_tokens: 600,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating music insights:", error);
    throw new Error("Failed to generate music insights.");
  }
}
