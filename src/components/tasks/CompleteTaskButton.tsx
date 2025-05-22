import React, { useState } from 'react';
import { api } from '../../services/api';

interface CompleteTaskButtonProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: string;
    deadline: string;
    realEstateObjectId: number;
    responsibleUserFirstName?: string;
    responsibleUserLastName?: string;
  };
  onTaskChange?: () => void;
}

const CompleteTaskButton: React.FC<CompleteTaskButtonProps> = ({ task, onTaskChange }) => {
  const [loading, setLoading] = useState(false);

  if (task.status === 'COMPLETED') return null;

  const handleComplete = async () => {
    try {
      setLoading(true);
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: 'COMPLETED',
        deadline: task.deadline,
        realEstateObjectId: task.realEstateObjectId
      });
      onTaskChange && onTaskChange();
    } catch (err) {
      alert('Ошибка при завершении задачи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-2"
      onClick={handleComplete}
      disabled={loading}
    >
      {loading ? 'Завершаем...' : 'Завершить задачу'}
    </button>
  );
};

export default CompleteTaskButton; 