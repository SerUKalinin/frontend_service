import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { api } from '../../services/api';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskAdded: (task: any) => void;
}

interface RealEstateObject {
    id: number;
    address: string;
    name: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onTaskAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        realEstateObjectId: ''
    });
    const [realEstateObjects, setRealEstateObjects] = useState<RealEstateObject[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRealEstateObjects = async () => {
            try {
                console.log('Starting to fetch real estate objects...');
                const response = await api.get<RealEstateObject[]>('/real-estate-objects');
                console.log('Raw response:', response);
                console.log('Response data:', response.data);
                console.log('Response data type:', typeof response.data);
                console.log('Is array?', Array.isArray(response.data));
                
                if (Array.isArray(response.data)) {
                    console.log('Number of objects:', response.data.length);
                    setRealEstateObjects(response.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setError('Неверный формат данных от сервера');
                }
            } catch (err) {
                console.error('Error details:', err);
                setError('Ошибка при загрузке объектов недвижимости');
            }
        };

        if (isOpen) {
            console.log('Modal opened, fetching objects...');
            fetchRealEstateObjects();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.realEstateObjectId) {
            setError('Пожалуйста, выберите объект недвижимости');
            return;
        }

        try {
            const taskData = {
                ...formData,
                realEstateObjectId: parseInt(formData.realEstateObjectId)
            };
            console.log('Creating task with data:', taskData);
            const response = await api.post('/tasks', taskData);
            console.log('Task created:', response.data);
            onTaskAdded(response.data);
            onClose();
        } catch (err: any) {
            console.error('Error creating task:', err);
            setError(err.response?.data?.message || 'Ошибка при создании задачи');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Новая задача</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Input
                                label="Название"
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Введите название задачи"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Описание
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Введите описание задачи"
                            />
                        </div>

                        <div>
                            <Input
                                label="Срок выполнения"
                                type="datetime-local"
                                value={formData.deadline}
                                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                            />
                        </div>

                        <div>
                            <Select
                                label="Объект недвижимости"
                                value={formData.realEstateObjectId}
                                onChange={(e) => setFormData(prev => ({ ...prev, realEstateObjectId: e.target.value }))}
                                required
                            >
                                <option value="">Выберите объект недвижимости</option>
                                {realEstateObjects.map(obj => (
                                    <option key={obj.id} value={obj.id}>
                                        {obj.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                        >
                            Создать
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal; 