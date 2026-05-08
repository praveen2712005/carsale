import React, { useState } from "react";
import "./Profile.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

function Profile() {

  const userData =
    JSON.parse(localStorage.getItem("userdata")) || {};

  const productdata =
    JSON.parse(localStorage.getItem("myOrders")) || [];

  const navigate = useNavigate();

  const [address, setAddress] =
    useState(userData.address || "");

  const [isEditing, setIsEditing] =
    useState(userData.address ? false : true);

  // Save Address
  const saveAddress = () => {

    const updatedUser = {
      ...userData,
      address: address
    };

    localStorage.setItem(
      "userdata",
      JSON.stringify(updatedUser)
    );

    setIsEditing(false);

    alert("Address Saved Successfully");
  };

  return (
    <>
      <Navbar />

      <div className="profile">

        

        <div className="profile-info">

          <p>
            <b>Name</b>
            <span>{userData.name}</span>
          </p>

          <p>
            <b>Email</b>
            <span>{userData.email}</span>
          </p>

          <p>
            <b>Phone</b>
            <span>{userData.number}</span>
          </p>

         

          {/* Premium Address Card */}

          <div className="address-card">

            <div className="address-top">

              <h3>Shipping Address</h3>

              {!isEditing && (
                <button
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}

            </div>

            {isEditing ? (

              <>
                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Enter your address"
                  rows="4"
                />

                <button
                  className="save-address-btn"
                  onClick={saveAddress}
                >
                  Save Address
                </button>
              </>

            ) : (

              <div className="saved-address">
                {address}
              </div>

            )}

          </div>

          {/* Buttons */}

          <div className="profile-buttons">

            <button>
              Edit Profile
            </button>

            <button
              onClick={() => navigate("/myorders")}
            >
              View Orders
            </button>

            <button>
              Change Password
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default Profile;