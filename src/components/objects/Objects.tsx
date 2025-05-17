import React, { useState, useEffect } from 'react';
import PageLayout from '../layout/PageLayout';
import AddObjectButton from './AddObjectButton';
import ObjectsTable from './ObjectsTable';
import { Object } from './types';
import { toast } from 'react-toastify';
import axios from 'axios';

const Objects: React.FC = () => {
  const [objects, setObjects] = useState<Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjects = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleAddObject = () => {
    // TODO: Здесь будет логика открытия модального окна или формы добавления объекта
    console.log('Добавление нового объекта');
  };

  const handleEditObject = async (id: number) => {
    // TODO: Здесь будет логика редактирования объекта
    console.log('Редактирование объекта:', id);
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
      toast.success('Объект успешно удален');
      fetchObjects(); // Обновляем список после удаления
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ошибка при удалении объекта');
    }
  };

  if (loading) {
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
          <AddObjectButton onClick={handleAddObject} />
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          {objects.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Объекты не найдены
            </div>
          ) : (
            <ObjectsTable 
              objects={objects}
              onEdit={handleEditObject}
              onDelete={handleDeleteObject}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Objects; 