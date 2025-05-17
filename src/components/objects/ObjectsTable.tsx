import React, { useState } from 'react';
import { PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ObjectsTableProps } from './types';
import { getObjectTypeName } from './utils';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-yellow-100 text-yellow-800'
};

const statusLabels = {
  active: 'Активен',
  inactive: 'Неактивен',
  maintenance: 'На обслуживании'
};

type SortField = 'name' | 'objectType' | 'createdBy' | 'responsibleUser' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface FilterConfig {
  name: string;
  objectType: string;
  createdBy: string;
  responsibleUser: string;
  createdAt: string;
}

const ObjectsTable: React.FC<ObjectsTableProps> = ({ objects, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc'
  });

  const [filters, setFilters] = useState<FilterConfig>({
    name: '',
    objectType: '',
    createdBy: '',
    responsibleUser: '',
    createdAt: ''
  });

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const getSortValue = (object: any, field: SortField) => {
    switch (field) {
      case 'name':
        return object.name;
      case 'objectType':
        return getObjectTypeName(object.objectType);
      case 'createdBy':
        return `${object.createdByFirstName} ${object.createdByLastName}`;
      case 'responsibleUser':
        return object.responsibleUserFirstName && object.responsibleUserLastName
          ? `${object.responsibleUserFirstName} ${object.responsibleUserLastName}`
          : 'Не назначен';
      case 'createdAt':
        return new Date(object.createdAt).getTime();
      default:
        return '';
    }
  };

  const handleFilterChange = (field: keyof FilterConfig, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      objectType: '',
      createdBy: '',
      responsibleUser: '',
      createdAt: ''
    });
  };

  const filteredAndSortedObjects = [...objects]
    .filter(object => {
      const nameMatch = object.name.toLowerCase().includes(filters.name.toLowerCase());
      const typeMatch = getObjectTypeName(object.objectType).toLowerCase().includes(filters.objectType.toLowerCase());
      const createdByMatch = `${object.createdByFirstName} ${object.createdByLastName}`.toLowerCase().includes(filters.createdBy.toLowerCase());
      const responsibleMatch = (object.responsibleUserFirstName && object.responsibleUserLastName
        ? `${object.responsibleUserFirstName} ${object.responsibleUserLastName}`
        : 'Не назначен').toLowerCase().includes(filters.responsibleUser.toLowerCase());
      const dateMatch = new Date(object.createdAt).toLocaleDateString('ru-RU').includes(filters.createdAt);

      return nameMatch && typeMatch && createdByMatch && responsibleMatch && dateMatch;
    })
    .sort((a, b) => {
      const valueA = getSortValue(a, sortConfig.field);
      const valueB = getSortValue(b, sortConfig.field);

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB, 'ru')
          : valueB.localeCompare(valueA, 'ru');
      }

      return sortConfig.direction === 'asc'
        ? valueA - valueB
        : valueB - valueA;
    });

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        {sortConfig.field === field && (
          sortConfig.direction === 'asc' ? (
            <ChevronUpIcon className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDownIcon className="ml-1 h-4 w-4" />
          )
        )}
      </div>
    </th>
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Список объектов недвижимости</h2>
          <p className="mt-1 text-sm text-gray-500">
            Всего объектов: {filteredAndSortedObjects.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFiltersVisible && Object.values(filters).some(value => value !== '') && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Очистить фильтры
            </button>
          )}
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {isFiltersVisible ? 'Скрыть фильтры' : 'Показать фильтры'}
            {Object.values(filters).some(value => value !== '') && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Активны
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Панель фильтров с анимацией */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFiltersVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="nameFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Название
              </label>
              <input
                type="text"
                id="nameFilter"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Поиск по названию..."
              />
            </div>
            <div>
              <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Тип объекта
              </label>
              <input
                type="text"
                id="typeFilter"
                value={filters.objectType}
                onChange={(e) => handleFilterChange('objectType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Поиск по типу..."
              />
            </div>
            <div>
              <label htmlFor="createdByFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Создатель
              </label>
              <input
                type="text"
                id="createdByFilter"
                value={filters.createdBy}
                onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Поиск по создателю..."
              />
            </div>
            <div>
              <label htmlFor="responsibleFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Ответственный
              </label>
              <input
                type="text"
                id="responsibleFilter"
                value={filters.responsibleUser}
                onChange={(e) => handleFilterChange('responsibleUser', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Поиск по ответственному..."
              />
            </div>
            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Дата создания
              </label>
              <input
                type="text"
                id="dateFilter"
                value={filters.createdAt}
                onChange={(e) => handleFilterChange('createdAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Поиск по дате..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="name">
                Название
              </SortableHeader>
              <SortableHeader field="objectType">
                Тип объекта
              </SortableHeader>
              <SortableHeader field="createdBy">
                Создатель
              </SortableHeader>
              <SortableHeader field="responsibleUser">
                Ответственный
              </SortableHeader>
              <SortableHeader field="createdAt">
                Дата создания
              </SortableHeader>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedObjects.map((object) => (
              <tr key={object.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {object.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getObjectTypeName(object.objectType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {`${object.createdByFirstName} ${object.createdByLastName}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {object.responsibleUserFirstName && object.responsibleUserLastName
                    ? `${object.responsibleUserFirstName} ${object.responsibleUserLastName}`
                    : 'Не назначен'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(object.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(object.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(object.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ObjectsTable; 