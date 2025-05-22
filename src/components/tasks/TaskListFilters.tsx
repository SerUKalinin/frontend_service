import React from 'react';

interface FilterConfig {
    title: string;
    status: string;
    createdAt: string;
    deadline: string;
}

interface TaskListFiltersProps {
    filters: FilterConfig;
    onFilterChange: (field: keyof FilterConfig, value: string) => void;
    onClearFilters: () => void;
    isVisible: boolean;
}

const TaskListFilters: React.FC<TaskListFiltersProps> = ({ filters, onFilterChange, onClearFilters, isVisible }) => {
    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
                            onChange={e => onFilterChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Поиск по названию..."
                        />
                    </div>
                    <div>
                        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                            Статус
                        </label>
                        <select
                            id="statusFilter"
                            value={filters.status}
                            onChange={e => onFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Все</option>
                            <option value="NEW">Новая</option>
                            <option value="IN_PROGRESS">В работе</option>
                            <option value="EXPIRED">Просрочена</option>
                            <option value="URGENT">Срочная</option>
                            <option value="COMPLETED">Завершена</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="createdAtFilter" className="block text-sm font-medium text-gray-700 mb-1">
                            Дата создания
                        </label>
                        <input
                            type="text"
                            id="createdAtFilter"
                            value={filters.createdAt}
                            onChange={e => onFilterChange('createdAt', e.target.value)}
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
                            onChange={e => onFilterChange('deadline', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Поиск по сроку..."
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClearFilters}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Очистить фильтры
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskListFilters; 