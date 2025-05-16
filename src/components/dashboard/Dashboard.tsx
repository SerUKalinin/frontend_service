import React from 'react';
import PageLayout from '../layout/PageLayout';
import DashboardCard from './DashboardCard';

const Dashboard: React.FC = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Информационные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Объекты недвижимости"
            value="0"
            description="Всего объектов в системе"
            link="/objects"
            color="primary"
          />
          <DashboardCard
            title="Активные задачи"
            value="0"
            description="Задачи в работе"
            link="/tasks"
            color="success"
          />
          <DashboardCard
            title="Просроченные"
            value="0"
            description="Просроченные задачи"
            link="/tasks"
            color="warning"
          />
        </div>

        {/* Основной контент */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Последние действия</h2>
          <div className="text-gray-500">
            <p>Нет последних действий</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard; 