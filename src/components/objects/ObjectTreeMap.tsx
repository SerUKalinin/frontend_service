import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { Object } from './types';
import { getObjectTypeName } from './utils';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import BackToParentButton from './BackToParentButton';

interface ObjectTreeMapProps {
  currentObjectId: string;
}

interface TreeNode {
  id: string;
  name: string;
  objectType: string;
  children: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  hasChildren: boolean;
}

const ObjectTreeMap: React.FC<ObjectTreeMapProps> = ({ currentObjectId }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parentObject, setParentObject] = useState<{ id: string; name: string } | null>(null);
  const navigate = useNavigate();

  const fetchChildren = async (parentId: string): Promise<TreeNode[]> => {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get<Object[]>(`http://localhost:8080/real-estate-objects/${parentId}/children`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.map(obj => ({
      id: obj.id.toString(),
      name: obj.name,
      objectType: obj.objectType,
      children: [],
      isExpanded: false,
      hasChildren: false
    }));
  };

  const checkHasChildren = async (nodeId: string): Promise<boolean> => {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get<Object[]>(`http://localhost:8080/real-estate-objects/${nodeId}/children`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.length > 0;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const children = await fetchChildren(currentObjectId);
        const childrenWithHasChildren = await Promise.all(
          children.map(async (child) => ({
            ...child,
            hasChildren: await checkHasChildren(child.id)
          }))
        );
        setTreeData(childrenWithHasChildren);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить структуру объектов');
        console.error('Error fetching tree data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [currentObjectId]);

  useEffect(() => {
    const fetchParentObject = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get<Object>(`http://localhost:8080/real-estate-objects/${currentObjectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.data.parentId) {
          const parentResponse = await axios.get<Object>(`http://localhost:8080/real-estate-objects/${response.data.parentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setParentObject({
            id: parentResponse.data.id.toString(),
            name: parentResponse.data.name
          });
        } else {
          setParentObject(null);
        }
      } catch (err) {
        console.error('Error fetching parent object:', err);
        setParentObject(null);
      }
    };

    fetchParentObject();
  }, [currentObjectId]);

  const toggleNode = async (nodeId: string) => {
    setTreeData(prevData => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            if (!node.isExpanded && node.children.length === 0) {
              node.isLoading = true;
              fetchChildren(nodeId).then(async (children) => {
                const childrenWithHasChildren = await Promise.all(
                  children.map(async (child) => ({
                    ...child,
                    hasChildren: await checkHasChildren(child.id)
                  }))
                );
                setTreeData(currentData => {
                  const updateNodeWithChildren = (nodes: TreeNode[]): TreeNode[] => {
                    return nodes.map(n => {
                      if (n.id === nodeId) {
                        return { ...n, children: childrenWithHasChildren, isExpanded: true, isLoading: false };
                      }
                      if (n.children) {
                        return { ...n, children: updateNodeWithChildren(n.children) };
                      }
                      return n;
                    });
                  };
                  return updateNodeWithChildren(currentData);
                });
              }).catch(err => {
                console.error('Error fetching children:', err);
                setTreeData(currentData => {
                  const updateNodeWithError = (nodes: TreeNode[]): TreeNode[] => {
                    return nodes.map(n => {
                      if (n.id === nodeId) {
                        return { ...n, isExpanded: false, isLoading: false };
                      }
                      if (n.children) {
                        return { ...n, children: updateNodeWithError(n.children) };
                      }
                      return n;
                    });
                  };
                  return updateNodeWithError(currentData);
                });
              });
            }
            return { ...node, isExpanded: !node.isExpanded };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      return updateNode(prevData);
    });
  };

  const handleNodeClick = (nodeId: string) => {
    navigate(`/objects/${nodeId}`);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isCurrentNode = node.id === currentObjectId;

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`
            flex items-center py-1 px-2 rounded-md cursor-pointer
            ${isCurrentNode ? 'bg-[#4361ee] text-white' : 'hover:bg-gray-100'}
          `}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        >
          {node.hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {node.isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              ) : node.isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
          )}
          <div 
            className="flex-1 ml-1"
            onClick={() => handleNodeClick(node.id)}
          >
            <div className="text-sm font-medium truncate">
              {node.name}
            </div>
            <div className={`text-xs ${isCurrentNode ? 'text-white' : 'text-gray-500'}`}>
              {getObjectTypeName(node.objectType)}
            </div>
          </div>
        </div>
        {node.isExpanded && node.children && (
          <div className="ml-2">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
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
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-gray-900">Дочерние объекты</h2>
          {parentObject && (
            <BackToParentButton
              parentId={parentObject.id}
              parentName={parentObject.name}
            />
          )}
        </div>
      </div>
      <div className="p-2 max-h-[600px] overflow-y-auto">
        {treeData.length > 0 ? (
          treeData.map(node => renderTreeNode(node))
        ) : (
          <div className="text-center text-gray-500 py-4">
            Нет дочерних объектов
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectTreeMap; 