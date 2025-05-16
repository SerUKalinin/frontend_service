import React from 'react';
import PageLayout from '../layout/PageLayout';

const Tasks: React.FC = () => {
  return (
    <PageLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Список задач</h2>
        <div className="text-gray-500">Здесь будет список задач</div>
      </div>
    </PageLayout>
  );
};

export default Tasks; 