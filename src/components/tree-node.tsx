import { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, Wrench, Package } from 'lucide-react';

export interface TreeNodeData {
  id: string;
  name: string;
  type: 'functional-location' | 'equipment' | 'material';
  code?: string;
  children?: TreeNodeData[];
}

interface TreeNodeProps {
  node: TreeNodeData;
  level: number;
}

export function TreeNode({ node, level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasChildren = node.children && node.children.length > 0;
  
  const getIcon = () => {
    switch (node.type) {
      case 'functional-location':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'equipment':
        return <Wrench className="w-4 h-4 text-green-600" />;
      case 'material':
        return <Package className="w-4 h-4 text-orange-600" />;
    }
  };
  
  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <div className="select-none">
      <div 
        className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer"
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={toggleExpanded}
      >
        <div className="flex items-center w-6">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>
        <div className="flex items-center gap-2 flex-1">
          {getIcon()}
          <span className="text-sm">
            {node.code && (
              <span className="text-gray-600 mr-2">{node.code}</span>
            )}
            {node.name}
          </span>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}