import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import type { Object } from './types';
import ObjectInfo from './ObjectInfo';
import ChildObjects from './ChildObjects';
import ObjectTreeMap from './ObjectTreeMap';

interface ObjectDetailsLayoutProps {
  object: Object | null;
  isLoading: boolean;
  error: string | null;
}

const ObjectDetailsLayout: React.FC<ObjectDetailsLayoutProps> = ({ 
  object, 
  isLoading, 
  error 
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !object) {
    return (
      <div className="text-center text-red-600">
        <p>{error || 'Объект не найден'}</p>
        <button
          onClick={() => navigate('/objects')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/objects')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{object.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ObjectInfo object={object} />
          {object.id && <ChildObjects parentId={object.id.toString()} parentName={object.name} />}
        </div>
        <div className="lg:col-span-1">
          <ObjectTreeMap currentObjectId={object.id.toString()} />
        </div>
      </div>
    </div>
  );
};

export default ObjectDetailsLayout; 