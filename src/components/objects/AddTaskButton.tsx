import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddTaskButtonProps {
  onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
  return (
    <div 
      className="flex items-center justify-center p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#4361ee] hover:bg-gray-50 transition-colors cursor-pointer h-[100px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center">
        <PlusIcon className="h-8 w-8 text-gray-400 mb-2" />
        <span className="text-sm font-medium text-gray-600">Добавить задачу</span>
      </div>
    </div>
  );
};

export default AddTaskButton; 