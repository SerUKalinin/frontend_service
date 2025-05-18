import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import { api } from '../../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface ResponsibleUserModalProps {
  objectId: number;
  onClose: () => void;
  onChange: () => void;
}

const ResponsibleUserModal: React.FC<ResponsibleUserModalProps> = ({ objectId, onClose, onChange }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!selectedUser) return;
    try {
      setLoading(true);
      await api.put(`/real-estate-objects/${objectId}/assign-responsible/${selectedUser.id}`);
      onChange();
      onClose();
    } catch (err) {
      setError('Ошибка при назначении ответственного');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Назначить ответственного</h2>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Пользователь</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedUser?.id || ''}
            onChange={e => {
              const user = users.find(u => u.id === Number(e.target.value));
              setSelectedUser(user || null);
            }}
          >
            <option value="">Выберите пользователя</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button type="button" variant="primary" onClick={handleAssign} disabled={!selectedUser || loading}>
            Назначить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResponsibleUserModal; 