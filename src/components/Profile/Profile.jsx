import React from "react";
import "./Profile.css";
import Navbar from "../Navbar/Navbar";

function Profile() {
  return (
   <>
   <Navbar/>
    <div className="profile">
      <h2>My Profile</h2>
      <div className="profile-info">
        <p><b>Name:</b> Praveen</p>
        <p><b>Email:</b> praveen@example.com</p>
        <p><b>Phone:</b> +91 9876543210</p>
        <p><b>Address:</b> 123 Main Street, Chennai, India</p>
        <p><b>Member Since:</b> January 2023</p>
        <p><b>Orders:</b> 15</p>
        <button>Edit Profile</button>
        <button>View Orders</button>
        <button>Change Password</button>
      </div>
    </div></>
  );
}

export default Profile;
