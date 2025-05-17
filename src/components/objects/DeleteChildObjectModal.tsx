import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import type { Object } from './types';

interface DeleteChildObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  object: Object | null;
  parentName: string;
}

const DeleteChildObjectModal: React.FC<DeleteChildObjectModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  object,
  parentName
}) => {
  if (!isOpen || !object) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Закрыть</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Удаление объекта
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Вы уверены, что хотите удалить объект "{object.name}" из родительского объекта "{parentName}"?
                  Это действие нельзя отменить.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button
              variant="danger"
              onClick={onDelete}
              className="w-full sm:ml-3 sm:w-auto"
            >
              Удалить
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Отмена
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChildObjectModal; 