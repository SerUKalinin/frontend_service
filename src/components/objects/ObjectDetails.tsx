import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { Object } from './types';
import PageLayout from '../layout/PageLayout';
import ObjectDetailsLayout from './ObjectDetailsLayout';

const ObjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [object, setObject] = useState<Object | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchObject();
  }, [id]);

  return (
    <PageLayout>
      <ObjectDetailsLayout
        object={object}
        isLoading={isLoading}
        error={error}
        onObjectChange={fetchObject}
      />
    </PageLayout>
  );
};

export default ObjectDetails; 