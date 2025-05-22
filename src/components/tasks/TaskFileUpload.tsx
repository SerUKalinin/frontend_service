import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../services/api';

interface FileUploadResponse {
    fileName: string;
    fileDownloadUri: string;
    fileType: string;
    size: string;
}

interface TaskFileUploadProps {
    taskId: number;
    onFileUploaded?: () => void;
}

const TaskFileUpload: React.FC<TaskFileUploadProps> = ({ taskId, onFileUploaded }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        await uploadFiles(files);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            await uploadFiles(files);
        }
    };

    const uploadFiles = async (files: File[]) => {
        if (files.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        
        formData.append('taskId', taskId.toString());
        
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            console.log('Uploading files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
            
            const response = await api.post<FileUploadResponse[]>('/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: [(data: any) => data],
            });

            console.log('Upload response:', response);

            if (response.status === 200) {
                const uploadedFiles = response.data;
                toast.success(`Успешно загружено файлов: ${uploadedFiles.length}`);
                onFileUploaded?.();
            } else {
                throw new Error('Ошибка при загрузке файлов');
            }
        } catch (error: any) {
            console.error('Upload error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            
            const errorMessage = error.response?.data?.message || 'Ошибка при загрузке файлов';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mt-4">
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragging 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-2">
                        <svg 
                            className="mx-auto h-12 w-12 text-gray-400" 
                            stroke="currentColor" 
                            fill="none" 
                            viewBox="0 0 48 48" 
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                                Загрузить файлы
                            </span>
                            {' '}или перетащите их сюда
                        </div>
                        <p className="text-xs text-gray-500">
                            Поддерживаются любые типы файлов
                        </p>
                    </div>
                </label>
            </div>
            {isUploading && (
                <div className="mt-2 text-sm text-gray-500 text-center">
                    Загрузка файлов...
                </div>
            )}
        </div>
    );
};

export default TaskFileUpload; 