import React from 'react';

interface BuildingDescriptionProps {
  name?: string;
  type?: string;
  className?: string;
}

const BuildingDescription: React.FC<BuildingDescriptionProps> = ({
  name,
  type,
  className = ''
}) => {
  const getObjectTypeName = (type: string | undefined) => {
    if (!type) return '';
    switch (type) {
      case 'BUILDING':
        return 'Здание';
      case 'APARTMENT':
        return 'Квартира';
      case 'OFFICE':
        return 'Офис';
      case 'LAND':
        return 'Земельный участок';
      default:
        return type;
    }
  };

  if (!name && !type) return null;

  return (
    <div className={`mt-2 text-center ${className}`}>
      {name && (
        <div className="text-lg font-medium text-blue-600 hover:text-blue-800">
          {name}
        </div>
      )}
      {type && (
        <div className="text-sm text-gray-600">
          {getObjectTypeName(type)}
        </div>
      )}
    </div>
  );
};

export default BuildingDescription; 