import React from 'react';

interface FlickrIconProps {
  size?: number;
  className?: string;
}

const FlickrIcon: React.FC<FlickrIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
    >
      <circle cx="7" cy="12" r="5" fill="#0063dc"/>
      <circle cx="17" cy="12" r="5" fill="#ff0084"/>
    </svg>
  );
};

export default FlickrIcon;
