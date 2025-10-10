import { useState } from 'react';
import { SapClassicTreeEnhanced, TreeItemData } from './components/sap-classic-tree-enhanced';
import { SapClassicToolbar } from './components/sap-classic-toolbar';
import { FileUploader } from './components/file-uploader';
import { LanguageProvider, useLanguage } from './components/language-context';
import { LanguagePicker } from './components/language-picker';

function AppContent() {
  const [treeData, setTreeData] = useState<TreeItemData[]>([]);
  const { t } = useLanguage();

  const handleDataLoad = (data: TreeItemData[]) => {
    setTreeData(data);
  };

  const handleDataChange = (data: TreeItemData[]) => {
    setTreeData(data);
  };

  const handleExportCSV = () => {
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
    <div className="h-screen flex flex-col bg-gray-100 font-sans" style={{ fontFamily: 'MS Sans Serif, sans-serif' }}>
      {/* Windows Title Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-2 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white/20 rounded-sm flex items-center justify-center text-xs">C</div>
          <span>{t('sap')}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguagePicker />
          <div className="flex items-center gap-1">
            <button className="w-4 h-4 bg-gray-500 hover:bg-gray-600 text-white text-xs flex items-center justify-center">_</button>
            <button className="w-4 h-4 bg-gray-500 hover:bg-gray-600 text-white text-xs flex items-center justify-center">□</button>
            <button className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white text-xs flex items-center justify-center">×</button>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-gray-200 border-b border-gray-400 px-2 py-1">
        <div className="flex gap-4 text-xs">
          <button className="hover:bg-gray-300 px-2 py-1">{t('menu.edit')}</button>
          <button className="hover:bg-gray-300 px-2 py-1">{t('menu.process')}</button>
          <button className="hover:bg-gray-300 px-2 py-1">{t('menu.jump')}</button>
          <button className="hover:bg-gray-300 px-2 py-1">{t('menu.other_functions')}</button>
          <button className="hover:bg-gray-300 px-2 py-1">{t('menu.environment')}</button>
          <button className="hover:bg-gray-300 px-2 py-1">{t('menu.options')}</button>
          <button className="hover:bg-gray-300 px-2 py-1">{t('menu.system')}</button>
          <button className="hover:bg-gray-300 px-2 py-1">{t('menu.help')}</button>
        </div>
      </div>

      {/* File Operations */}
      <FileUploader onDataLoad={handleDataLoad} onExportCSV={handleExportCSV} />

      {/* Main Content Area */}
      <div className="flex-1 p-2">
        <div className="h-full border border-gray-400">
          <div className="bg-gray-100 border-b border-gray-400 px-2 py-1 text-xs">
            <span>{t('main.title')}</span>
          </div>
          <SapClassicTreeEnhanced data={treeData} onDataChange={handleDataChange} onExportCSV={handleExportCSV} />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-200 border-t border-gray-400 px-2 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{t('status.ready')}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>IH01</span>
          <span>INS</span>
          <div className="w-16 h-3 bg-white border border-gray-400"></div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}