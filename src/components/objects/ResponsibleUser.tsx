import React, { useState, useEffect } from 'react';
import { UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { User } from '../../services/userService';
import { userService } from '../../services/userService';
import { objectService } from '../../services/objectService';
import { toast } from 'react-toastify';
import Button from '../common/Button';

interface ResponsibleUserProps {
  objectId: number;
  responsibleUser?: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
  onUpdate: () => void;
}

const ResponsibleUser: React.FC<ResponsibleUserProps> = ({ objectId, responsibleUser, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    try {
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId) return;
    try {
      await objectService.assignResponsibleUser(objectId, selectedUserId);
      toast.success('Ответственный успешно назначен');
      onUpdate();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при назначении ответственного');
    }
  };

  const handleRemove = async () => {
    try {
      await objectService.removeResponsibleUser(objectId);
      toast.success('Ответственный успешно удален');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при удалении ответственного');
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {responsibleUser ? (
          <>
            <span className="text-sm text-gray-900">
              {responsibleUser.firstName} {responsibleUser.lastName}
            </span>
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Удалить ответственного"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handleOpenModal}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Не назначен
          </button>
        )}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Назначить ответственного
            </h3>
            
            <select
              value={selectedUserId || ''}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="">Выберите пользователя</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Отмена
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedUserId || isLoading}
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Назначение...' : 'Назначить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponsibleUser; 