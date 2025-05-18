export interface TaskAttachment {
    id: number;
    filePath: string;
    uploadedAt: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'NEW' | 'IN_PROGRESS' | 'EXPIRED' | 'URGENT' | 'COMPLETED';
    createdAt: string;
    deadline?: string;
    realEstateObject: {
        id: number;
        name: string;
    };
    attachments?: TaskAttachment[];
} 