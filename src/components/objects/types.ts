export interface Object {
  id: number;
  name: string;
  objectType: string;
  parentId?: number;
  createdAt: string;
  createdById: number;
  createdByFirstName: string;
  createdByLastName: string;
  responsibleUserId?: number;
  responsibleUserFirstName?: string;
  responsibleUserLastName?: string;
}

export interface ObjectsTableProps {
  objects: Object[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
} 