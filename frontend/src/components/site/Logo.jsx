import React from 'react';

const LOGO_URL =
  'https://customer-assets.emergentagent.com/job_trucking-hub-18/artifacts/tcxqrprs_fleetforge_dark.png';

const Logo = ({ variant = 'full', className = '', size = 'md' }) => {
  // small mark only (extracted FF region of the same image via background-position trick is messy,
  // so we render the full logo at smaller width which still reads well)
  const sizes = {
    sm: 'h-9',
    md: 'h-14',
    lg: 'h-20',
    xl: 'h-28',
  };
  return (
    <img
      src={LOGO_URL}
      alt="FleetForge"
      className={`${sizes[size] || sizes.md} w-auto select-none ${className}`}
      draggable={false}
    />
  );
};

export default Logo;
