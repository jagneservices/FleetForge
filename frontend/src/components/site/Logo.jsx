import React from 'react';

// Recreates the TruckingOffice logo (red TF mark + name + tagline) using SVG
const Logo = ({ variant = 'full', className = '' }) => {
  if (variant === 'mark') {
    return (
      <svg viewBox="0 0 60 50" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="TruckingOffice">
        <g fill="#c81f1f">
          <path d="M5 8 L55 8 L48 18 L12 18 Z" />
          <path d="M10 22 L52 22 L45 32 L17 32 Z" />
          <path d="M16 36 L48 36 L42 46 L22 46 Z" />
        </g>
      </svg>
    );
  }
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 60 50" className="h-12 w-14 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <g fill="#c81f1f">
          <path d="M5 8 L55 8 L48 18 L12 18 Z" />
          <path d="M10 22 L52 22 L45 32 L17 32 Z" />
          <path d="M16 36 L48 36 L42 46 L22 46 Z" />
        </g>
      </svg>
      <div className="flex flex-col leading-none">
        <div className="font-bold text-[28px] md:text-[34px] tracking-tight">
          <span style={{ color: '#c81f1f' }}>Trucking</span>
          <span style={{ color: '#1f3a8a' }}>Office</span>
        </div>
        <div className="italic font-semibold text-[12px] md:text-[14px]" style={{ color: '#1f3a8a' }}>
          Trucking Management Solutions
        </div>
      </div>
    </div>
  );
};

export default Logo;
