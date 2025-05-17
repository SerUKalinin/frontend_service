import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getObjectTypeName } from './utils';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import Button from '../common/Button';

interface AddObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (objectData: any) => Promise<void>;
  parentObjects: Array<{ id: string; name: string; objectType: string }>;
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

const AddObjectModal: React.FC<AddObjectModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  parentObjects
}) => {
  const [formData, setFormData] = useState({
    parentId: '',
    name: '',
    objectType: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(formData);
      toast.success('Объект успешно создан');
      setTimeout(() => {
        onClose();
        setFormData({ parentId: '', name: '', objectType: '' });
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при создании объекта');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
              >
                <span className="sr-only">Закрыть</span>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  Добавить новый объект
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
                      Родительский объект
                    </label>
                    <select
                      id="parentId"
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Нет родительского объекта</option>
                      {parentObjects.map((obj) => (
                        <option key={obj.id} value={obj.id}>
                          {obj.name} ({getObjectTypeName(obj.objectType)})
                        </option>
                      ))}
                    </select>
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
                      Создать
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
    </>
  );
};

export default AddObjectModal; 