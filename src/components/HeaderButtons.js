import React from 'react';
import './HeaderButtons.css';

function HeaderButtons({
  mainButtonLabel,
  mainButtonColor,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  setCurrentPage,
  pageTitle
}) {
  return (
    <div className="header-buttons">
      <div className="header-left">
        <button
          className="main-button"
          style={{ backgroundColor: mainButtonColor }}
          onClick={setCurrentPage}
        >
          {mainButtonLabel}
        </button>
        {secondaryButtonLabel && onSecondaryButtonClick && (
          <button className="secondary-button" onClick={onSecondaryButtonClick}>
            {secondaryButtonLabel}
          </button>
        )}
      </div>
      <h2 className="page-title">{pageTitle}</h2>
      <div className="header-right">
        {/* Place for settings icon or additional buttons */}
      </div>
    </div>
  );
}

export default HeaderButtons;
