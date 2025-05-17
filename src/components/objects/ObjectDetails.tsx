import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PageLayout from '../layout/PageLayout';
import type { Object } from './types';
import axios from 'axios';
import { toast } from 'react-toastify';
import ObjectInfo from './ObjectInfo';

const ObjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [object, setObject] = useState<Object | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObject = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get<Object>(`http://localhost:8080/real-estate-objects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setObject(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка при загрузке объекта');
        toast.error(err.response?.data?.message || 'Ошибка при загрузке объекта');
      } finally {
        setIsLoading(false);
      }
    };

    fetchObject();
  }, [id]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (error || !object) {
    return (
      <PageLayout>
        <div className="text-center text-red-600">
          <p>{error || 'Объект не найден'}</p>
          <button
            onClick={() => navigate('/objects')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Вернуться к списку
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
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

        <ObjectInfo object={object} />
      </div>
    </PageLayout>
  );
};

export default ObjectDetails; 