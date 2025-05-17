import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { Object } from './types';

interface DeleteButtonProps {
  object: Object;
  onDelete: (object: Object) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ object, onDelete }) => {
  return (
    <button
      onClick={() => onDelete(object)}
      className="text-red-600 hover:text-red-900"
      title="Удалить"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
};

export default DeleteButton; 