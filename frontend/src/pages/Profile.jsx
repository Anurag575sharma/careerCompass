import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-hot-toast"; // ✅ Import toast
import {ProfileInformationCard} from "../components/ProfileInformationCard";
import {ChangePasswordCard} from "../components/ChangePasswordCard";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await axios.get("http://localhost:8000/api/profile", {
        withCredentials: true,
      });
      console.log(response.data.fullName);
      setProfile({
        fullName: response.data.fullName,
        email: response.data.email,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile ❌");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveProfile = async (updatedProfile) => {
    try {
      setSavingProfile(true);
      await axios.put("http://localhost:8000/api/profile", updatedProfile, {
        withCredentials: true,
      });

      setProfile((prev) => ({
        ...prev,
        fullName: updatedProfile.fullName,
      }));

      toast.success("Profile updated successfully "); // ✅ Toast
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile "); // ❌ Toast
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      setChangingPassword(true);
      await axios.post(
        "http://localhost:8000/api/change-password",
        passwordData,
        {withCredentials: true}
      );

      toast.success("Password changed successfully 🔐"); // ✅ Toast
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password "); // ❌ Toast
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (fullName) => {
    const names = fullName?.trim()?.split(" ") || [];
    const first = names[0]?.[0] || "";
    const last = names.length > 1 ? names[names.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {getInitials(profile.fullName)}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              {profile.fullName || "Loading..."}
            </h1>
            <p className="text-gray-500">Manage your name and password</p>
          </div>
        </div>
        <hr className="mt-2 border-gray-300" />
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInformationCard
          profile={profile}
          onSave={handleSaveProfile}
          saving={savingProfile}
          loading={loadingProfile}
        />
        <ChangePasswordCard
          onChangePassword={handleChangePassword}
          changing={changingPassword}
        />
      </div>
    </div>
  );
}
