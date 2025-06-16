import React from "react";
import Icon from "../../../components/AppIcon";

const AuthButton = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-spotify hover:bg-opacity-90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 focus:outline-none focus:ring-2 focus:ring-spotify focus:ring-offset-2 focus:ring-offset-surface shadow-lg hover:shadow-xl transform hover:scale-105 ${
        disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
      }`}
      aria-label="Connect with Spotify"
    >
      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <Icon name="Music" size={16} color="#22C55E" />
      </div>
      <span className="text-lg">Connect with Spotify</span>
      <Icon name="ExternalLink" size={18} color="white" />
    </button>
  );
};

export default AuthButton;
