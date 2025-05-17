export interface Object {
  id: number;
  name: string;
  objectType: string;
  parentId: number | null;
  createdByFirstName: string;
  createdByLastName: string;
  responsibleUserFirstName: string | null;
  responsibleUserLastName: string | null;
  createdAt: string;
}

export interface ObjectsTableProps {
  objects: Object[];
  onEdit: (object: Object) => void;
  onDelete: (object: Object) => void;
} 