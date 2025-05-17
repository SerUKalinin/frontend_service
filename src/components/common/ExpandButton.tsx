import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface ExpandButtonProps {
  isExpanded: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

const ExpandButton: React.FC<ExpandButtonProps> = ({ 
  isExpanded, 
  onClick,
  className = ''
}) => {
  return (
    <button 
      className={`p-1 rounded-full hover:bg-gray-100 focus:outline-none ${className}`}
      onClick={onClick}
    >
      {isExpanded ? (
        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );
};

export default ExpandButton; 