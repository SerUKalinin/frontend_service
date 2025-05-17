import React, { useState, useEffect } from 'react';
import PageLayout from '../layout/PageLayout';
import AddObjectButton from './AddObjectButton';
import ObjectsTable from './ObjectsTable';
import type { Object } from './types';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddObjectModal from './AddObjectModal';
import EditObjectModal from './EditObjectModal';
import DeleteObjectModal from './DeleteObjectModal';

const Objects: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<Object | null>(null);
  const [objects, setObjects] = useState<Object[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchObjects = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get<Object[]>('http://localhost:8080/real-estate-objects', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setObjects(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке объектов');
      toast.error(err.response?.data?.message || 'Ошибка при загрузке объектов');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleAddObject = async (objectData: any) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post<Object>(
        'http://localhost:8080/real-estate-objects',
        {
          name: objectData.name,
          objectType: objectData.objectType,
          parentId: objectData.parentId || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setObjects(prev => [...prev, response.data]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при создании объекта');
      throw error;
    }
  };

  const handleEditObject = async (id: number, objectData: any) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.put<Object>(
        `http://localhost:8080/real-estate-objects/${id}`,
        {
          name: objectData.name,
          objectType: objectData.objectType,
          parentId: objectData.parentId || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setObjects(prev => prev.map(obj => obj.id === id ? response.data : obj));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при обновлении объекта');
      throw error;
    }
  };

  const handleDeleteObject = async (id: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:8080/real-estate-objects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setObjects(prev => prev.filter(obj => obj.id !== id));
    } catch (error: any) {
      throw error;
    }
  };

  const handleEditClick = (object: Object) => {
    setSelectedObject(object);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (object: Object) => {
    setSelectedObject(object);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchObjects}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Попробовать снова
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Объекты</h1>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="h-5 w-5 inline-block mr-2" />
              Добавить объект
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          {objects.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Объекты не найдены
            </div>
          ) : (
            <ObjectsTable 
              objects={objects}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      <AddObjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddObject}
        parentObjects={objects.map(obj => ({
          id: obj.id.toString(),
          name: obj.name,
          objectType: obj.objectType
        }))}
      />

      <EditObjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedObject(null);
        }}
        onEdit={handleEditObject}
        object={selectedObject}
        parentObjects={objects.map(obj => ({
          id: obj.id.toString(),
          name: obj.name,
          objectType: obj.objectType
        }))}
      />

      <DeleteObjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedObject(null);
        }}
        onDelete={handleDeleteObject}
        object={selectedObject}
      />
    </PageLayout>
  );
};

export default Objects; 