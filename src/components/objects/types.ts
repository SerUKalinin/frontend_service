export interface Object {
  id: number;
  name: string;
  objectType: string;
  parentId: number | null;
  createdAt: string;
  createdById: number;
  createdByFirstName: string;
  createdByLastName: string;
  responsibleUserId: number | null;
  responsibleUserFirstName: string | null;
  responsibleUserLastName: string | null;
  responsibleUserRole: string | null;
}

export interface ObjectsTableProps {
  objects: Object[];
  onEdit: (object: Object) => void;
  onDelete: (object: Object) => void;
} 