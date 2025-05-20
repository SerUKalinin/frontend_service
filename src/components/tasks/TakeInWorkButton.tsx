import React, { useState } from 'react';
import { api } from '../../services/api';

interface TakeInWorkButtonProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: string;
    deadline: string;
    responsibleUserFirstName?: string;
    responsibleUserLastName?: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  onTaskChange?: () => void;
}

const TakeInWorkButton: React.FC<TakeInWorkButtonProps> = ({ task, user, onTaskChange }) => {
  const [loading, setLoading] = useState(false);

  const isResponsible = task.responsibleUserFirstName === user.firstName && task.responsibleUserLastName === user.lastName;
  const canTakeTask = task.status === 'NEW' && !isResponsible;

  const handleTakeTask = async () => {
    try {
      setLoading(true);
      // 1. Назначить себя ответственным
      await api.put(`/tasks/${task.id}/assign-responsible`, { userId: user.id });
      // 2. Сменить статус
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: 'IN_PROGRESS',
        deadline: task.deadline
      });
      onTaskChange && onTaskChange();
    } catch (err) {
      alert('Ошибка при взятии задачи в работу');
    } finally {
      setLoading(false);
    }
  };

  if (!canTakeTask) return null;

  return (
    <button
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      onClick={handleTakeTask}
      disabled={loading}
    >
      {loading ? 'Берём в работу...' : 'Взять в работу'}
    </button>
  );
};

export default TakeInWorkButton; 