import React from 'react';
import type { Object } from './types';
import BuildingCard from './BuildingCard';

interface BuildingsGridProps {
  buildings: Object[];
}

const BuildingsGrid: React.FC<BuildingsGridProps> = ({ buildings }) => {
  if (buildings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {buildings.map((building) => (
          <BuildingCard key={building.id} building={building} />
        ))}
      </div>
    </div>
  );
};

export default BuildingsGrid; 