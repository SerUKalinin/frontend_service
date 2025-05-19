import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Object } from './types';
import ObjectInfo from './ObjectInfo';
import ChildObjects from './ChildObjects';
import ObjectTreeMap from './ObjectTreeMap';
import ObjectTasks from './ObjectTasks';
import ObjectHeader from './ObjectHeader';

interface ObjectDetailsLayoutProps {
  object: Object | null;
  isLoading: boolean;
  error: string | null;
  onObjectChange: () => void;
}

const ObjectDetailsLayout: React.FC<ObjectDetailsLayoutProps> = ({ 
  object, 
  isLoading, 
  error,
  onObjectChange
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
      <ObjectHeader object={object} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ObjectInfo object={object} onObjectChange={onObjectChange} />
          {object.id && <ChildObjects parentId={object.id.toString()} parentName={object.name} />}
          {object.id && <ObjectTasks objectId={object.id.toString()} objectName={object.name} />}
        </div>
        <div className="lg:col-span-1">
          <ObjectTreeMap currentObjectId={object.id.toString()} />
        </div>
      </div>
    </div>
  );
};

export default ObjectDetailsLayout; 