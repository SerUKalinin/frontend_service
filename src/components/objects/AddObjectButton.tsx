import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddObjectButtonProps {
  onClick: () => void;
}

const AddObjectButton: React.FC<AddObjectButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      Добавить объект
    </button>
  );
};

export default AddObjectButton; 