import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { Object } from './types';
import { getObjectTypeName } from './utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import ExpandButton from '../common/ExpandButton';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import EditChildObjectModal from './EditChildObjectModal';
import DeleteChildObjectModal from './DeleteChildObjectModal';
import AddChildObjectModal from './AddChildObjectModal';
import { toast } from 'react-toastify';

interface ChildObjectsProps {
  parentId: string;
  parentName: string;
}

const ChildObjects: React.FC<ChildObjectsProps> = ({ parentId, parentName }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [objects, setObjects] = useState<Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentObject, setCurrentObject] = useState<Object | null>(null);

  const fetchObjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get<Object[]>(`http://localhost:8080/real-estate-objects/${parentId}/children`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setObjects(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке дочерних объектов');
      console.error('Error fetching child objects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, [parentId]);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleEdit = async (updatedObject: Object) => {
    try {
      setCurrentObject(null);
      setEditModalOpen(false);
      await fetchObjects();
      setObjects(prevObjects => 
        prevObjects.map(obj => obj.id === updatedObject.id ? updatedObject : obj)
      );
    } catch (error) {
      console.error('Error updating objects list:', error);
      toast.error('Ошибка при обновлении списка объектов');
    }
  };

  const handleDelete = async () => {
    if (!currentObject) return;
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:8080/real-estate-objects/${currentObject.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Объект успешно удален');
      setCurrentObject(null);
      setDeleteModalOpen(false);
      await fetchObjects();
    } catch (err) {
      console.error('Error deleting object:', err);
      toast.error('Ошибка при удалении объекта');
    }
  };

  const handleAdd = async (objectData: any) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.post('http://localhost:8080/real-estate-objects', objectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      await fetchObjects();
    } catch (err) {
      console.error('Error adding object:', err);
      throw err;
    }
  };

  const handleEditClick = (object: Object) => {
    setCurrentObject(object);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (object: Object) => {
    setCurrentObject(object);
    setDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div 
        className="p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-medium text-gray-900">Дочерние объекты</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {objects.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <ExpandButton 
            isExpanded={isExpanded}
            onClick={handleExpandClick}
          />
        </div>
      </div>
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {objects.map((obj) => (
              <div 
                key={obj.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 h-[100px]"
              >
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/objects/${obj.id}`);
                  }}
                >
                  <p className="text-sm font-medium text-[#4361ee] truncate hover:text-[#3651d4]">
                    {obj.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getObjectTypeName(obj.objectType)}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <EditButton
                    object={obj}
                    onEdit={handleEditClick}
                  />
                  <DeleteButton
                    object={obj}
                    onDelete={handleDeleteClick}
                  />
                </div>
              </div>
            ))}

            <div 
              className="flex items-center justify-center p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#4361ee] hover:bg-gray-50 transition-colors cursor-pointer h-[100px]"
              onClick={(e) => {
                e.stopPropagation();
                setAddModalOpen(true);
              }}
            >
              <div className="flex flex-col items-center text-center">
                <PlusIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Добавить объект</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditChildObjectModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setCurrentObject(null);
        }}
        onEdit={handleEdit}
        object={currentObject}
        parentName={parentName}
      />

      <DeleteChildObjectModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCurrentObject(null);
        }}
        onDelete={handleDelete}
        object={currentObject}
        parentName={parentName}
      />

      <AddChildObjectModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
        parentId={parentId}
        parentName={parentName}
      />
    </div>
  );
};

export default ChildObjects; 