import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Object } from './types';
import { getObjectTypeName } from './utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import ExpandButton from '../common/ExpandButton';

interface ChildObjectsProps {
  parentId: string;
}

const ChildObjects: React.FC<ChildObjectsProps> = ({ parentId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [childObjects, setChildObjects] = useState<Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildObjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get<Object[]>(`http://localhost:8080/real-estate-objects/${parentId}/children`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setChildObjects(response.data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить дочерние объекты');
        console.error('Error fetching child objects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildObjects();
  }, [parentId]);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div 
        className="p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-medium text-gray-900">Дочерние объекты</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {childObjects.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#4361ee] hover:bg-[#3651d4] focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Добавить логику создания нового дочернего объекта
            }}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Добавить
          </button>
          <ExpandButton 
            isExpanded={isExpanded}
            onClick={handleExpandClick}
          />
        </div>
      </div>
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4">
          {childObjects.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Дочерние объекты отсутствуют
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {childObjects.map((child) => (
                <div 
                  key={child.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    // TODO: Добавить навигацию к дочернему объекту
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#4361ee] truncate">
                      {child.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getObjectTypeName(child.objectType)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildObjects; 