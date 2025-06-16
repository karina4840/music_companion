import { generateCodeVerifier, generateCodeChallenge } from './pkce';

const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

export async function redirectToSpotifyAuth() {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Store code verifier for later use
    localStorage.setItem('code_verifier', codeVerifier);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-read-private user-read-email',
      redirect_uri: REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    window.location = `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
  } catch (error) {
    console.error('Error initiating Spotify auth:', error);
    throw new Error('Failed to start Spotify authentication');
  }
}

export async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.error('No refresh token available');
      return null;
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    });

    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Token refresh failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return null;
    }

    const data = await response.json();
    console.log('Token refreshed successfully');
    
    // Update tokens in localStorage
    localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Clear invalid tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  }
}

export async function getValidAccessToken() {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No access token found');
      return null;
    }

    // Test the token with a simple API call
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return accessToken;
    }

    console.log('Token invalid, attempting refresh');
    // If token is invalid, try to refresh it
    return await refreshAccessToken();
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('code_verifier');
  window.location.href = '/';
}
