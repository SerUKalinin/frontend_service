import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface TaskResponsibleUserModalProps {
  taskId: number;
  onClose: () => void;
  onChange: () => void;
}

const TaskResponsibleUserModal: React.FC<TaskResponsibleUserModalProps> = ({ taskId, onClose, onChange }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get<User[]>('/users/info/all');
        setUsers(response.data);
      } catch (err) {
        setError('Ошибка при загрузке пользователей');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAssign = async () => {
    if (!selectedUserId) return;
    try {
      setAssigning(true);
      await api.put(`/tasks/${taskId}/assign-responsible`, { userId: selectedUserId });
      onChange();
      onClose();
    } catch (err) {
      setError('Ошибка при назначении пользователя');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-2xl">×</span>
        </button>
        <h2 className="text-lg font-semibold mb-4">Назначить ответственного</h2>
        {loading ? (
          <div>Загрузка пользователей...</div>
        ) : error ? (
          <div className="text-red-500 mb-2">{error}</div>
        ) : (
          <>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              value={selectedUserId || ''}
              onChange={e => setSelectedUserId(Number(e.target.value))}
            >
              <option value="">Выберите пользователя</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              onClick={handleAssign}
              disabled={!selectedUserId || assigning}
            >
              Назначить
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskResponsibleUserModal; 