import React from 'react';
import type { Object } from './types';
import { getObjectTypeName } from './utils';
import { 
  BuildingOfficeIcon, 
  CalendarIcon, 
  UserIcon, 
  UserGroupIcon, 
  BuildingOffice2Icon 
} from '@heroicons/react/24/outline';

interface ObjectInfoProps {
  object: Object;
}

const ObjectInfo: React.FC<ObjectInfoProps> = ({ object }) => {
  const infoItems = [
    {
      icon: BuildingOfficeIcon,
      label: 'Тип объекта',
      value: getObjectTypeName(object.objectType),
      color: 'text-blue-500'
    },
    {
      icon: CalendarIcon,
      label: 'Создан',
      value: new Date(object.createdAt).toLocaleDateString('ru-RU'),
      color: 'text-green-500'
    },
    {
      icon: UserIcon,
      label: 'Создатель',
      value: `${object.createdByFirstName} ${object.createdByLastName}`,
      color: 'text-purple-500'
    },
    {
      icon: UserGroupIcon,
      label: 'Ответственный',
      value: object.responsibleUserFirstName && object.responsibleUserLastName
        ? `${object.responsibleUserFirstName} ${object.responsibleUserLastName}`
        : 'Не назначен',
      color: 'text-orange-500'
    },
    {
      icon: BuildingOffice2Icon,
      label: 'Родительский объект',
      value: object.parentId ? 'Есть' : 'Нет',
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-base font-medium text-gray-900">Информация об объекте</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`flex-shrink-0 ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">{item.label}</dt>
                <dd className="mt-0.5 text-sm text-gray-900">{item.value}</dd>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ObjectInfo; 