import React, { useState } from 'react';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import TaskResponsibleUserModal from './TaskResponsibleUserModal';

interface TaskResponsibleUserManagerProps {
  responsibleUserFirstName?: string;
  responsibleUserLastName?: string;
  taskId: number;
  onChange: () => void; // для обновления данных после назначения/удаления
}

const TaskResponsibleUserManager: React.FC<TaskResponsibleUserManagerProps> = ({
  responsibleUserFirstName,
  responsibleUserLastName,
  taskId,
  onChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleRemove = async () => {
    try {
      await api.put(`/tasks/${taskId}/remove-responsible`);
      onChange();
    } catch (err) {
      console.error('Ошибка при удалении ответственного:', err);
    }
  };

  const hasResponsible = !!(responsibleUserFirstName && responsibleUserLastName);

  return (
    <>
      {hasResponsible ? (
        <div className="flex items-center gap-2">
          <span>{responsibleUserFirstName} {responsibleUserLastName}</span>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 p-1"
            title="Удалить ответственного"
          >
            <MinusCircleIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          className="text-blue-600 underline hover:text-blue-800 cursor-pointer p-0 bg-transparent border-0"
          onClick={handleOpenModal}
        >
          Не назначен
        </button>
      )}
      {isModalOpen && (
        <TaskResponsibleUserModal
          taskId={taskId}
          onClose={handleCloseModal}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default TaskResponsibleUserManager; 