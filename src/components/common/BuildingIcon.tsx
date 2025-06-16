import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface BuildingIconProps {
  size?: number;
  className?: string;
}

const BuildingIcon: React.FC<BuildingIconProps> = ({ 
  size = 192,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <BuildingOfficeIcon 
        className="text-[var(--primary)]" 
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default BuildingIcon; 