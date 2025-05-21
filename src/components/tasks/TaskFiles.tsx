import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import ImagePreviewModal from './ImagePreviewModal';

interface FileInfo {
    fileName: string;
    fileDownloadUri: string;
    fileType: string;
    size: string;
    uploadedAt: string;
}

interface TaskFilesProps {
    taskId: number;
}

const TaskFiles: React.FC<TaskFilesProps> = ({ taskId }) => {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageBlobs, setImageBlobs] = useState<Record<string, string>>({});

    // Лог при монтировании
    console.log('[TaskFiles] mounted, taskId:', taskId);

    useEffect(() => {
        console.log('[TaskFiles] useEffect, taskId:', taskId);
        fetchFiles();
    }, [taskId]);

    useEffect(() => {
        // Очищаем blob-URL при размонтировании
        return () => {
            Object.values(imageBlobs).forEach(url => URL.revokeObjectURL(url));
        };
    }, [imageBlobs]);

    const fetchFiles = async () => {
        try {
            setIsLoading(true);
            console.log('[TaskFiles] fetchFiles: requesting /api/files/task/' + taskId);
            const response = await api.get<FileInfo[]>(`/api/files/task/${taskId}`);
            console.log('[TaskFiles] Files from API:', response.data);
            setFiles(response.data);
            // Для изображений сразу подгружаем blob-URL
            response.data.forEach(file => {
                if (isImage(file.fileType)) {
                    fetchImageWithAuth(file.fileDownloadUri, file.fileName);
                }
            });
        } catch (error: any) {
            console.error('[TaskFiles] Error fetching files:', error);
            toast.error('Ошибка при загрузке списка файлов');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchImageWithAuth = async (url: string, fileName: string) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) return;
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            setImageBlobs(prev => ({ ...prev, [fileName]: blobUrl }));
        } catch {
            // ignore
        }
    };

    const handleDelete = async (fileName: string) => {
        try {
            await api.delete(`/api/files/${fileName}`);
            toast.success('Файл успешно удален');
            setImageBlobs(prev => {
                if (prev[fileName]) URL.revokeObjectURL(prev[fileName]);
                const copy = { ...prev };
                delete copy[fileName];
                return copy;
            });
            fetchFiles();
        } catch (error: any) {
            console.error('[TaskFiles] Error deleting file:', error);
            toast.error('Ошибка при удалении файла');
        }
    };

    const formatFileSize = (size: string) => {
        const bytes = parseInt(size);
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const isImage = (fileType: string) => fileType.startsWith('image/');

    const getFileIcon = (fileType: string) => {
        if (isImage(fileType)) {
            return '🖼️';
        } else if (fileType.includes('pdf')) {
            return '📄';
        } else if (fileType.includes('word')) {
            return '📝';
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            return '📊';
        } else {
            return '📎';
        }
    };

    if (isLoading) {
        return (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                Нет прикрепленных файлов
            </div>
        );
    }

    return (
        <div className="mt-4">
            <div className="space-y-2">
                {files.map((file) => (
                    <div
                        key={file.fileName}
                        className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50"
                    >
                        <div className="flex items-center space-x-3">
                            {/* Если изображение — показываем миниатюру, иначе иконку */}
                            {isImage(file.fileType) && imageBlobs[file.fileName] ? (
                                <img
                                    src={imageBlobs[file.fileName]}
                                    alt={file.fileName}
                                    className="w-12 h-12 object-cover rounded cursor-pointer border"
                                    onClick={() => setPreviewUrl(imageBlobs[file.fileName])}
                                />
                            ) : (
                                <span className="text-2xl">{getFileIcon(file.fileType)}</span>
                            )}
                            <div>
                                <a
                                    href={file.fileDownloadUri}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleString()}
                                </a>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(file.fileName)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                            title="Удалить файл"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            {/* Модальное окно для просмотра изображения */}
            <ImagePreviewModal
                isOpen={!!previewUrl}
                imageUrl={previewUrl || ''}
                onClose={() => setPreviewUrl(null)}
            />
        </div>
    );
};

export default TaskFiles; 