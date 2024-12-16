// src/components/Modal.js
import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{title}</h3>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
