import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import type { Object } from './types';

interface DeleteObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
  object: Object | null;
}

const DeleteObjectModal: React.FC<DeleteObjectModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  object
}) => {
  const handleDelete = async () => {
    if (!object) return;

    try {
      await onDelete(object.id);
      toast.success('Объект успешно удален');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при удалении объекта');
    }
  };

  if (!isOpen || !object) return null;

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
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Удаление объекта
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Вы уверены, что хотите удалить объект "{object.name}"? Это действие нельзя будет отменить.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                className="sm:ml-3 sm:w-auto"
              >
                Удалить
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteObjectModal; 