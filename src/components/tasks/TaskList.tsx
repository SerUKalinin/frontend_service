import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Task, TaskAttachment } from '../../types/task';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
    CheckCircleIcon, 
    ClockIcon, 
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface TaskListProps {
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
    onStatusChange: (taskId: number, newStatus: string) => void;
}

type SortableField = 'title' | 'status' | 'createdAt' | 'deadline';

interface SortConfig {
    key: SortableField;
    direction: 'asc' | 'desc';
}

interface FilterConfig {
    title: string;
    status: string;
    createdAt: string;
    deadline: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick, onStatusChange }) => {
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'createdAt',
        direction: 'desc'
    });

    const [filters, setFilters] = useState<FilterConfig>({
        title: '',
        status: '',
        createdAt: '',
        deadline: ''
    });

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800';
            case 'NEW':
                return 'bg-gray-100 text-gray-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'IN_PROGRESS':
                return <ClockIcon className="h-5 w-5 text-blue-500" />;
            case 'NEW':
                return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
            case 'CANCELLED':
                return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
            default:
                return null;
        }
    };

    const handleSort = (key: SortableField) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilterChange = (field: keyof FilterConfig, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            title: '',
            status: '',
            createdAt: '',
            deadline: ''
        });
    };

    const getSortValue = (task: Task, field: SortableField) => {
        switch (field) {
            case 'title':
                return task.title;
            case 'status':
                return task.status;
            case 'createdAt':
                return new Date(task.createdAt).getTime();
            case 'deadline':
                return task.deadline ? new Date(task.deadline).getTime() : 0;
            default:
                return '';
        }
    };

    const filteredAndSortedTasks = [...tasks]
        .filter(task => {
            const titleMatch = task.title.toLowerCase().includes(filters.title.toLowerCase());
            const statusMatch = task.status.toLowerCase().includes(filters.status.toLowerCase());
            const createdAtMatch = new Date(task.createdAt).toLocaleDateString('ru-RU').includes(filters.createdAt);
            const deadlineMatch = task.deadline 
                ? new Date(task.deadline).toLocaleDateString('ru-RU').includes(filters.deadline)
                : true;

            return titleMatch && statusMatch && createdAtMatch && deadlineMatch;
        })
        .sort((a, b) => {
            const valueA = getSortValue(a, sortConfig.key);
            const valueB = getSortValue(b, sortConfig.key);

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return sortConfig.direction === 'asc'
                    ? valueA.localeCompare(valueB, 'ru')
                    : valueB.localeCompare(valueA, 'ru');
            }

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return sortConfig.direction === 'asc'
                    ? valueA - valueB
                    : valueB - valueA;
            }

            return 0;
        });

    const SortableHeader: React.FC<{ field: SortableField; children: React.ReactNode }> = ({ field, children }) => (
        <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center">
                {children}
                {sortConfig.key === field && (
                    sortConfig.direction === 'asc' ? (
                        <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )
                )}
            </div>
        </th>
    );

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'NEW':
                return 'Новая';
            case 'IN_PROGRESS':
                return 'В работе';
            case 'EXPIRED':
                return 'Просрочена';
            case 'URGENT':
                return 'Срочная';
            case 'COMPLETED':
                return 'Завершена';
            default:
                return status;
        }
    };

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Список задач</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Всего задач: {filteredAndSortedTasks.length}
                    </p>
                </div>
                <button
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    Фильтры
                </button>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFiltersVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="titleFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Название
                            </label>
                            <input
                                type="text"
                                id="titleFilter"
                                value={filters.title}
                                onChange={(e) => handleFilterChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Поиск по названию..."
                            />
                        </div>
                        <div>
                            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Статус
                            </label>
                            <input
                                type="text"
                                id="statusFilter"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Поиск по статусу..."
                            />
                        </div>
                        <div>
                            <label htmlFor="createdAtFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Дата создания
                            </label>
                            <input
                                type="text"
                                id="createdAtFilter"
                                value={filters.createdAt}
                                onChange={(e) => handleFilterChange('createdAt', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Поиск по дате создания..."
                            />
                        </div>
                        <div>
                            <label htmlFor="deadlineFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Срок выполнения
                            </label>
                            <input
                                type="text"
                                id="deadlineFilter"
                                value={filters.deadline}
                                onChange={(e) => handleFilterChange('deadline', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Поиск по сроку..."
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <XMarkIcon className="h-4 w-4 mr-2" />
                            Очистить фильтры
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader field="title">
                                Название
                            </SortableHeader>
                            <SortableHeader field="status">
                                Статус
                            </SortableHeader>
                            <SortableHeader field="createdAt">
                                Дата создания
                            </SortableHeader>
                            <SortableHeader field="deadline">
                                Срок выполнения
                            </SortableHeader>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Действия
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                        to={`/tasks/${task.id}`}
                                        className="text-[#4361ee] hover:text-[#4361ee]/80 underline cursor-pointer"
                                    >
                                        {task.title}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                        {getStatusLabel(task.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(task.createdAt).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <select
                                        value={task.status}
                                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                                        className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="NEW">Новая</option>
                                        <option value="IN_PROGRESS">В работе</option>
                                        <option value="EXPIRED">Просрочена</option>
                                        <option value="URGENT">Срочная</option>
                                        <option value="COMPLETED">Завершена</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList; 