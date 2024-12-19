// src/components/ProfileSettings.js
import React, { useState } from 'react';
import './ProfileSettings.css';

function ProfileSettings() {
  const [profilePic, setProfilePic] = useState('');
  const [message, setMessage] = useState('');

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert('File too large, must be under 1MB.');
      return;
    }
    const formData = new FormData();
    formData.append('profilePic', file);

    const res = await fetch('/api/profile-picture', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.url) {
      setProfilePic(data.url);
      setMessage('Profile picture updated successfully!');
    } else {
      setMessage('Error updating profile picture.');
    }
  };

  return (
    <div className="profile-settings-container">
      <h2>Profile Settings</h2>
      <div className="profile-pic-section">
        <h3>Upload Profile Picture</h3>
        {profilePic && <img src={profilePic} alt="Profile" className="profile-pic-preview" />}
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ProfileSettings;
