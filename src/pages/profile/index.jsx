import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Header from "components/ui/Header";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "services/spotify";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("code_verifier");

    navigate("/");
  };

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

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mb-4">
          <div className="flex items-center justify-center">
            <Icon name="AlertCircle" size={40} color="#ef4444" />
          </div>
        </div>
        <p className="text-lg font-semibold text-text-primary animate-pulse">
          {error}
        </p>
      </div>
    );

  if (!profile)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mb-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg font-semibold text-text-primary animate-pulse">
          Loading profile...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Header variant="transparent" />
      <div className="max-w-md mx-auto mt-10 p-6 bg-surface-alt rounded-lg shadow">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={profile.images?.[0]?.url || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{profile.display_name}</h1>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleLogout} icon="LogOut">
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
