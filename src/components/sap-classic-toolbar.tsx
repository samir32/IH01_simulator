export function SapClassicToolbar() {
  return (
    <div className="bg-gray-200 border-b border-gray-400 px-2 py-1 flex items-center gap-1">
      {/* SAP Standard Toolbar Icons */}
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
      </button>
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        <div className="w-3 h-3 bg-red-500"></div>
      </button>
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        <div className="w-3 h-3 bg-blue-500"></div>
      </button>
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        <div className="w-3 h-3 bg-yellow-500"></div>
      </button>
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        <div className="w-3 h-3 bg-purple-500"></div>
      </button>
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        <div className="w-3 h-3 bg-orange-500"></div>
      </button>
      
      <div className="w-px h-5 bg-gray-400 mx-1"></div>
      
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        📁
      </button>
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        💾
      </button>
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        🖨️
      </button>
      
      <div className="w-px h-5 bg-gray-400 mx-1"></div>
      
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        ↩️
      </button>
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        ↪️
      </button>
      
      <div className="w-px h-5 bg-gray-400 mx-1"></div>
      
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        🔍
      </button>
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        ⚙️
      </button>
      
      <div className="flex-1"></div>
      
      <button className="w-6 h-6 bg-gray-200 border border-gray-300 hover:bg-gray-300 flex items-center justify-center">
        ❓
      </button>
    </div>
  );
}