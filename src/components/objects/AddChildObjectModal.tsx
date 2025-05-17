import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getObjectTypeName } from './utils';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import Button from '../common/Button';

interface AddChildObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (objectData: any) => Promise<void>;
  parentId: string;
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

const LAST_SELECTED_TYPE_KEY = 'lastSelectedObjectType';

const AddChildObjectModal: React.FC<AddChildObjectModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  parentId,
  parentName
}) => {
  const [formData, setFormData] = useState({
    name: '',
    objectType: localStorage.getItem(LAST_SELECTED_TYPE_KEY) || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd({
        ...formData,
        parentId
      });
      localStorage.setItem(LAST_SELECTED_TYPE_KEY, formData.objectType);
      toast.success('Объект успешно создан');
      onClose();
      setFormData({ name: '', objectType: formData.objectType });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при создании объекта');
    }
  };

  const handleClose = () => {
    setFormData(prev => ({ ...prev, name: '' }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={handleClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Закрыть</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Добавить дочерний объект
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Родительский объект: {parentName}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                className="w-full sm:ml-3 sm:w-auto"
              >
                Создать
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChildObjectModal; 