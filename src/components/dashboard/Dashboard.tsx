import React from 'react';
import PageLayout from '../layout/PageLayout';
import DashboardCard from './DashboardCard';
import RecentActions from './RecentActions';
import { objectService } from '../../services/objectService';

const Dashboard: React.FC = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Главная</h1>
        
        {/* Информационные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Объекты недвижимости"
            description="Всего объектов в системе"
            link="/objects"
            color="primary"
            fetchData={async () => {
              const objects = await objectService.getAllObjects();
              return objects.length;
            }}
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

        {/* Последние действия */}
        <RecentActions />
      </div>
    </PageLayout>
  );
};

export default Dashboard; 