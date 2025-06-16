import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import { Link } from "react-router-dom";
import { getUserProfile } from "services/spotify";

const Header = ({ variant = "default" }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleLogoClick = () => {
    const isLoggedIn = !!localStorage.getItem("access_token");
    if (isLoggedIn) {
      navigate("/playlist-selection-screen");
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getHeaderClasses = () => {
    const baseClasses =
      "w-full border-b border-border transition-all duration-200";
    switch (variant) {
      case "transparent":
        return `${baseClasses} bg-transparent backdrop-blur-sm`;
      case "compact":
        return `${baseClasses} bg-surface py-2`;
      default:
        return `${baseClasses} bg-surface py-4`;
    }
  };

  const isCompact = variant === "compact";

  return (
    <header className={getHeaderClasses()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Icon name="Music" size={20} color="white" />
              </div>
              <span
                className={`font-display font-bold text-text-primary group-hover:text-primary transition-colors duration-200 ${
                  isCompact ? "text-lg" : "text-xl"
                }`}
              >
                MoodTunes
              </span>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2  rounded-lg px-3 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface group"
              aria-label="User profile"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center">
                <Icon name="Menu" size={16} color="white" />
              </div>
              <span className="text-text-primary text-sm font-medium hidden sm:block group-hover:text-primary transition-colors duration-200">
                Menu
              </span>
              <Icon
                name="ChevronDown"
                size={16}
                className="text-text-secondary group-hover:text-primary transition-colors duration-200"
              />
            </button>
            {/* Profile Dropdown */}
            <div
              className={`absolute right-4 top-full mt-2 w-48 bg-surface-alt border border-border rounded-lg shadow-lg z-50 flex flex-col transition-all duration-200 ${
                showDropdown
                  ? "opacity-100 pointer-events-auto translate-y-0"
                  : "opacity-0 pointer-events-none -translate-y-2"
              }`}
              style={{ visibility: showDropdown ? "visible" : "hidden" }}
            >
              <button>
                <div className="p-3 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="white" />
                  </div>
                  <span className="text-text-primary font-medium text-sm">
                    {profile ? (
                      <Link
                        to="/profile"
                        className="text-text-primary hover:text-primary-hover transition-colors duration-200"
                      >
                        {profile.display_name}
                      </Link>
                    ) : (
                      <Link
                        to="/login-connection-screen"
                        className="text-text-primary hover:text-primary-hover transition-colors duration-200"
                      >
                        Login
                      </Link>
                    )}
                  </span>
                </div>
              </button>
              {profile ? (
                <>
                  {" "}
                  <button>
                    <div className="p-3 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center">
                        <Icon name="History" size={16} color="white" />
                      </div>
                      <span className="text-text-primary font-medium text-sm">
                        <Link
                          to="/history"
                          className="text-text-primary hover:text-primary-hover transition-colors duration-200"
                        >
                          History
                        </Link>
                      </span>
                    </div>
                  </button>{" "}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
