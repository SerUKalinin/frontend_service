import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import type { Object } from './types';

interface EditButtonProps {
  object: Object;
  onEdit: (object: Object) => void;
}

const EditButton: React.FC<EditButtonProps> = ({ object, onEdit }) => {
  return (
    <button
      onClick={() => onEdit(object)}
      className="text-indigo-600 hover:text-indigo-900 mr-4"
      title="Редактировать"
    >
      <PencilIcon className="h-5 w-5" />
    </button>
  );
};

export default EditButton; 