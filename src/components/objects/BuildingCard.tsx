import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Object } from './types';
import BuildingIcon from '../common/BuildingIcon';
import BuildingDescription from '../common/BuildingDescription';

interface BuildingCardProps {
  building: Object;
}

const BuildingCard: React.FC<BuildingCardProps> = ({ building }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/objects/${building.id}`);
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleClick}
      >
        <BuildingIcon size={192} />
      </div>
      <div 
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleClick}
      >
        <BuildingDescription 
          name={building.name}
          type={building.objectType}
        />
      </div>
    </div>
  );
};

export default BuildingCard; 