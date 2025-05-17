import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface BackToParentButtonProps {
  parentId: string;
  parentName: string;
}

const BackToParentButton: React.FC<BackToParentButtonProps> = ({ parentId, parentName }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/objects/${parentId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="truncate">Вернуться к {parentName}</span>
    </button>
  );
};

export default BackToParentButton; 