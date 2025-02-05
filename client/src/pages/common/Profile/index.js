import React, { useEffect, useState } from "react";
import { message } from "antd";
import { getUserInfo } from "../../../apicalls/users"; // Ensure API is implemented
import "./index.css"
const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        if (response.success) {
          setUser(response.data);
        } else {
          message.error(response.message);
        }
      } catch (error) {
        message.error("Error fetching user info");
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="profile-container">
      {user && (
        <div className="profile-card">
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Profile URL: <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">Visit Profile</a></p>
            <div className="account-info">
              <p>Account Created: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Created At: {new Date(user.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
          <img
            src={user.profileUrl}
            alt="Profile"
            className="profile-pic"
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
