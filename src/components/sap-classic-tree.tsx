import { useState } from 'react';

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

interface TreeItemProps {
  item: TreeItemData;
  level: number;
}

function TreeItem({ item, level }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(item.isExpanded || false);
  
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
  
  const getRowColor = () => {
    switch (item.type) {
      case 'location':
        return 'bg-blue-50';
      case 'equipment':
        return 'bg-green-50';
      case 'assembly':
        return 'bg-yellow-50';
      case 'part':
        return 'bg-orange-50';
      default:
        return 'bg-white';
    }
  };
  
  return (
    <div>
      <div 
        className={`flex items-center hover:bg-gray-100 border-b border-gray-200 ${getRowColor()}`}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
      >
        <button 
          className="w-4 h-4 text-xs mr-1"
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        >
          {getIcon()}
        </button>
        
        <div className="flex-1 grid grid-cols-12 gap-1 py-1 text-xs">
          <div className="col-span-2 text-blue-600">{item.code}</div>
          <div className="col-span-6">{item.description}</div>
          <div className="col-span-1 text-center">{item.quantity || ''}</div>
          <div className="col-span-1 text-center">{item.unit || ''}</div>
          <div className="col-span-2 text-center">
            {item.type === 'location' && '🏭'}
            {item.type === 'equipment' && '🔧'}
            {item.type === 'assembly' && '📦'}
            {item.type === 'part' && '🔩'}
          </div>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {sortTreeByID(item.children!).map((child) => (
            <TreeItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SapClassicTreeProps {
  data?: TreeItemData[];
}

export function SapClassicTree({ data = defaultTreeData }: SapClassicTreeProps) {
  const treeData = data.length > 0 ? sortTreeByID(data) : sortTreeByID(defaultTreeData);
  
  return (
    <div className="bg-white border border-gray-400 h-full overflow-auto">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-400 p-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs">Poste technique</span>
          <input 
            type="text" 
            value="031T2-K2" 
            className="border border-gray-400 px-1 py-0 text-xs w-24 bg-white"
            readOnly
          />
          <span className="text-xs">Dét.valid</span>
          <input 
            type="text" 
            value="2023.09.23" 
            className="border border-gray-400 px-1 py-0 text-xs w-20 bg-white"
            readOnly
          />
          <div className="ml-auto flex gap-1">
            <button className="w-5 h-5 bg-yellow-400 border border-gray-400 text-xs">📋</button>
            <button className="w-5 h-5 bg-gray-200 border border-gray-400 text-xs">📊</button>
            <button className="w-5 h-5 bg-gray-200 border border-gray-400 text-xs">🔍</button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <span>Désignation</span>
        </div>
      </div>
      
      {/* Column Headers */}
      <div className="bg-gray-200 border-b border-gray-400 p-1">
        <div className="grid grid-cols-12 gap-1 text-xs">
          <div className="col-span-2">Code</div>
          <div className="col-span-6">Description</div>
          <div className="col-span-1 text-center">Qté</div>
          <div className="col-span-1 text-center">Unité</div>
          <div className="col-span-2 text-center">Type</div>
        </div>
      </div>
      
      {/* Tree Content */}
      <div>
        {treeData.map((item) => (
          <TreeItem key={item.id} item={item} level={0} />
        ))}
      </div>
    </div>
  );
}