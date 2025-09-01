import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import SessionsModal from "./SessionsModal";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
  const { accessToken, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [showSessions, setShowSessions] = useState(false);
  const hasRun = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  useEffect(() => {
    if (hasRun.current || !accessToken) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(res.data);
        hasRun.current = true;
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, [accessToken]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get("/auth/sessions", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser((prev) => {
        return { ...prev, sessions: res.data };
      });
      setShowSessions(true);
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  };

  if (!user) return <p className="text-center mt-4">Loading profile...</p>;

  // check minimal profile completeness
  const { dob, sex, height, weight, bloodGroup, activityLevel } = user;
  const requiredFields = [dob, sex, height, weight, bloodGroup, activityLevel];
  const isProfileComplete = requiredFields.every(
    (field) => field !== undefined && field !== null && field !== ""
  );

  return (
    <div className="p-4 max-w-xl my-8 mx-auto overflow-y-scroll">
      <h2 className="text-xl font-bold mb-2">Welcome, {user.name}</h2>
      <p className="text-gray-600 mb-4">Email: {user.email}</p>

      {/* Profile Summary */}
      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        <h3 className="text-lg font-semibold border-b pb-2">
          Profile Information
        </h3>

        <p>
          <span className="font-medium">Date of Birth:</span>{" "}
          {user.dob ? user.dob.split("T")[0] : "—"}
        </p>
        <p>
          <span className="font-medium">Sex:</span> {user.sex || "—"}
        </p>
        <p>
          <span className="font-medium">Height:</span>{" "}
          {user.height ? `${user.height} cm` : "—"}
        </p>
        <p>
          <span className="font-medium">Weight:</span>{" "}
          {user.weight ? `${user.weight} kg` : "—"}
        </p>
        <p>
          <span className="font-medium">Blood Group:</span>{" "}
          {user.bloodGroup || "—"}
        </p>
        <p>
          <span className="font-medium">Allergies:</span>{" "}
          {user.allergies?.length ? user.allergies.join(", ") : "—"}
        </p>
        <p>
          <span className="font-medium">Medications:</span>{" "}
          {user.medications?.length ? user.medications.join(", ") : "—"}
        </p>
        <p>
          <span className="font-medium">Medical Conditions:</span>{" "}
          {user.medicalConditions?.length
            ? user.medicalConditions.join(", ")
            : "—"}
        </p>
        <p>
          <span className="font-medium">Smoking:</span>{" "}
          {user.smokingStatus || "—"}
        </p>
        <p>
          <span className="font-medium">Alcohol:</span>{" "}
          {user.alcoholConsumption || "—"}
        </p>
        <p>
          <span className="font-medium">Activity Level:</span>{" "}
          {user.activityLevel || "—"}
        </p>
      </div>

      {/* Completion check */}
      {!isProfileComplete && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mt-4 rounded">
          <p>Your profile is incomplete. Please update your information.</p>
          <Link
            to="/profile/edit"
            className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {isProfileComplete && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mt-4 rounded">
          <p>✅ Your profile is complete!</p>
          <Link
            to="/profile/edit"
            className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </Link>
        </div>
      )}

      {/* Sessions */}
      <div className="mt-4">
        <button
          onClick={() => fetchSessions()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Logged-in Devices ({user.sessions?.length || 0})
        </button>
      </div>

      {showSessions && (
        <SessionsModal
          sessions={user.sessions}
          onClose={() => setShowSessions(false)}
          currentRefreshToken={user.refreshToken}
          refresh={() => fetchSessions()}
        />
      )}

      {/* Logout */}
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
