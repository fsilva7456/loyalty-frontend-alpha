import React, { useState } from 'react';

export default function Tooltip({ content, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-container">
      <div 
        className="tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="tooltip-content">
          {content}
        </div>
      )}
    </div>
  );
}