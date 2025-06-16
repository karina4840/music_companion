import Callback from "components/Callback";
import AnalysisGenerationScreen from "pages/analysis-generation-screen";
import GeneratedPlaylistScreen from "pages/generated-playlist-screen";
import HistoryPage from "pages/history";
import PlaylistSelectionScreen from "pages/playlist-selection-screen";
import ProfilePage from "pages/profile";
import LoginConnectionScreen from "pages/login-connection-screen";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<PlaylistSelectionScreen />} />
        <Route path="/playlist-selection-screen" element={<PlaylistSelectionScreen />} />
        <Route path="/analysis-generation-screen" element={<AnalysisGenerationScreen />} />
        <Route path="/generated-playlist-screen" element={<GeneratedPlaylistScreen />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/login-connection-screen" element={<LoginConnectionScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
