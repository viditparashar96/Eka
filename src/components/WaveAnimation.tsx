// components/WaveAnimation.tsx
import React from "react";

const WaveAnimation: React.FC<{ isRecording: boolean }> = ({ isRecording }) => {
  return (
    <div className={`wave-container ${isRecording ? "animate" : ""}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default WaveAnimation;
