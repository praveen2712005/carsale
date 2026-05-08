import React from "react";
import "./Settings.css";
import Navbar from "../Navbar/Navbar";

function Settings() {

  const handleLogout = () => {
    localStorage.removeItem("userdata");
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar />

      <div className="settings-page">

        <h2 className="settings-title">
          Settings
        </h2>

        <div className="settings-buttons">

          <button className="settings-btn">
            Edit Profile
          </button>

          <button className="settings-btn">
            Change Password
          </button>

          <button className="settings-btn">
            Manage Address
          </button>

          <button className="settings-btn">
            Notification Settings
          </button>

          <button className="settings-btn">
            Privacy Settings
          </button>

          <button className="settings-btn">
            Payment Methods
          </button>

          <button className="settings-btn">
            Help & Support
          </button>

          <button className="settings-btn">
            Terms & Conditions
          </button>

          <button className="settings-btn">
            About App
          </button>

          <button
            className="settings-btn logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </>
  );
}

export default Settings;