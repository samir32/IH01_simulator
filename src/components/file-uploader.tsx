import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { useLanguage } from './language-context';

interface TreeItemData {
  id: string;
  code: string;
  description: string;
  type: 'location' | 'equipment' | 'assembly' | 'part';
  quantity?: number;
  unit?: string;
  parentId?: string;
  children?: TreeItemData[];
}

interface FileUploaderProps {
  onDataLoad: (data: TreeItemData[]) => void;
  onExportCSV?: () => void;
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

function toCSVRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentValue += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i += 1;
      }
      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = '';
      continue;
    }

    currentValue += char;
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue);
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

export function FileUploader({ onDataLoad, onExportCSV }: FileUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const parseCSV = (text: string): TreeItemData[] => {
    const rows = toCSVRows(text);
    const nonEmptyRows = rows.filter(row => row.some(cell => cell.trim().length > 0));
    if (nonEmptyRows.length === 0) {
      return [];
    }

    const [headerRow, ...rawDataRows] = nonEmptyRows;
    const header = headerRow.map(cell => cell.trim().toLowerCase());
    const headerIndexMap = new Map<string, number>();
    header.forEach((name, columnIndex) => {
      headerIndexMap.set(name, columnIndex);
      headerIndexMap.set(name.replace(/[^a-z0-9]/g, ''), columnIndex);
    });
    const dataRows = rawDataRows;

    const data = dataRows.map((row, index) => {
      const normalizeString = (value: string | undefined) =>
        value === undefined ? '' : value.trim();

      const ensureTreeType = (value: string | undefined): TreeItemData['type'] => {
        const normalized = normalizeString(value).toLowerCase();
        switch (normalized) {
          case 'location':
          case 'equipment':
          case 'assembly':
          case 'part':
            return normalized;
          default:
            return 'equipment';
        }
      };

      const getValue = (key: string) => {
        const normalizedKey = key.replace(/[^a-z0-9]/g, '');
        const columnIndex =
          headerIndexMap.get(key) ?? headerIndexMap.get(normalizedKey);
        return columnIndex !== undefined ? row[columnIndex] ?? '' : '';
      };

      const quantityValue = getValue('quantity') || getValue('qty');
      const parsedQuantity = (() => {
        const normalized = normalizeString(quantityValue);
        if (normalized === '') return undefined;
        const numeric = Number.parseFloat(normalized);
        return Number.isFinite(numeric) ? numeric : undefined;
      })();

      const providedId = normalizeString(getValue('id'));
      const providedCode = normalizeString(getValue('code'));
      const parentIdentifier =
        normalizeString(getValue('parentid')) ||
        normalizeString(getValue('parent_id')) ||
        normalizeString(getValue('parent'));

      const generatedId =
        providedId ||
        providedCode ||
        globalThis.crypto?.randomUUID?.() ||
        `generated-${Date.now().toString(36)}-${index}`;

      return {
        id: generatedId,
        code: providedCode || providedId || generatedId,
        description: normalizeString(getValue('description')),
        type: ensureTreeType(getValue('type')),
        quantity: parsedQuantity,
        unit: normalizeString(getValue('unit')),
        parentId: parentIdentifier || undefined
      } as const;
    });

    return sortTreeByID(buildHierarchy(data));
  };

  const buildHierarchy = (flatData: Array<Partial<TreeItemData>>): TreeItemData[] => {
    const itemMap = new Map<string, TreeItemData>();
    const rootItems: TreeItemData[] = [];

    // First pass: create all items
    flatData.forEach(row => {
      const parseQuantity = (value: unknown): number | undefined => {
        if (typeof value === 'number' && Number.isFinite(value)) {
          return value;
        }
        if (typeof value === 'string' && value.trim() !== '') {
          const parsed = Number.parseInt(value, 10);
          return Number.isFinite(parsed) ? parsed : undefined;
        }
        return undefined;
      };

      const parentIdValue =
        (row as Record<string, unknown>)['parentId'] ??
        (row as Record<string, unknown>)['parentid'] ??
        (row as Record<string, unknown>)['parent_id'] ??
        (row as Record<string, unknown>)['parent'];

      const normalizedParentId = (() => {
        if (typeof parentIdValue === 'string') {
          return parentIdValue.trim();
        }
        if (parentIdValue === undefined || parentIdValue === null) {
          return '';
        }
        return String(parentIdValue).trim();
      })();

      const item: TreeItemData = {
        id:
          row.id ||
          row.code ||
          globalThis.crypto?.randomUUID?.() ||
          `generated-${Math.random().toString(36).slice(2, 10)}`,
        code: row.code || '',
        description: row.description || '',
        type: (row.type || 'equipment') as TreeItemData['type'],
        quantity: parseQuantity(row.quantity),
        unit: row.unit || '',
        parentId: normalizedParentId || undefined,
        children: []
      };
      itemMap.set(item.id, item);
    });

    // Second pass: build hierarchy
    itemMap.forEach(item => {
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(item);
      } else {
        rootItems.push(item);
      }
    });

    return rootItems;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const data = parseCSV(text);
      onDataLoad(data);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the format.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      'id,code,description,type,quantity,unit,parentId',
      '1,PLANT-A,Manufacturing Plant A,location,,,',
      '15,LINE-02,Production Line 2,location,,,1',
      '2,LINE-01,Production Line 1,location,,,1',
      '105,CONV-002,Second Conveyor System,equipment,1,EA,2',
      '3,CONV-001,First Conveyor System,equipment,1,EA,2',
      '102,CONV-001-ASM03,Control Assembly,assembly,1,EA,3',
      '4,CONV-001-ASM01,Drive Assembly,assembly,1,EA,3',
      '7,CONV-001-ASM02,Belt Assembly,assembly,1,EA,3',
      '6,COUP-FLEX-001,Flexible Coupling,part,1,EA,4',
      '5,MOT-5HP-001,Motor 5HP Electric,part,1,EA,4',
      '9,TENS-001,Belt Tensioner,part,2,EA,7',
      '8,BELT-1200,Conveyor Belt 1200mm,part,1,EA,7',
      '10,PKG-001,Packaging Machine,equipment,1,EA,2',
      '11,PKG-001-ASM01,Sealing Unit Assembly,assembly,1,EA,10',
      '13,TEMP-001,Temperature Sensor,part,1,EA,11',
      '12,HEAT-001,Heating Element,part,2,EA,11'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sap_hierarchy_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-200 border-b border-gray-400 px-2 py-1 flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="bg-gray-300 border border-gray-400 px-2 py-1 text-xs hover:bg-gray-400 h-auto"
        variant="outline"
      >
        {isLoading ? t('upload.loading') : `📁 ${t('upload.upload_csv')}`}
      </Button>
      
      <Button
        onClick={downloadSampleCSV}
        className="bg-gray-300 border border-gray-400 px-2 py-1 text-xs hover:bg-gray-400 h-auto"
        variant="outline"
      >
        📥 {t('upload.download_sample')}
      </Button>
      
      {onExportCSV && (
        <Button
          onClick={onExportCSV}
          className="bg-gray-300 border border-gray-400 px-2 py-1 text-xs hover:bg-gray-400 h-auto"
          variant="outline"
        >
          📊 {t('tree.export_csv')}
        </Button>
      )}
    </div>
  );
}