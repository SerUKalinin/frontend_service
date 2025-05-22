import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import TaskFileUpload from './TaskFileUpload';
import TaskFiles from './TaskFiles';

interface TaskDetailsProps {
    onTaskUpdated?: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ onTaskUpdated }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<any>(null);
    const [filesKey, setFilesKey] = useState(0);

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/tasks/${id}`);
            setTask(response.data);
            setEditedTask(response.data);
        } catch (error) {
            console.error('Error fetching task:', error);
            toast.error('Ошибка при загрузке задачи');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.put(`/tasks/${id}`, editedTask);
            setTask(editedTask);
            setIsEditing(false);
            toast.success('Задача успешно обновлена');
            onTaskUpdated?.();
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Ошибка при обновлении задачи');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
            try {
                await api.delete(`/tasks/${id}`);
                toast.success('Задача успешно удалена');
                navigate('/tasks');
            } catch (error) {
                console.error('Error deleting task:', error);
                toast.error('Ошибка при удалении задачи');
            }
        }
    };

    const handleFilesChanged = () => setFilesKey(prev => prev + 1);

    // Логи для отладки
    console.log('[TaskDetails] task:', task);
    console.log('[TaskDetails] task.id:', task?.id);

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    if (!task) {
        return <div>Задача не найдена</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedTask.title}
                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                            className="border rounded px-2 py-1 w-full"
                        />
                    ) : (
                        task.title
                    )}
                </h2>
                <div className="space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Сохранить
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedTask(task);
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Отмена
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Удалить
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Описание</h3>
                    {isEditing ? (
                        <textarea
                            value={editedTask.description}
                            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                            className="border rounded px-2 py-1 w-full h-32"
                        />
                    ) : (
                        <p className="text-gray-600">{task.description || 'Нет описания'}</p>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Статус</h3>
                    {isEditing ? (
                        <select
                            value={editedTask.status}
                            onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                            className="border rounded px-2 py-1"
                        >
                            <option value="NEW">Новая</option>
                            <option value="IN_PROGRESS">В процессе</option>
                            <option value="COMPLETED">Завершена</option>
                            <option value="EXPIRED">Просрочена</option>
                            <option value="URGENT">Срочная</option>
                        </select>
                    ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {task.status}
                        </span>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Дедлайн</h3>
                    {isEditing ? (
                        <input
                            type="datetime-local"
                            value={editedTask.deadline ? new Date(editedTask.deadline).toISOString().slice(0, 16) : ''}
                            onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                            className="border rounded px-2 py-1"
                        />
                    ) : (
                        <p className="text-gray-600">
                            {task.deadline ? new Date(task.deadline).toLocaleString() : 'Не установлен'}
                        </p>
                    )}
                </div>

                {task?.id && (
                  <div className="max-w-xl mx-auto space-y-4">
                    <div style={{color: 'red', fontWeight: 'bold'}}>DEBUG: taskId={String(task.id)}</div>
                    <TaskFiles key={filesKey} taskId={task.id} />
                    <TaskFileUpload taskId={task.id} onFileUploaded={handleFilesChanged} />
                  </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails; 