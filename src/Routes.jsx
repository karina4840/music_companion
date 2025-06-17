import React from "react";
import { HashRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginConnectionScreen from "pages/login-connection-screen";
import PlaylistSelectionScreen from "pages/playlist-selection-screen";
import AnalysisGenerationScreen from "pages/analysis-generation-screen";
import GeneratedPlaylistScreen from "pages/generated-playlist-screen";
import Callback from "components/Callback";
import ProfilePage from "pages/profile";

const Routes = () => {
  return (
    <HashRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<LoginConnectionScreen />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/login-connection-screen"
            element={<LoginConnectionScreen />}
          />
          <Route path="/callback" element={<Callback />} />
          <Route
            path="/playlist-selection-screen"
            element={<PlaylistSelectionScreen />}
          />
          <Route
            path="/analysis-generation-screen"
            element={<AnalysisGenerationScreen />}
          />
          <Route
            path="/generated-playlist-screen"
            element={<GeneratedPlaylistScreen />}
          />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </HashRouter>
  );
};

export default Routes;
