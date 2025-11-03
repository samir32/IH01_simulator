import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from './language-context';

export interface TreeItemData {
  id: string;
  code: string;
  description: string;
  type: 'location' | 'equipment' | 'assembly' | 'part';
  quantity?: number;
  unit?: string;
  children?: TreeItemData[];
  isExpanded?: boolean;
}

// Function to sort tree data by ID recursively
function sortTreeByID(data: TreeItemData[]): TreeItemData[] {
  return data
    .map(item => ({
      ...item,
      children: item.children ? sortTreeByID(item.children) : undefined
    }))
    .sort((a, b) => {
      // Convert IDs to numbers for proper numeric sorting
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      
      // If both are valid numbers, sort numerically
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      
      // If one or both are not numbers, sort alphabetically
      return a.id.localeCompare(b.id);
    });
}

const defaultTreeData: TreeItemData[] = [
  {
    id: '1',
    code: '031T2-K2',
    description: 'TRAIN DE LAMINAGE',
    type: 'location',
    children: [
      {
        id: '2',
        code: '031472',
        description: 'CONVEYOR SYSTEM #1064743',
        type: 'equipment',
        quantity: 1,
        unit: 'EA',
        children: [
          {
            id: '3',
            code: '031472-ASM01',
            description: 'DRIVE ASSEMBLY',
            type: 'assembly',
            quantity: 1,
            unit: 'EA',
            children: [
              {
                id: '4',
                code: '711022',
                description: 'MOTOR, 5HP #1073362',
                type: 'part',
                quantity: 1,
                unit: 'EA'
              },
              {
                id: '5',
                code: '570612',
                description: 'COUPLING, FLEXIBLE #1673168',
                type: 'part',
                quantity: 1,
                unit: 'EA'
              }
            ]
          },
          {
            id: '6',
            code: '031472-ASM02',
            description: 'BELT ASSEMBLY',
            type: 'assembly',
            quantity: 1,
            unit: 'EA',
            children: [
              {
                id: '7',
                code: '570613',
                description: 'CONVEYOR BELT, 1200MM #1673198',
                type: 'part',
                quantity: 1,
                unit: 'EA'
              },
              {
                id: '8',
                code: '570614',
                description: 'BELT TENSIONER #167536E',
                type: 'part',
                quantity: 2,
                unit: 'EA'
              }
            ]
          }
        ]
      },
      {
        id: '9',
        code: '030776',
        description: 'PACKAGING MACHINE #644596DA',
        type: 'equipment',
        quantity: 1,
        unit: 'EA',
        children: [
          {
            id: '10',
            code: '030776-ASM01',
            description: 'SEALING UNIT ASSEMBLY',
            type: 'assembly',
            quantity: 1,
            unit: 'EA',
            children: [
              {
                id: '11',
                code: '570631',
                description: 'HEATING ELEMENT #167538E',
                type: 'part',
                quantity: 2,
                unit: 'EA'
              },
              {
                id: '12',
                code: '711023',
                description: 'TEMPERATURE SENSOR #1073363',
                type: 'part',
                quantity: 1,
                unit: 'EA'
              }
            ]
          }
        ]
      }
    ]
  }
];

// Function to get the first root item's code
function getFirstRootCode(data: TreeItemData[]): string {
  if (data.length > 0) {
    return data[0].code;
  }
  return '031T2-K2'; // fallback
}

interface FlattenedNode {
  id: string;
  code: string;
  pathDescriptions: string[];
}

function flattenTreeWithPaths(items: TreeItemData[], ancestors: TreeItemData[] = []): FlattenedNode[] {
  const result: FlattenedNode[] = [];

  items.forEach(item => {
    const currentPath = [...ancestors, item];
    result.push({
      id: item.id,
      code: item.code,
      pathDescriptions: currentPath.map(node => node.description || node.code)
    });

    if (item.children) {
      result.push(...flattenTreeWithPaths(item.children, currentPath));
    }
  });

  return result;
}

function findItemById(items: TreeItemData[], targetId: string): TreeItemData | null {
  for (const item of items) {
    if (item.id === targetId) {
      return item;
    }

    if (item.children) {
      const found = findItemById(item.children, targetId);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function collectDescendantIds(item: TreeItemData | null): Set<string> {
  const ids = new Set<string>();

  if (!item) {
    return ids;
  }

  const stack = [...(item.children ?? [])];

  while (stack.length > 0) {
    const current = stack.pop()!;
    ids.add(current.id);
    if (current.children) {
      stack.push(...current.children);
    }
  }

  return ids;
}

interface ParentOption {
  id: string | null;
  label: string;
}

interface TreeItemProps {
  item: TreeItemData;
  level: number;
  parentId: string | null;
  getParentOptions: (itemId: string) => ParentOption[];
  onUpdate: (item: TreeItemData, newParentId: string | null, previousParentId: string | null) => void;
  onDelete: (id: string) => void;
  onAdd: (parentId: string) => void;
}

function TreeItem({ item, level, parentId, getParentOptions, onUpdate, onDelete, onAdd }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(item.isExpanded || false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    code: item.code,
    description: item.description,
    type: item.type,
    quantity: item.quantity?.toString() || '',
    unit: item.unit || '',
    parentId: parentId ?? ''
  });
  const { t } = useLanguage();
  const parentOptions = useMemo(() => getParentOptions(item.id), [getParentOptions, item.id]);

  useEffect(() => {
    if (!isEditing) {
      setEditForm({
        code: item.code,
        description: item.description,
        type: item.type,
        quantity: item.quantity?.toString() || '',
        unit: item.unit || '',
        parentId: parentId ?? ''
      });
    }
  }, [item, parentId, isEditing]);

  const hasChildren = item.children && item.children.length > 0;

  const getIcon = () => {
    if (hasChildren) {
      return isExpanded ? '⊟' : '⊞';
    }
    
    switch (item.type) {
      case 'location':
        return '🏭';
      case 'equipment':
        return '🔧';
      case 'assembly':
        return '📦';
      case 'part':
        return '🔩';
      default:
        return '•';
    }
  };
  
  // SAP-style color coding
  const getSapRowColor = () => {
    switch (item.type) {
      case 'location':
        return 'bg-gray-100'; // Grey for functional locations
      case 'equipment':
        return 'bg-green-100'; // Green for equipment
      case 'assembly':
        return 'bg-yellow-100'; // Yellow for assemblies
      case 'part':
        return 'bg-red-100'; // Red for parts
      default:
        return 'bg-white';
    }
  };
  
  const handleSave = () => {
    const updatedItem: TreeItemData = {
      ...item,
      code: editForm.code,
      description: editForm.description,
      type: editForm.type as TreeItemData['type'],
      quantity: editForm.quantity ? parseInt(editForm.quantity) : undefined,
      unit: editForm.unit || undefined
    };
    onUpdate(updatedItem, editForm.parentId ? editForm.parentId : null, parentId);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      code: item.code,
      description: item.description,
      type: item.type,
      quantity: item.quantity?.toString() || '',
      unit: item.unit || '',
      parentId: parentId ?? ''
    });
    setIsEditing(false);
  };

  const currentParentLabel = parentOptions.find(option => option.id === (parentId ?? null))?.label || '(root level)';

  const startEditing = () => {
    setEditForm({
      code: item.code,
      description: item.description,
      type: item.type,
      quantity: item.quantity?.toString() || '',
      unit: item.unit || '',
      parentId: parentId ?? ''
    });
    setIsEditing(true);
  };
  
  return (
    <div>
      <div 
        className={`flex items-center hover:bg-gray-200 border-b border-gray-300 ${getSapRowColor()}`}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
      >
        <button 
          className="w-4 h-4 text-xs mr-1 hover:bg-gray-300"
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        >
          {getIcon()}
        </button>
        
        {isEditing ? (
          <div className="flex-1 min-w-0 grid tree-grid gap-1 py-1 text-xs items-center">
            <input
              type="text"
              value={editForm.code}
              onChange={(e) => setEditForm({...editForm, code: e.target.value})}
              className="border border-gray-400 px-1 bg-white min-w-0 truncate"
            />
            <input
              type="text"
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              className="border border-gray-400 px-1 bg-white min-w-0 truncate"
            />
            <input
              type="text"
              value={editForm.quantity}
              onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
              className="border border-gray-400 px-1 bg-white text-center min-w-0 truncate"
            />
            <input
              type="text"
              value={editForm.unit}
              onChange={(e) => setEditForm({...editForm, unit: e.target.value})}
              className="border border-gray-400 px-1 bg-white text-center min-w-0 truncate"
            />
            <select
              value={editForm.type}
              onChange={(e) => setEditForm({...editForm, type: e.target.value as TreeItemData['type']})}
              className="border border-gray-400 px-1 bg-white text-xs min-w-0 truncate"
            >
              <option value="location">{t('type.location')}</option>
              <option value="equipment">{t('type.equipment')}</option>
              <option value="assembly">{t('type.assembly')}</option>
              <option value="part">{t('type.part')}</option>
            </select>
            <select
              value={editForm.parentId}
              onChange={(e) => setEditForm({ ...editForm, parentId: e.target.value })}
              className="border border-gray-400 px-1 bg-white text-xs min-w-0 truncate"
            >
              {parentOptions.map(option => (
                <option key={option.id ?? 'root'} value={option.id ?? ''}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex gap-1 justify-end">
              <button
                onClick={handleSave}
                className="bg-green-200 hover:bg-green-300 px-1 border border-gray-400 text-xs"
              >
                ✓
              </button>
              <button 
                onClick={handleCancel}
                className="bg-red-200 hover:bg-red-300 px-1 border border-gray-400 text-xs"
              >
                ✗
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0 grid tree-grid gap-1 py-1 text-xs items-center">
            <div className="text-blue-600 whitespace-nowrap">{item.code}</div>
            <div className="truncate" title={item.description}>{item.description}</div>
            <div className="text-center whitespace-nowrap">{item.quantity || ''}</div>
            <div className="text-center whitespace-nowrap">{item.unit || ''}</div>
            <div className="text-center">
              {item.type === 'location' && '🏭'}
              {item.type === 'equipment' && '🔧'}
              {item.type === 'assembly' && '📦'}
              {item.type === 'part' && '🔩'}
            </div>
            <div className="truncate" title={currentParentLabel}>
              {currentParentLabel}
            </div>
            <div className="flex gap-1 justify-end">
              <button
                onClick={startEditing}
                className="bg-gray-200 hover:bg-gray-300 px-1 border border-gray-400 text-xs"
                title={t('tree.edit')}
              >
                ✏️
              </button>
              <button 
                onClick={() => onAdd(item.id)}
                className="bg-blue-200 hover:bg-blue-300 px-1 border border-gray-400 text-xs"
                title={t('tree.add')}
              >
                ➕
              </button>
              <button 
                onClick={() => onDelete(item.id)}
                className="bg-red-200 hover:bg-red-300 px-1 border border-gray-400 text-xs"
                title={t('tree.remove')}
              >
                🗑️
              </button>
            </div>
          </div>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {sortTreeByID(item.children!).map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              parentId={item.id}
              getParentOptions={getParentOptions}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SapClassicTreeEnhancedProps {
  data?: TreeItemData[];
  onDataChange?: (data: TreeItemData[]) => void;
  onExportCSV?: () => void;
}

export function SapClassicTreeEnhanced({ data = defaultTreeData, onDataChange, onExportCSV }: SapClassicTreeEnhancedProps) {
  const [treeData, setTreeData] = useState<TreeItemData[]>(() =>
    sortTreeByID(data && data.length > 0 ? data : defaultTreeData)
  );
  const { t } = useLanguage();
  const flattenedNodes = useMemo(() => flattenTreeWithPaths(treeData), [treeData]);

  const getParentOptions = useCallback((itemId: string): ParentOption[] => {
    const currentItem = findItemById(treeData, itemId);
    const excludedIds = new Set<string>([itemId]);

    collectDescendantIds(currentItem).forEach(id => excludedIds.add(id));

    const options = flattenedNodes
      .filter(node => !excludedIds.has(node.id))
      .map(node => ({
        id: node.id,
        label: `${node.pathDescriptions.join(' / ')} (${node.code})`
      }));

    return [{ id: null, label: '(root level)' }, ...options];
  }, [flattenedNodes, treeData]);

  // Update internal state when data prop changes
  useEffect(() => {
    if (!Array.isArray(data)) {
      setTreeData(sortTreeByID(defaultTreeData));
      return;
    }

    if (data.length === 0) {
      setTreeData([]);
      return;
    }

    setTreeData(sortTreeByID(data));
  }, [data]);
  
  const updateTreeData = (newData: TreeItemData[]) => {
    const sortedData = sortTreeByID(newData);
    setTreeData(sortedData);
    onDataChange?.(sortedData);
  };

  const findAndUpdateItem = (items: TreeItemData[], targetId: string, updatedItem: TreeItemData): TreeItemData[] => {
    return items.map(item => {
      if (item.id === targetId) {
        return { ...updatedItem, children: item.children };
      }
      if (item.children) {
        return {
          ...item,
          children: findAndUpdateItem(item.children, targetId, updatedItem)
        };
      }
      return item;
    });
  };

  const findAndDeleteItem = (items: TreeItemData[], targetId: string): TreeItemData[] => {
    let changed = false;

    const nextItems = items.reduce<TreeItemData[]>((acc, item) => {
      if (item.id === targetId) {
        changed = true;
        return acc;
      }

      if (item.children) {
        const updatedChildren = findAndDeleteItem(item.children, targetId);
        if (updatedChildren !== item.children) {
          changed = true;
          acc.push({
            ...item,
            children: updatedChildren.length > 0 ? updatedChildren : undefined
          });
          return acc;
        }
      }

      acc.push(item);
      return acc;
    }, []);

    return changed ? nextItems : items;
  };

  const addNewItem = (parentId: string) => {
    const existingIds = new Set(collectAllIds(treeData));
    const numericIds = collectNumericIds(treeData);

    let candidateId: string;

    if (numericIds.length > 0) {
      let nextNumericId = Math.max(...numericIds) + 1;
      while (existingIds.has(nextNumericId.toString())) {
        nextNumericId += 1;
      }
      candidateId = nextNumericId.toString();
    } else {
      candidateId = generateStringId(existingIds);
    }

    const newCode = candidateId.startsWith('NEW-') ? candidateId : `NEW-${candidateId}`;

    const newItem: TreeItemData = {
      id: candidateId,
      code: newCode,
      description: 'New Item',
      type: 'part',
      quantity: 1,
      unit: 'EA'
    };

    const addToParent = (items: TreeItemData[]): TreeItemData[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem]
          };
        }
        if (item.children) {
          return {
            ...item,
            children: addToParent(item.children)
          };
        }
        return item;
      });
    };

    updateTreeData(addToParent(treeData));
  };

  const collectAllIds = (items: TreeItemData[]): string[] => {
    const ids: string[] = [];
    items.forEach(item => {
      ids.push(item.id);
      if (item.children) {
        ids.push(...collectAllIds(item.children));
      }
    });
    return ids;
  };

  const collectNumericIds = (items: TreeItemData[]): number[] => {
    return collectAllIds(items)
      .map(id => Number.parseInt(id, 10))
      .filter(num => Number.isFinite(num));
  };

  const generateStringId = (existingIds: Set<string>): string => {
    const createCandidate = () => {
      const base = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10).toUpperCase();
      return base.startsWith('NEW-') ? base : `NEW-${base}`;
    };

    let candidate = createCandidate();
    while (existingIds.has(candidate)) {
      candidate = createCandidate();
    }
    return candidate;
  };

  const handleUpdate = (updatedItem: TreeItemData, newParentId: string | null, previousParentId: string | null) => {
    if (newParentId === previousParentId) {
      updateTreeData(findAndUpdateItem(treeData, updatedItem.id, updatedItem));
      return;
    }

    const treeWithoutItem = findAndDeleteItem(treeData, updatedItem.id);

    if (newParentId === null) {
      updateTreeData([...treeWithoutItem, updatedItem]);
      return;
    }

    const insertIntoParent = (items: TreeItemData[]): [TreeItemData[], boolean] => {
      let inserted = false;

      const nextItems = items.map(item => {
        if (item.id === newParentId) {
          inserted = true;
          return {
            ...item,
            children: [...(item.children || []), updatedItem]
          };
        }

        if (item.children) {
          const [updatedChildren, childInserted] = insertIntoParent(item.children);
          if (childInserted) {
            inserted = true;
            return {
              ...item,
              children: updatedChildren
            };
          }
        }

        return item;
      });

      return [inserted ? nextItems : items, inserted];
    };

    const [treeWithInserted, inserted] = insertIntoParent(treeWithoutItem);

    if (!inserted) {
      updateTreeData([...treeWithoutItem, updatedItem]);
      return;
    }

    updateTreeData(treeWithInserted);
  };

  const handleDelete = (id: string) => {
    updateTreeData(findAndDeleteItem(treeData, id));
  };

  const exportToCSV = () => {
    const flattenTree = (items: TreeItemData[], parentId: string = ''): any[] => {
      const result: any[] = [];
      items.forEach(item => {
        result.push({
          id: item.id,
          code: item.code,
          description: item.description,
          type: item.type,
          quantity: item.quantity || '',
          unit: item.unit || '',
          parentId: parentId
        });
        if (item.children) {
          result.push(...flattenTree(item.children, item.id));
        }
      });
      return result;
    };

    const flatData = flattenTree(treeData);
    const headers = ['id', 'code', 'description', 'type', 'quantity', 'unit', 'parentId'];
    const csvContent = [
      headers.join(','),
      ...flatData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sap_hierarchy_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-white border border-gray-400 h-full overflow-auto">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-400 p-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs">{t('main.technical_position')}</span>
          <input 
            type="text" 
            value={getFirstRootCode(treeData)} 
            className="border border-gray-400 px-1 py-0 text-xs w-24 bg-white"
            readOnly
          />
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <span>{t('main.designation')}</span>
        </div>
      </div>
      
      {/* Column Headers */}
      <div className="bg-gray-200 border-b border-gray-400 p-1">
        <div className="grid tree-grid gap-1 text-xs">
          <div>{t('tree.code')}</div>
          <div>{t('tree.description')}</div>
          <div className="text-center">{t('tree.quantity')}</div>
          <div className="text-center">{t('tree.unit')}</div>
          <div className="text-center">{t('tree.type')}</div>
          <div className="text-center">Parent</div>
          <div className="text-center">Actions</div>
        </div>
      </div>

      {/* Tree Content */}
      <div>
        {treeData.map((item) => (
          <TreeItem
            key={item.id}
            item={item}
            level={0}
            parentId={null}
            getParentOptions={getParentOptions}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAdd={addNewItem}
          />
        ))}
      </div>
    </div>
  );
}