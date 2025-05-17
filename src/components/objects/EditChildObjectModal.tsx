import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import Button from '../common/Button';
import type { Object } from './types';
import { getObjectTypeName } from './utils';

interface EditChildObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (object: Object) => void;
  object: Object | null;
  parentName: string;
}

const objectTypes = [
  'BUILDING',
  'ENTRANCE',
  'BASEMENT_FLOOR',
  'FLOOR',
  'STAIRWELL',
  'ELEVATOR',
  'FLOOR_BALCONY',
  'CORRIDOR',
  'ELEVATOR_HALL',
  'APARTMENT',
  'APARTMENT_BALCONY',
  'ROOM',
  'TASK'
];

const EditChildObjectModal: React.FC<EditChildObjectModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  object,
  parentName
}) => {
  const [formData, setFormData] = useState({
    name: '',
    objectType: ''
  });

  useEffect(() => {
    if (object) {
      setFormData({
        name: object.name,
        objectType: object.objectType
      });
    }
  }, [object]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!object) return;

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:8080/real-estate-objects/${object.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...object,
          name: formData.name,
          objectType: formData.objectType
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении объекта');
      }

      const updatedObject = await response.json();
      onEdit(updatedObject);
      toast.success('Объект успешно обновлен');
      onClose();
    } catch (error) {
      console.error('Error updating object:', error);
      toast.error('Ошибка при обновлении объекта');
    }
  };

  if (!isOpen || !object) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Редактирование объекта
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Родительский объект
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    disabled
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
                  />
                </div>

                <Input
                  id="name"
                  label="Название объекта"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Введите название объекта"
                />

                <div>
                  <label htmlFor="objectType" className="block text-sm font-medium text-gray-700 mb-1">
                    Тип объекта
                  </label>
                  <select
                    id="objectType"
                    required
                    value={formData.objectType}
                    onChange={(e) => setFormData({ ...formData, objectType: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Выберите тип объекта</option>
                    {objectTypes.map((type) => (
                      <option key={type} value={type}>
                        {getObjectTypeName(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    className="sm:ml-3 sm:w-auto"
                  >
                    Сохранить
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="mt-3 sm:mt-0 sm:w-auto"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditChildObjectModal; 