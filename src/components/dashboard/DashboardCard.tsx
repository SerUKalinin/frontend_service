import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  link?: string;
  color?: 'primary' | 'success' | 'warning' | 'info';
  updatedAt?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  description,
  link,
  color = 'primary',
  updatedAt = 'Обновлено только что'
}) => {
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
          {value}
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