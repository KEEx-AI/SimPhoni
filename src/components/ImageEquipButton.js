// src/components/ImageEquipButton.js
import React, { useRef, useState } from 'react';
import './ImageEquipButton.css';

export default function ImageEquipButton({ isVisionModel, onImageAttached }) {
  const fileRef = useRef(null);
  const [error, setError] = useState(null);

  const handleImageClick = () => {
    fileRef.current.click();
  };

  const handleImageChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;

    // Example: check size or format
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file");
      return;
    }

    onImageAttached(file);
  };

  if (!isVisionModel) {
    return null; // Hide entirely if not needed
  }

  return (
    <div className="image-equip">
      <button className="image-btn" onClick={handleImageClick}>Image-equip</button>
      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      {error && <div className="image-error">{error}</div>}
    </div>
  );
}
