import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, RefreshCw, Save, Plus, Trash2, Edit, Copy } from 'lucide-react';

export function SapToolbar() {
  return (
    <div className="border-b border-gray-300 bg-gray-50 p-2">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="outline" size="sm" className="h-7 px-2">
          <Save className="w-3 h-3 mr-1" />
          Save
        </Button>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <Plus className="w-3 h-3 mr-1" />
          Create
        </Button>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <Edit className="w-3 h-3 mr-1" />
          Change
        </Button>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <Copy className="w-3 h-3 mr-1" />
          Copy
        </Button>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <Trash2 className="w-3 h-3 mr-1" />
          Delete
        </Button>
        <div className="border-l border-gray-300 h-6 mx-2"></div>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600 min-w-fit">Search:</label>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <Input 
            placeholder="Enter equipment or location ID..."
            className="h-7 pl-7 text-xs border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}