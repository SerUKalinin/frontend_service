import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import type { Object } from './types';

interface ObjectHeaderProps {
  object: Object;
}

interface Breadcrumb {
  id: string;
  name: string;
}

const ObjectHeader: React.FC<ObjectHeaderProps> = ({ object }) => {
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBreadcrumbs = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`http://localhost:8080/real-estate-objects/${object.id}/path`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch object path');
        }

        const path: Object[] = await response.json();
        const breadcrumbsData = path.map(obj => ({
          id: obj.id.toString(),
          name: obj.name
        }));
        setBreadcrumbs(breadcrumbsData);
      } catch (error) {
        console.error('Error fetching breadcrumbs:', error);
        // В случае ошибки показываем только текущий объект
        setBreadcrumbs([{ id: object.id.toString(), name: object.name }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreadcrumbs();
  }, [object.id]);

  const handleBreadcrumbClick = (id: string) => {
    navigate(`/objects/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/objects')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/objects')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              {index > 0 && (
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              )}
              <button
                onClick={() => handleBreadcrumbClick(crumb.id)}
                className={`text-lg font-medium hover:text-indigo-600 transition-colors ${
                  index === breadcrumbs.length - 1 
                    ? 'text-gray-900 cursor-default' 
                    : 'text-gray-500'
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ObjectHeader; 