import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { objectService } from '../../services/objectService';

interface DashboardCardProps {
  title: string;
  value?: string | number;
  description: string;
  link?: string;
  color?: 'primary' | 'success' | 'warning' | 'info';
  updatedAt?: string;
  fetchData?: () => Promise<number>;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value: initialValue, 
  description,
  link,
  color = 'primary',
  updatedAt = 'Обновлено только что',
  fetchData
}) => {
  const [value, setValue] = useState<string | number>(initialValue || '...');
  const [loading, setLoading] = useState(!!fetchData);

  useEffect(() => {
    const loadData = async () => {
      if (fetchData) {
        try {
          const count = await fetchData();
          setValue(count);
        } catch (error) {
          console.error('Error fetching data:', error);
          setValue(0);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [fetchData]);

  const colorClasses = {
    primary: 'bg-[var(--primary)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    info: 'bg-[var(--secondary)]'
  };

  const content = (
    <div className="bg-[var(--card-bg)] rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Заголовок карточки */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${colorClasses[color]}`}>
          {loading ? '...' : value}
        </span>
      </div>

      {/* Тело карточки */}
      <div className="mb-4">
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Футер карточки */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">{updatedAt}</span>
        {link && (
          <Link 
            to={link}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowRightIcon className="h-5 w-5 text-gray-600" />
          </Link>
        )}
      </div>
    </div>
  );

  return content;
};

export default DashboardCard; 