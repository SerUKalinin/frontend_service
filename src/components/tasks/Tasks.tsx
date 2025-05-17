import React from 'react';
import PageLayout from '../layout/PageLayout';

const Tasks: React.FC = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Задачи</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Список задач</h2>
          <div className="text-gray-500">Здесь будет список задач</div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Tasks; 