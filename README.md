# 🎵 MoodTunes – AI Spotify Playlist Generator

MoodTunes is a modern web app that uses AI to analyze your Spotify playlists and generate new, personalized playlists based on your music taste.

## 🚀 Features

- **Spotify Integration** -  Log in with your Spotify account, view and select your playlists, and save new playlists directly to your Spotify library.
- **AI-Powered Analysis** - Uses OpenAI to analyze your selected playlists and generate a unique playlist tailored to your preferences.
- **Playlist History** -  Every generated playlist is saved to your personal history for easy access and replay.
- **Responsive UI** - Built with Tailwind CSS for a seamless experience on any device.
- **Modern Stack** -  React 18, Vite, React Router v6, Framer Motion, and more.

## 📋 Prerequisites

- Node.js (v16.x or higher recommended)
- npm or yarn
- Spotify Test Account credentials


## 📋 Spotify Test Account credentials

- Username: testtt.userrr.4840@gmail.com 
- Password: AdminTest123!@


## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## ⚙️ Environment Variables

Create a `.env` file in the project root with the following:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
VITE_OPENAI_API_KEY=your_openai_api_key
```
