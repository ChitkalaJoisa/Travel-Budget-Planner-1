import React, { useEffect, useState } from 'react';
import { Settings, Bell, Shield } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });

  // 🔔 Notifications state
  const [notifications, setNotifications] = useState(true);

  // 🔐 Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const token = localStorage.getItem("access");

  // ✅ FETCH USER PROFILE
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setUser({
        name: data.name || "User",
        email: data.email || "",
      });

    } catch (err) {
      console.error(err);
    }
  };

  // 🔔 Load notification setting
  useEffect(() => {
    fetchProfile();

    const saved = localStorage.getItem("notifications");
    if (saved !== null) setNotifications(saved === "true");
  }, []);

  // 🔔 Save notification setting
  useEffect(() => {
    localStorage.setItem("notifications", notifications);
  }, [notifications]);

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  // ✅ DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/auth/delete/",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("Account deleted successfully");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/";
      } else {
        alert("Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting account");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-32 space-y-8 animate-fade-in">

      {/* PROFILE CARD */}
      <div className="glass-panel rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 p-10">

        {/* Avatar */}
        <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-5xl font-black">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* Info */}
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tight">
            {user.name}
          </h2>

          <p className="text-gray-300 font-medium">
            {user.email}
          </p>

          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold uppercase">
            User
          </span>
        </div>
      </div>

      {/* SETTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Preferences */}
        <div className="bento-card space-y-4">
          <h4 className="font-bold text-lg flex items-center gap-2 text-white">
            <Settings size={20} /> App Preferences
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between p-4 rounded-2xl bg-white/10">
              <span className="text-white">Currency</span>
              <span className="text-blue-400 font-bold">INR (₹)</span>
            </div>

            <div className="flex justify-between p-4 rounded-2xl bg-white/10">
              <span className="text-white">Language</span>
              <span className="text-white font-bold">English</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-6">

          {/* 🔔 Notifications */}
          <div className="bento-card">
            <h4 className="font-bold mb-4 text-white flex items-center gap-2">
              <Bell size={20} /> Notifications
            </h4>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Notifications</span>

              <button
                onClick={() => setNotifications(!notifications)}
                className={`px-4 py-1 rounded-full text-sm font-bold ${
                  notifications ? "bg-green-500" : "bg-gray-500"
                } text-white`}
              >
                {notifications ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 🔐 Security */}
          <div className="bento-card">
            <h4 className="font-bold mb-4 text-white flex items-center gap-2">
              <Shield size={20} /> Security
            </h4>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-blue-400 font-bold"
            >
              Change Password
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              Logout
            </button>

            <button
              onClick={handleDeleteAccount}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold"
            >
              Delete Account
            </button>
          </div>

        </div>
      </div>

      {/* 🔐 PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">

          <div className="bento-card w-full max-w-md p-6">

            <h3 className="text-xl font-bold text-white mb-4">
              Change Password
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  const res = await fetch(
                    "http://127.0.0.1:8000/api/auth/change-password/",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        old_password: passwordData.oldPassword,
                        new_password: passwordData.newPassword,
                      }),
                    }
                  );

                  const data = await res.json();

                  if (res.ok) {
                    alert("Password changed successfully");
                    setShowPasswordModal(false);
                    setPasswordData({ oldPassword: "", newPassword: "" });
                  } else {
                    alert(data.error || "Error updating password");
                  }

                } catch (err) {
                  console.error(err);
                  alert("Server error");
                }
              }}
              className="space-y-4"
            >

              <input
                type="password"
                placeholder="Old Password"
                className="input-glass"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, oldPassword: e.target.value })
                }
                required
              />

              <input
                type="password"
                placeholder="New Password"
                className="input-glass"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                Update Password
              </button>
            </form>

            <button
              onClick={() => setShowPasswordModal(false)}
              className="mt-4 text-red-400"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}