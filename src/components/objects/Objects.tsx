import React from 'react';
import PageLayout from '../layout/PageLayout';

const Objects: React.FC = () => {
  return (
    <PageLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Список объектов</h2>
        <div className="text-gray-500">Здесь будет список объектов</div>
      </div>
    </PageLayout>
  );
};

export default Objects; 