import React from 'react';

interface FilePreviewModalProps {
    isOpen: boolean;
    fileUrl: string;
    fileType?: string;
    onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ isOpen, fileUrl, fileType, onClose }) => {
    if (!isOpen) return null;

    const isImage = fileType?.startsWith('image/');
    const isPdf = fileType === 'application/pdf';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded max-w-3xl w-full relative">
                <button
                    className="absolute top-2 right-2 text-red-500 text-xl"
                    onClick={onClose}
                >
                    ✖
                </button>

                {isImage && <img src={fileUrl} alt="Preview" className="max-h-[80vh] mx-auto" />}
                {isPdf && (
                    <iframe
                        src={fileUrl}
                        className="w-full h-[80vh]"
                        title="PDF Preview"
                    />
                )}
                {!isImage && !isPdf && (
                    <div className="text-center">
                        <p>Файл нельзя предварительно просмотреть</p>
                        <a
                            href={fileUrl}
                            download
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Скачать файл
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilePreviewModal;
