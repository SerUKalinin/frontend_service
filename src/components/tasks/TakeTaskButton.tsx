import React from 'react';
import { toast } from 'react-toastify';
import { api } from '../../services/api';

interface TakeTaskButtonProps {
    taskId: number;
    onTaskChange?: () => void;
}

const TakeTaskButton: React.FC<TakeTaskButtonProps> = ({ taskId, onTaskChange }) => {
    const handleTakeTask = async () => {
        try {
            await api.post(`/tasks/${taskId}/take`, {
                status: 'IN_PROGRESS'
            });
            
            toast.success('Задача успешно взята в работу');
            onTaskChange?.(); // Используем опциональную цепочку
        } catch (error) {
            toast.error('Не удалось взять задачу в работу');
        }
    };

    return (
        <button
            onClick={handleTakeTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            Взять в работу
        </button>
    );
};

export default TakeTaskButton; 