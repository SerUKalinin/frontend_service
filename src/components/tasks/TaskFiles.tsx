import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import FilePreviewModal from './FilePreviewModalProps';

interface FileInfo {
    fileName: string;           // UUID, используется для API
    originalFileName: string;   // отображаемое имя файла
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
    const [previewType, setPreviewType] = useState<string | undefined>(undefined);
    const [fileBlobs, setFileBlobs] = useState<Record<string, string>>({});

    // -------------------- Fetch files --------------------
    useEffect(() => {
        fetchFiles();
        return () => {
            // очищаем все созданные blob URL при размонтировании
            Object.values(fileBlobs).forEach(URL.revokeObjectURL);
        };
    }, [taskId]);

    const fetchFiles = async () => {
        try {
            setIsLoading(true);
            const response = await api.get<FileInfo[]>(`/api/files/task/${taskId}`);
            setFiles(response.data);

            // Для файлов, которые можно превью, создаём blob URL
            response.data.forEach(file => {
                if (canPreview(file.fileType)) {
                    fetchFileBlob(file.fileDownloadUri, file.fileName);
                }
            });
        } catch (error: any) {
            console.error('[TaskFiles] fetchFiles error:', error);
            toast.error('Ошибка при загрузке файлов');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFileBlob = async (url: string, fileName: string) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            setFileBlobs(prev => ({ ...prev, [fileName]: blobUrl }));
        } catch {
            // игнорируем ошибки
        }
    };

    // -------------------- Delete --------------------
    const handleDelete = async (fileName: string) => {
        try {
            await api.delete(`/api/files/${fileName}`);
            toast.success('Файл успешно удален');

            setFileBlobs(prev => {
                if (prev[fileName]) URL.revokeObjectURL(prev[fileName]);
                const copy = { ...prev };
                delete copy[fileName];
                return copy;
            });

            setFiles(prev => prev.filter(f => f.fileName !== fileName));
        } catch (error: any) {
            console.error('[TaskFiles] handleDelete error:', error);
            toast.error('Ошибка при удалении файла');
        }
    };

    // -------------------- Helpers --------------------
    const canPreview = (fileType: string) => {
        return fileType.startsWith('image/') || fileType === 'application/pdf';
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return '🖼️';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word')) return '📝';
        if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
        return '📎';
    };

    const formatFileSize = (size: string) => {
        const bytes = parseInt(size);
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    };

    // -------------------- Render --------------------
    if (isLoading) {
        return (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    if (!files.length) {
        return (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                Нет прикрепленных файлов
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-2">
            {files.map(file => (
                <div
                    key={file.fileName}
                    className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50"
                >
                    <div className="flex items-center space-x-3">
                        {canPreview(file.fileType) && fileBlobs[file.fileName] ? (
                            <img
                                src={fileBlobs[file.fileName]}
                                alt={file.originalFileName}
                                className={`w-12 h-12 object-cover rounded cursor-pointer border ${
                                    file.fileType.startsWith('image/') ? '' : 'hidden'
                                }`}
                                onClick={() => {
                                    setPreviewUrl(fileBlobs[file.fileName]);
                                    setPreviewType(file.fileType);
                                }}
                            />
                        ) : (
                            <span className="text-2xl cursor-pointer"
                                  onClick={() => {
                                      setPreviewUrl(fileBlobs[file.fileName] || file.fileDownloadUri);
                                      setPreviewType(file.fileType);
                                  }}
                            >
                                {getFileIcon(file.fileType)}
                            </span>
                        )}

                        <div>
                            <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                                  onClick={() => {
                                      setPreviewUrl(fileBlobs[file.fileName] || file.fileDownloadUri);
                                      setPreviewType(file.fileType);
                                  }}
                            >
                                {file.originalFileName} • {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(file.fileName)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                        title="Удалить файл"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ))}

            <FilePreviewModal
                isOpen={!!previewUrl}
                fileUrl={previewUrl || ''}
                fileType={previewType}
                onClose={() => {
                    setPreviewUrl(null);
                    setPreviewType(undefined);
                }}
            />
        </div>
    );
};

export default TaskFiles;
